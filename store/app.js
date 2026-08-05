import { defineStore } from 'pinia'

// 等价迁移原 Vuex root state（{} 空）+ cart.js / user.js / http 中对 rootState.storeId / rootState.deliveryType / store.state.deliveryType 的读取。
// 注意：原项目这些值运行时始终为 undefined，此处保持等价行为。
// TODO: 业务方后续在此 store 中接入真实 storeId / deliveryType 的赋值逻辑。
export const useAppStore = defineStore('app', {
	state: () => ({
		storeId: undefined,
		deliveryType: undefined
	}),
	getters: {},
	actions: {}
})
