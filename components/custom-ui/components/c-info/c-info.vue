<template>
	<!-- #ifndef MP-WEIXIN -->
	<view class="C-INFO">
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<block>
			<!-- #endif -->
			<view v-if="visible" class="custom-info" :class="{'custom-info-mask':mask}" :style="{opacity:show ? 1 : 0}"
				@touchmove.stop @tap="mask && close()">
				<view class="custom-info-container" :class="['_' + status]" @tap.stop="">
					<image :src="`/static/images/${image}.png`" mode=""></image>
					<text>{{text}}</text>
				</view>
			</view>
			<slot name="event"></slot>
			<!-- #ifdef MP-WEIXIN -->
		</block>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
	</view>
	<!-- #endif -->
</template>

<script>
	const dict = {
		success: {
			image: 'icon_succe2'
		},
		error: {
			image: 'icon_error'
		}
	}
	export default {
		options: {
			virtualHost: true
		},
		props: {
			openInfoEvent: {
				type: String,
			}
		},
		provide() {
			return {
				openInfo: this.open
			}
		},
		mounted() {
			if (!this.$slots.event && this.openInfoEvent) uni.$on(this.openInfoEvent, this.open)
		},
		unmounted() {
			if (!this.$slots.event && this.openInfoEvent) uni.$off(this.openInfoEvent)
		},
		computed: {
			image() {
				return dict[this.status].image
			}
		},
		data() {
			return {
				visible: false, // 是否显示
				show: false, // 控制透明度
				mask: false, // 是否显示遮罩
				_openTimer: null,
				_closeTimer: null,
				_durationTimer: null,
				status: 'success', // 提示类型
				text: '', // 文字
				_close: null
			}
		},
		methods: {
			success(text, opt) {
				return this.open({
					status: 'success',
					text,
					...opt
				})
			},
			error(text, opt) {
				return this.open({
					status: 'error',
					text,
					mask: true,
					...opt,
				})
			},
			open(opt = {}) {
				return new Promise((resolve) => {
					this.text = opt.text || '成功'
					this.status = opt.status || 'success'
					this.mask = !!opt.mask
					if (this._openTimer) clearTimeout(this._openTimer)
					this.visible = true
					this._openTimer = setTimeout(() => {
						this.show = true;
						this._close = opt.close ? () => {
							typeof opt.close === 'function' && opt.close();
							resolve()
						} : resolve
						if (!this.mask) {
							if (this._durationTimer) clearTimeout(this._durationTimer)
							this._durationTimer = setTimeout(() => {
								this.close().then(resolve)
							}, opt.duration || 1500)
						}
					}, 250)
				})
			},
			close() {
				return new Promise((resolve) => {
					if (this._closeTimer) clearTimeout(this._closeTimer)
					this.show = false
					this._closeTimer = setTimeout(() => {
						this.visible = false
						typeof this._close === 'function' && this._close()
						resolve()
					}, 250)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef MP-WEIXIN */
	.C-INFO {
		display: contents;
	}
	/* #endif */

	.custom-info {
		position: fixed;
		z-index: 8001;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		transition: opacity ease-in-out .25s;
		display: flex;
		align-items: center;
		justify-content: center;

		&-mask {
			background-color: rgba(0, 0, 0, 0.40);
		}

		&-container {
			/* position: fixed;
			z-index: 8002;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%); // 定位居中比flex布局兼容性好点 */

			border-radius: 36rpx;
			background: #ffffff;
			font-weight: 700;
			color: #333;
			font-size: 0;
			text-align: center;


			text {
				font-size: 34rpx;
				line-height: 48rpx;
				word-break: break-all;
			}

			image {
				width: 140rpx;
				height: 140rpx;
				margin: 0 auto 28rpx;
				display: block;
			}

			width: 420rpx;
			padding: 42rpx 92rpx;

			&._success {
				box-shadow: 0px 0px 6px rgba(203, 203, 203, 0.40);
			}

			&._error {}
		}
	}
</style>