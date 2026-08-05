Component({
	data: {
		selected: 0,
		goodsCount: 0,
		list: [{
			text: '首页',
			icon: 'icon_sy',
			activeIcon: 'icon_sy2',
			path: '/pages/home/home'
		}, {
			text: '找药',
			icon: 'icon_fl',
			activeIcon: 'icon_fl2',
			path: '/pages/category/category'
		}, {
			text: '购物车',
			icon: 'icon_gwc',
			activeIcon: 'icon_gwc2',
			path: '/pages/myCart/myCart',
			badge: true
		}, {
			text: '我的',
			icon: 'icon_my',
			activeIcon: 'icon_my2',
			path: '/pages/mine/mine'
		}]
	},
	attached() {},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			wx.switchTab({
				url
			})
			this.setData({
				selected: data.index
			})
		}
	}
})