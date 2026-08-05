# uni-app 项目 Vue 2 → Vue 3 升级计划

## Context（背景）

当前项目 `d:\test\uni-app-vue3` 是 HBuilderX 托管的 uni-app 项目（无根 `package.json`、无 `node_modules`），基于 Vue 2 + Vuex 3 + uView UI 2.x。用户要求升级为 Vue 3 形式，并已确认两项决策：**uView UI 替换为 uview-plus**、**Vuex 迁移到 Pinia**。

升级目标：项目能在 HBuilderX 以 Vue 3 + Vite 编译运行于微信小程序，原有功能（自定义 tabBar、分类页 mescroll 滚动、购物车角标、登录拦截、富文本解析、状态栏适配）保持等价行为。

### 关键调查结论（影响实施）
- **`storeId` / `deliveryType` 是已存在的 latent bug**：`store/index.js` 的 root state 为 `{}`，但 [cart.js](file:///d:/test/uni-app-vue3/store/modules/cart.js)、[user.js](file:///d:/test/uni-app-vue3/store/modules/user.js)、[http/index.js](file:///d:/test/uni-app-vue3/common/utils/http/index.js) 都读取 `rootState.storeId` / `store.state.deliveryType`，运行时始终为 `undefined`。迁移时新建 `app` store 持有这两个字段（初值仍 `undefined`），保持等价，并标注 TODO 由业务方后续补全。
- **[global.js:22](file:///d:/test/uni-app-vue3/common/mixins/global.js) `getRawType(v)` 是 bug**（参数名是 `val`），顺手修复为 `getRawType(val)`。
- **[tabBar.js:9-13](file:///d:/test/uni-app-vue3/common/mixins/tabBar.js) 的 `storeId` watcher 是死代码**（mixin 内未声明 storeId），迁移时移除。
- **mescroll-uni 的 `this.mescroll` 是普通对象**（非响应式），`this.$set` 对其本就无效，Vue 3 直接赋值完全等价。
- **uqrcode 无 Vue 2 API**，无需改动；custom-ui 不依赖 uview-ui，删 uview-ui 不影响它。
- **Vuex 实际使用面很窄**：仅 [App.vue](file:///d:/test/uni-app-vue3/App.vue)、[tabBar.js](file:///d:/test/uni-app-vue3/common/mixins/tabBar.js)、[category.vue](file:///d:/test/uni-app-vue3/pages/category/category.vue)、[http/index.js](file:///d:/test/uni-app-vue3/common/utils/http/index.js) 四处。
- 模板中**无 Vue 2 filter 管道语法**（`{{ x | filter }}`），删除 `Vue.filter` 无影响。

---

## 实施步骤

### 1. 构建/配置三件套
- **新建 `package.json`**：声明 `pinia`、`uview-plus`、`vue`（≥3.4）、`sass` 依赖。uni-app 编译器由 HBuilderX 内置，不要写 `@dcloudio/*`。
- **[manifest.json](file:///d:/test/uni-app-vue3/manifest.json)**：根对象插入 `"vueVersion": "3"`。
- **新建 `vite.config.js`**：HBuilderX Vue 3 走 Vite，`vue.config.js` 被忽略。用 `build.minify:'terser'` + `terserOptions.compress.drop_console:true`、`pure_funcs:['__f__']` 还原原 drop_console 行为。**删除 `vue.config.js`**。

### 2. 删除 uview-ui + 改 easycom
- **删除整个 [components/uview-ui/](file:///d:/test/uni-app-vue3/components/uview-ui) 目录**（项目代码无显式 JS import，仅 easycom + scss + main.js 引用）。
- **[pages.json:3](file:///d:/test/uni-app-vue3/pages.json)** easycom 的 `^u-(.*)` 改为 `"uview-plus/components/u-$1/u-$1.vue"`（npm 路径）。其余 `c-*`/`p-*` 规则不动。

### 3. 重写 [main.js](file:///d:/test/uni-app-vue3/main.js)
导出 `createApp()` 返回 `{ app, pinia }`：
```js
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App'
import * as apis from '@/common/apis'
import * as utils from '@/common/utils'
import * as CONFIG from '@/common/config'
import customUI from '@/components/custom-ui'
import uviewPlus from 'uview-plus'
import { global } from '@/common/mixins'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.config.globalProperties.$utils = utils
  app.config.globalProperties.$apis = apis
  app.config.globalProperties.$CONFIG = CONFIG
  app.use(pinia).use(customUI).use(uviewPlus).mixin(global)
  return { app, pinia }
}
```
删除 `new Vue`、`Vue.prototype.*`、`Vue.config.productionTip`、`App.mpType`、`app.$mount()`。uview-plus 的 `app.use` 内部挂载 `uni.$u` / `$u` / `$uGetRect` 等方法，[category.vue](file:///d:/test/uni-app-vue3/pages/category/category.vue) 的 `this.$uGetRect` 继续可用。

### 4. Pinia stores 重写
- **删除 [store/modules/index.js](file:///d:/test/uni-app-vue3/store/modules/index.js)**（`require.context` 是 webpack API，Vite 不支持）。
- **新建 [store/app.js](file:///d:/test/uni-app-vue3/store/app.js)**：`useAppStore` 持有 `storeId`/`deliveryType`（初值 `undefined`，等价迁移原 root state 读取）。
- **[store/index.js](file:///d:/test/uni-app-vue3/store/index.js)**：改为 re-export 各 store hook（`useUserStore`/`useCartStore`/`useLocationStore`/`useStatusBarStore`/`useAppStore`）。不再 `export default store` 实例。
- **[store/modules/cart.js](file:///d:/test/uni-app-vue3/store/modules/cart.js)**：`defineStore('cart', { state, getters, actions })`。mutations 合并进 actions（`this.cartInfo = ...`、`this.setCartInfo()`、`this.getCartlist()`）。`rootState.storeId` → action 内 `useAppStore().storeId`。`dispatch('updateTabarCount')` → `this.updateTabarCount()`。`debouncePromise` 包裹的 action 保持（`this` 在 Pinia action 内是 store 代理，`fn.apply(this)` 仍正确）。
- **[store/modules/user.js](file:///d:/test/uni-app-vue3/store/modules/user.js)**：同上模式。跨 store 的 `commit('cart/clearCartInfo', null, {root:true})` → `useCartStore().clearCartInfo()`。`loginPromise` 模块级闭包保留。`rootState.storeId` → `useAppStore().storeId`。
- **[store/modules/location.js](file:///d:/test/uni-app-vue3/store/modules/location.js)**：mutations 合进 actions（`changeAuthorize`/`changeLocation` 直接 `this.xxx = payload`）。
- **[store/modules/statusBar.js](file:///d:/test/uni-app-vue3/store/modules/statusBar.js)**：`initBarInfo` 内 `state.xxx =` 改 `this.xxx =`，`uni.$u.sys('getWindowInfo')` 在 uview-plus 中可用。

### 5. [common/utils/http/index.js](file:///d:/test/uni-app-vue3/common/utils/http/index.js) Pinia 化
删除 `import store from '@/store'`，改为按需 import `useUserStore`、`useAppStore`。**store hook 必须在函数体内调用**（请求时才执行，避免模块加载时 pinia 未创建）：
- `store.dispatch('user/login')` → `useUserStore().login()`
- `store.state.user.token` → `useUserStore().token`
- `store.state.deliveryType` → `useAppStore().deliveryType`

### 6. mixins 重写
- **[common/mixins/index.js](file:///d:/test/uni-app-vue3/common/mixins/index.js)**：`require.context` → 显式 `import global from './global'; import tabBar from './tabBar'; export { global, tabBar }`。
- **[common/mixins/global.js](file:///d:/test/uni-app-vue3/common/mixins/global.js)**：修复 `getRawType(v)` → `getRawType(val)`，其余 mixin 形态不变。
- **[common/mixins/tabBar.js](file:///d:/test/uni-app-vue3/common/mixins/tabBar.js)**：`mapGetters('cart',['goodsCount'])` → computed 中 `useCartStore().goodsCount`；`this.$store.dispatch('cart/updateTabarCount')` → `useCartStore().updateTabarCount()`；移除死代码 `storeId` watcher；`this.$mp.page.getTabBar()` 加可选链保护（uni-app Vue 3 mp-weixin 自定义 tabBar 仍支持）。

### 7. custom-ui 适配
- **[components/custom-ui/libs/mixins/index.js](file:///d:/test/uni-app-vue3/components/custom-ui/libs/mixins/index.js)**：`require.context` → 显式 `import customInfo from './customInfo'; export default { customInfo }`。
- **[components/custom-ui/index.js](file:///d:/test/uni-app-vue3/components/custom-ui/index.js)**：`install(Vue){...Vue.mixin(item)}` → `install(app){...app.mixin(item)}`（Vue 3 install 参数是 app 实例）。

### 8. [App.vue](file:///d:/test/uni-app-vue3/App.vue)
删除 vuex import 与 mapMutations/mapActions。**用 Options API**（onLaunch 内 `this` 指向实例，`this.$utils`/`this.$apis` 可用），onLaunch 内首行获取 store：
```js
import { useStatusBarStore, useLocationStore } from '@/store'
export default {
  onLaunch: function() {
    const statusBarStore = useStatusBarStore()
    const locationStore = useLocationStore()
    // #ifndef H5
    statusBarStore.initBarInfo()
    // #endif
    locationStore.onLocationChange()
    // ...其余 onLaunch 逻辑（网络监听、updateManager）原样保留，uni.$u.route 在 uview-plus 仍可用
  }
}
```
`<style>` 中 `@import '@/components/uview-ui/index.scss'` → `@import 'uview-plus/index.scss'`。

### 9. [pages/category/category.vue](file:///d:/test/uni-app-vue3/pages/category/category.vue) 局部改
- 删 `import { mapState, mapGetters } from 'vuex'`，加 `import { useUserStore, useCartStore } from '@/store'`。
- `...mapGetters(['hasLogin'])` → computed `hasLogin() { return useUserStore().hasLogin }`。
- `this.$store.dispatch('cart/getCartlist')` → `useCartStore().getCartlist()`。
- MescrollMixin / WxsMixin / tabBar mixin 不动；`this.$uGetRect`、`this.$apis`、`this.$utils` 不变。

### 10. jyf-parser 补丁（`$children` 移除是核心难点）
- **[jyf-parser.vue](file:///d:/test/uni-app-vue3/components/jyf-parser/jyf-parser.vue)**：
  - `beforeDestroy` → `beforeUnmount`（行 170）。
  - 行 709 `this.$set(this.imgs, id, val)` → `this.imgs[id] = val`。
  - 行 444-484 的 `f(this.$children)` 递归遍历收集 `trees` 子组件（imgList/videoContexts/anchors）→ 改用 **provide/inject 注册表**：jyf-parser `provide()` 暴露 `registerTrees`/`unregisterTrees`，`data` 加 `treesRegistry:[]`；`$nextTick` 回调内遍历 `this.treesRegistry` 替代递归。
- **[libs/trees.vue](file:///d:/test/uni-app-vue3/components/jyf-parser/libs/trees.vue)**：
  - 行 265/279/281 三处 `this.$set(...)` → 直接赋值（`node.i = ...`、`node.attrs.src = src`、`node.err = 1`）。
  - 新增 `inject: { registerTrees, unregisterTrees }`，`mounted` 调 `registerTrees(this)`，`beforeUnmount` 调 `unregisterTrees(this)`（若已有同名钩子需合并）。trees 是递归组件，所有层级实例自注册，语义等价于原递归遍历。

### 11. mescroll-uni 补丁
- **[mescroll-uni/components/mescroll-uni/wxs/mixins.js](file:///d:/test/uni-app-vue3/components/mescroll-uni/components/mescroll-uni/wxs/mixins.js)** 行 70/72/100：`this.$set(this.mescroll, key, val)` → `this.mescroll[key] = val`（mescroll 是普通对象，等价）。`uni.$on`/`uni.$off` 是 uni-app 全局事件 API，不动。

---

## 文件改动总览

| 操作 | 文件 |
|---|---|
| 新建 | `package.json`、`vite.config.js`、`store/app.js` |
| 删除 | `vue.config.js`、`components/uview-ui/`（整目录）、`store/modules/index.js` |
| 重写 | `main.js`、`manifest.json`（插 vueVersion）、`App.vue`、`pages.json`（easycom）、`store/index.js`、`store/modules/{cart,user,location,statusBar}.js`、`common/utils/http/index.js`、`common/mixins/{index,global,tabBar}.js`、`components/custom-ui/index.js`、`components/custom-ui/libs/mixins/index.js` |
| 局部改 | `pages/category/category.vue` |
| 补丁 | `components/jyf-parser/jyf-parser.vue`、`components/jyf-parser/libs/trees.vue`、`components/mescroll-uni/components/mescroll-uni/wxs/mixins.js` |
| 不动 | `components/uqrcode/`、`custom-tab-bar/`（原生 wx Component）、`common/styles/`、`common/utils/crypto-js/` |

---

## 风险与缓解
- **uview-plus easycom npm 路径解析失败** → 切 uni_modules 安装路径 `@/uni_modules/uview-plus/components/u-$1/u-$1.vue`。
- **HBuilderX 不识别 vite.config.js** → drop_console 不生效（仅体积），功能不受损；可暂留 vue.config.js 作 fallback。
- **`debouncePromise` 在 Pinia action 中 `this` 语义** → 验证 `getCartlistDebounce` 触发；若失效改 action 内显式 `useCartStore().getCartlist()`。
- **jyf-parser provide/inject 注册时序** → trees `mounted` 先于父 `setContent` 的 `$nextTick`，注册表已填充；异常时延迟一帧。
- **custom-ui 组件隐式依赖 uview-ui mixin 方法（如 `$uGetRect`）** → 运行时报错再针对性补丁。
- **`useCartStore()` 在 tabBar mixin computed 中调用时机** → 页面渲染时 pinia 已就绪，风险低。

---

## 验证（端到端）
在 HBuilderX 中：运行 → 运行到小程序模拟器 → 微信开发者工具，逐项检查：
1. **编译通过**，控制台无报错。
2. **启动日志**：App.vue onLaunch 的 `console.log('this.$utils', ...)`、`console.log('this.$apis', ...)` 正常打印（验证 globalProperties）。
3. **uview-plus 注入**：`uni.$u` 非 undefined，`uni.$u.route` 是函数。
4. **首页/分类页渲染**：u-xxx 组件正常；分类页 mescroll 下拉/上拉、商品列表加载、`this.$uGetRect` 正常。
5. **购物车 tabBar 角标**：登录有商品时显示数字（验证 `useCartStore().goodsCount` + `$mp.page.getTabBar().setData`）。
6. **登录流程**：401 → `useUserStore().login()` 拉起微信登录（验证 http 拦截器 Pinia 调用）。
7. **退出登录**：`useUserStore().logout()` → `useCartStore().clearCartInfo()` 清空购物车（验证跨 store 调用）。
8. **状态栏/位置**：自定义导航栏高度正确；`onLocationChange` 订阅正常。
9. **jyf-parser 富文本**：渲染、图片加载、video、`load` 事件正常（验证 `$children`→provide/inject 改造）。
10. **网络错误页/更新检测**：断网跳 errorPage；`getUpdateManager` 流程正常。
11. **生产构建**：发行 → 小程序-微信，产物中 console.* 被移除（验证 vite.config.js terser）。

> 注：步骤 1 后需在 HBuilderX 重新打开项目触发 `npm install`（或终端 `npm install`）拉取 pinia/uview-plus，否则编译报模块缺失。
