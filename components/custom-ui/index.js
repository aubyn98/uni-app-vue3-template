import mixins from './libs/mixins'
export default {
	install(app) {
		// Vue 3: install 参数为 app 实例，app.mixin 替代 Vue.mixin
		Object.values(mixins).forEach(item => app.mixin(item))
	}
}
