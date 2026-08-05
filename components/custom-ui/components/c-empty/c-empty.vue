<template>
	<view class="empty" :style="[{ height, width },customStyle]">
		<!-- <image @click="$emit('icon-click')" :src="require(`@/static/images/${img}.png`)" /> -->
		<img src="/static/images/icon_zw.png"></img>
		<p @click="$emit('icon-click')">
			<slot></slot>
		</p>
	</view>
</template>

<script>
	export default {
		props: {
			img: {
				type: String,
				default: 'icon_logo'
			},
			customStyle: {
				type: Object,
				default: () => ({})
			},
			width: {
				type: String,
				default: '100%',
			},
			height: {
				type: String,
				default: '100%',
			},
		},
	}
</script>

<style lang="scss" scoped>
	.empty {
		// margin: 228rpx auto 0;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// background: white;
		border-radius: 0 0 16rpx 16rpx;

		image {
			width: 360rpx;
			height: 360rpx;
		}

		p {
			padding: 0 32rpx;
			line-height: 50rpx;
			font-size: 36rpx;
			font-weight: 700;
			text-align: CENTER;
			color: #333333;
		}
	}
</style>
