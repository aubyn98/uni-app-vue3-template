// 定义在wxs (含renderjs) 逻辑层的数据和方法, 与视图层相互通信
const WxsMixin = {
	data() {
		return {
			// 传入wxs视图层的数据 (响应式)
			wxsProp: {
				canSlideUp: false,
				optDown: {}, // 下拉刷新的配置
				bodyHeight: 0, // body的高度
				t: 0 // 数据更新的标记 (只有数据更新了,才会触发wxs的Observer)
			},

			// 标记调用wxs视图层的方法
			callProp: {
				callType: '', // 方法名
				t: 0 // 数据更新的标记 (只有数据更新了,才会触发wxs的Observer)
			},

		}
	},
	methods: {
		// wxs视图层调用逻辑层的回调

	},
	mounted() {
		// 初始化wxs的数据
		this.wxsCall({
			type: 'setWxsProp'
		})
	}
}

export default WxsMixin;