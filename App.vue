<script>
	import {
		useStatusBarStore,
		useLocationStore
	} from '@/store';
	export default {
		onLaunch: function() {
			const statusBarStore = useStatusBarStore()
			const locationStore = useLocationStore()
			// #ifndef H5
			statusBarStore.initBarInfo();
			// #endif
			locationStore.onLocationChange()
			console.log('this.$utils', this.$utils)
			console.log('this.$apis', this.$apis)

			uni.onNetworkStatusChange(function(res) {
				if (res.networkType === 'none' || res.networkType === 'offline') {
					// 网络断开，跳转到网络出错页面
					uni.$u.route({
						url: '/pages/errorPage/errorPage',
						type: 'redirectTo',
						params: {
							type: 'fail'
						}
					})
				} else {
					// 网络恢复，可以选择回到之前的页面或做其他处理
				}
			})
			uni.getNetworkType({
				success: function(res) {
					if (res.networkType === 'none' || res.networkType === 'offline') {
						uni.$u.route({
							url: '/pages/errorPage/errorPage',
							type: 'redirectTo',
							params: {
								type: 'fail'
							}
						})
					}
				}
			})

			const updateManager = uni.getUpdateManager();
			updateManager?.onCheckForUpdate?.(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，将强制重启应用以更新。',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用applyUpdate应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: '提示',
							content: '检查到有新版本，但下载失败，请检查网络设置后手动更新。',
							confirmText: '知道了'
						});
					});
				}
			});
		}
	};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'uview-plus/index.scss';
	@import '@/components/custom-ui/index.scss';
	@import '@/common/styles/index.scss';

	page {
		background: #f8f8fb;
	}
</style>
