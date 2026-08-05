import {
	getSearchStr
} from './magic'

export function getLocation(check = false) {
	return new Promise((success, reject) => {
		uni.getLocation({
			altitude: true,
			type: 'gcj02',
			success,
			fail: function(err) {
				if (check) {
					uni.getNetworkType({
						success: function(res) {
							if (res.networkType == 'none') {
								//无网络
							} else {
								//有网络没有定位
								const pages = getCurrentPages()
								const page = pages[pages.length - 1];
								if (page.route.indexOf('errorPage') != -1) return
								uni.redirectTo({
									url: '/packageOther/pages/errorPage/errorPage' +
										getSearchStr({
											url: page.$page.fullPath,
											message: '定位失败',
											type: 2
										})
								})
							}
						}
					});
				}
				reject(err)
			}
		})
	})
}

export function openLocation({
	latitude,
	longitude,
	name = '',
	address = ''
}) {
	return new Promise((resolve, reject) => {
		uni.openLocation({ //?使用微信内置地图查看位置。
			latitude: Number(latitude), //要去地点的纬度
			longitude: Number(longitude), ///要去地点的经度-地址
			name,
			address,
			success: resolve,
			fail: function(err) {
				uni.showToast({
					icon: 'none',
					title: err.errMsg
				})
				reject(err)
			}
		})
	})
}