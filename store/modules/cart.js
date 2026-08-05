import {
	defineStore
} from 'pinia'
import * as apis from '@/common/apis'
import {
	debouncePromise
} from '@/common/utils'
import {
	useAppStore
} from '@/store/app'

export const useCartStore = defineStore('cart', {
	state: () => ({
		cartInfo: {},
	}),
	getters: {
		goodsCount(state) {
			return state.cartInfo?.count || ''
		},
		goodsList(state) {
			return state.cartInfo?.items || []
		},
		activityInfos(state) {
			return state.cartInfo?.activityInfos || []
		},
		cartGoodsDict(state) {
			return (state.cartInfo?.items || []).reduce((dict, item) => {
				dict[item.goodsId] = item.quantity
				return dict
			}, {})
		}
	},
	actions: {
		clearCartInfo() {
			this.cartInfo = {}
		},
		setCartInfo(payload) {
			this.cartInfo = payload
		},
		goSettle() {
			const appStore = useAppStore()
			const storeId = appStore.storeId
			const deliveryType = appStore.deliveryType
			return apis.pretreatment_order({
				storeId,
				deliveryType
			}).then(() => {
				uni.$u.route('/packageGoods/pages/orderSubmit/orderSubmit', {
					storeId,
				});
			})
		},
		clearCart({
			storeId,
			loading = false,
		} = {}) {
			const appStore = useAppStore()
			const finalStoreId = storeId ?? appStore.storeId
			return apis.clean_cart({
				storeId: finalStoreId
			}, {
				loading
			}).then(() => {
				return this.getCartlist()
			})
		},
		updateCart({
			loading = false,
			...params
		} = {}) {
			return apis.update_cart(params, {
				loading
			}).then(() => {
				return this.getCartlistDebounce()
			})
		},
		getCartlistDebounce: debouncePromise(function() {
			return this.getCartlist()
		}, 300),
		getCartlist({
			storeId,
			loading = false
		} = {}) {
			const appStore = useAppStore()
			const finalStoreId = storeId ?? appStore.storeId
			return apis.get_cart({
				storeId: finalStoreId,
			}, {
				loading
			}).then(res => {
				this.setCartInfo(res.data)
				return res.data
			})
		},
	},
})