<template>
	<view @tap="$emit('click')" class="custom-tag" :class="[{_round:round,_bold:bold,_plain:plain},type === 'info' ? '_info' : '_warning' ]" :style="[customStyle]">
		<text><slot>{{text}}</slot></text>
	</view>
</template>

<script>
	export default {
		props: {
			text: { // 文字
				type: String,
				default: '',
			},
			type: { // 类型
				type: String,
				default: 'warning',
				validator: function(value) {
					return [ /* 'success', */ 'warning', /* 'danger', */ 'info'].indexOf(value) !== -1;
				}
			},
			customStyle: { // 自定义样式
				type: Object,
				default: () => ({})
			},
			bold: { // 是否加粗字体
				type: Boolean,
				default: true
			},
			round: { // 是否圆角
				type: Boolean,
				default: true
			},
			plain: { // 是否镂空
				type: Boolean,
				default: false
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';

	.custom-tag {
		display: inline-block;
		flex-shrink: 0;
		height: 56rpx;
		padding: 8rpx 20rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		text-align: CENTER;
		@include getBorderRadius(16rpx);

		text {
			line-height: 1;
			// vertical-align: middle;
		}

		&::after {
			border-width: 2rpx;
			border-style: solid;
		}

		&._bold {
			font-weight: 700;
		}

		&._round {
			@include getBorderRadius(84rpx);
		}

		/* &._success {
			color: $success-color;
			background: #fff9eb;
		} */

		&._warning {
			color: $warning-color;
			background: #fff9eb;

		}

		/* &._danger {
			color: $danger-color;
			background: #fff9eb;
		} */

		&._info {
			color: #999999;
			background: #f8f8f8;

			&._plain {
				&::after {
					border-color: #999999;
				}
			}
		}

		&._plain {
			line-height: 42rpx;
			position: relative;
			overflow: visible;
			box-shadow: none;
			background-color: transparent;

			&::after {
				content: '';
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: 0;
				width: 200%;
				height: 200%;
				transform-origin: 0 0;
				transform: scale(0.5);
			}
		}
	}
</style>
