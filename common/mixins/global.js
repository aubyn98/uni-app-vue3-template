import {
	getRawType
} from '@/common/utils'
export default {
	data() {
		return {
			mixLoadingCount: 0,
			mixLoading: false
		}
	},
	methods: {
		startLoading() {
			this.mixLoadingCount++
			this.mixLoading = true
		},
		endLoading() {
			if (this.mixLoadingCount > 0) this.mixLoadingCount--
			if (this.mixLoadingCount === 0) this.mixLoading = false
		},
		callMixLoading(val, ...argvs) {
			this.startLoading();
			const valType = getRawType(val)
			if (['Function', 'AsyncFunction'].includes(valType)) {
				return val(...argvs).finally(() => {
					this.endLoading();
				})
			}
			if (valType === 'Promise') {
				return val.finally(() => {
					this.endLoading();
				})
			}
			this.endLoading();
			return val
		},
		goBack() {
			const pages = getCurrentPages()
			pages.length > 1 ? uni.navigateBack() : uni.switchTab({
				url: '/pages/home/home'
			})
		}
	}
}
