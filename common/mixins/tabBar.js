import {
	useCartStore
} from '@/store'
export default {
	computed: {
		goodsCount() {
			return useCartStore().goodsCount
		},
	},
	watch: {
		goodsCount() {
			// 注意：$scope.page.getTabBar() 在 uni-app Vue 3 mp-weixin 自定义 tabBar 仍可用
			this.$scope?.getTabBar?.()?.setData?.({
				goodsCount: this.goodsCount
			})
		}
	},
	onShow() {
		if (typeof this.$scope?.getTabBar == 'function') {
			this.$scope?.getTabBar?.()?.setData?.({
				selected: this.tabBarIndex,
				goodsCount: this.goodsCount
			})
		}
	}
}