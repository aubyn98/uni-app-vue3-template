const scopeDict = {
	userLocation: 'scope.userLocation', // 	精确地理位置 wx.getLocation, wx.startLocationUpdate
	userFuzzyLocation: 'scope.userFuzzyLocation', // 模糊地理位置 wx.getFuzzyLocation	
	userLocationBackground: 'scope.userLocationBackground', // 后台定位 wx.startLocationUpdateBackground
	record: 'scope.record', // 	麦克风 live-pusher组件, wx.startRecord, wx.joinVoIPChat, RecorderManager.start
	camera: 'scope.camera', // 摄像头 camera组件, live-pusher组件, wx.createVKSession
	bluetooth: 'scope.bluetooth', // 蓝牙 wx.openBluetoothAdapter, wx.createBLEPeripheralServer
	writePhotosAlbum: 'scope.writePhotosAlbum', // 	添加到相册 wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum
	addPhoneContact: 'scope.addPhoneContact', // 	添加到联系人 wx.addPhoneContact
	addPhoneCalendar: 'scope.addPhoneCalendar', // 	添加到日历 	wx.addPhoneRepeatCalendar, wx.addPhoneCalendar
	werun: 'scope.werun', // 	微信运动步数 wx.getWeRunData
	address: 'scope.address', // 通讯地址（已取消授权，可以直接调用对应接口） wx.chooseAddress	
	invoiceTitle: 'scope.invoiceTitle', // 	发票抬头（已取消授权，可以直接调用对应接口） wx.chooseInvoiceTitle
	invoice: 'scope.invoice', // 	获取发票（已取消授权，可以直接调用对应接口） wx.chooseInvoice
	userInfo: 'scope.userInfo', // 用户信息 wx.getUserInfo 用户信息（小程序已回收，请使用头像昵称填写，小游戏可继续调用）
}
export function authorize({
	withSubscriptions,
	scope
} = {}) {
	withSubscriptions = withSubscriptions || false
	scope = scopeDict[scope] || ['scope.' + scope]
	return new Promise(function(resolve, reject) {
		wx.getSetting({
			withSubscriptions,
			success(e) {
				if (e.authSetting[scope] === false) return wx.openSetting({
					withSubscriptions,
					success(res) {
						res.authSetting[scope] ? resolve(res) : reject(res)
					},
					fail: reject
				})
				wx.authorize({
					scope,
					success: resolve,
					fail: reject
				})
			},
			fail: reject
		})
	})
}