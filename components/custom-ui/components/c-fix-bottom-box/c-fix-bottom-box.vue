<template>
	<view class="custom-fix-bottom-box" :style="[{'z-index':zIndex,'background-color':bgColor,position},customStyle]">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		options: {
			virtualHost: true
		},
		props: {
			customStyle: {
				type: Object,
				default: () => ({})
			},
			position: { // 定位
				type: String,
				default: 'fixed'
			},
			zIndex: { // 层级
				type: [String, Number],
				default: '7001'
			},
			bgColor: { // 背景颜色
				type: String,
				default: 'white'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-fix-bottom-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		@include safe-padding-bottom;
	}
</style>