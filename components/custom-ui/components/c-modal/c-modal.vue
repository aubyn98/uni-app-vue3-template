<template>
	<!-- #ifndef MP-WEIXIN -->
	<view class="C-MODAL">
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<block>
			<!-- #endif -->
			<view>
				<u-popup :show="show" :closeOnClickOverlay="options.closeOnClickOverlay"
					:overlayStyle="options.overlayStyle" :z-index="options.zIndex" :safeAreaInsetBottom="false"
					@close="close" @closed="closed" mode="center" round="8rpx">
					<slot name="container" :options="options">
						<view class="c-modal">
							<view style="padding: 36rpx 40rpx;min-height: 146rpx;"
								class="flex-center flex-col text-center">
								<slot name="title" :options="options">
									<view v-if="options.showTitle" class="c-modal-header">
										{{ options.title }}
									</view>
								</slot>
								<slot name="content" :options="options">
									<view class="c-modal-content" :style="[options.contentStyle]">
										<slot :options="options">
											{{ options.content }}
										</slot>
									</view>
								</slot>
							</view>
							<slot name="footer" :options="options">
								<view v-if="options.showFooter" class="c-modal-footer"
									:style="{ gridTemplateColumns: options.footerColumns }">
									<slot name="cancel" :options="options">
										<view class="c-model-button" v-if="options.showCancel"
											:style="[options.cancelStyle]" @click="cancel">
											{{options.cancelText}}
										</view>
									</slot>
									<slot name="confirm" :options="options">
										<view class="c-model-button" v-if="options.showConfirm"
											:style="[options.confirmStyle]" @click="confirm">
											{{options.confirmText}}
										</view>
									</slot>
								</view>
							</slot>
						</view>
					</slot>
				</u-popup>
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
	export default {
		options: {
			virtualHost: true
		},
		props: {
			title: {
				type: String,
				default: '提示'
			},
			showTitle: {
				type: Boolean,
				default: true
			},
			footerColumns: {
				type: String,
				default: 'repeat(2, 1fr)'
			},
			confirmText: {
				type: String,
				default: '确定'
			},
			showConfirm: {
				type: Boolean,
				default: true
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			showCancel: {
				type: Boolean,
				default: true
			},
			zIndex: {
				type: [Number, String],
				default: 10075
			},
			overlayStyle: {
				type: Object,
				default: () => ({})
			},
			closeOnClickOverlay: {
				type: Boolean,
				default: true
			},
			content: {
				type: String,
				default: ''
			},
			asyncClose: {
				type: Boolean,
				default: false
			},
			showFooter: {
				type: Boolean,
				default: true
			},
			confirmStyle: {
				type: Object,
				default: () => ({})
			},
			cancelStyle: {
				type: Object,
				default: () => ({})
			},
			contentStyle: {
				type: Object,
				default: () => ({})
			},
			openModalEvent: {
				type: String,
			}
		},
		provide() {
			return {
				openModal: this.open
			}
		},
		mounted() {
			if (!this.$slots.event && this.openModalEvent) uni.$on(this.openModalEvent, this.open)
		},
		unmounted() {
			if (!this.$slots.event && this.openModalEvent) uni.$off(this.openModalEvent)
		},
		data() {
			return {
				show: false,
				options: this.getOptions(),
				resolve: () => void 0,
				reject: () => void 0
			}
		},
		methods: {
			open(opts, config) {
				return new Promise((resolve, reject) => {
					this.options = this.getOptions(opts, config)
					this.show = true
					this.resolve = resolve
					this.reject = reject
				})
			},
			getOptions(opts, config) {
				if (typeof config !== 'object') config = {}
				if (opts && typeof opts !== 'object') {
					opts = {
						content: opts
					}
				}

				const res = {
					title: this.title,
					showTitle: this.showTitle,
					footerColumns: this.footerColumns,
					confirmText: this.confirmText,
					confirmStyle: this.confirmStyle,
					showConfirm: this.showConfirm,
					cancelText: this.cancelText,
					cancelStyle: this.cancelStyle,
					showCancel: this.showCancel,
					zIndex: this.zIndex,
					overlayStyle: this.overlayStyle,
					closeOnClickOverlay: this.closeOnClickOverlay,
					content: this.content,
					asyncClose: this.asyncClose,
					showFooter: this.showFooter,
					contentStyle: this.contentStyle,
					onConfirm: (e) => this.$emit('confirm', e),
					onCancel: (e) => this.$emit('cancel', e),
					...opts,
					...config
				}
				if ([res.showCancel, res.showConfirm].filter(i => i).length < 2) {
					res.footerColumns = 'repeat(1, 1fr)'
				}
				return res
			},
			confirm() {
				let close = () => {
					this.show = false
					close = null
				}
				if (!this.options.asyncClose) close()
				this.resolve(close)
				this.options.onConfirm(close)
			},
			cancel() {
				this._closeHandle('cancel')
			},
			close() {
				this._closeHandle('close')
			},
			_closeHandle(code) {
				this.show = false
				this.reject(code)
				this.options.onCancel(code)
			},
			closed() {}
		}
	}
</script>
<style>
	.c-modal-button {
		flex: 1;
	}
</style>
<style lang="scss" scoped>
	/* #ifndef MP-WEIXIN */
	.C-MODAL {
		display: contents;
	}

	/* #endif */

	.c-modal {
		width: 606rpx;
		text-align: center;

		.c-modal-header {
			font-size: 28rpx;
			color: #101010;
			margin-bottom: 24rpx;
		}

		.c-modal-content {
			line-height: 44rpx;
			font-size: 28rpx;
			color: #666666;
		}

		.c-modal-footer {
			border-top: 2rpx solid #f0f0f0;
			display: grid;
			height: 88rpx;
			line-height: 86rpx;

			.c-model-button {
				font-size: 28rpx;
				text-align: CENTER;
				color: #101010;
				border-right: 2rpx solid #f0f0f0;

				&:last-child {
					border: none;
				}
			}
		}
	}
</style>