<template>
	<!-- #ifndef MP-WEIXIN -->
	<view class="C-MODAL-INPUT">
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<block>
			<!-- #endif -->
			<view>
				<u-popup :show="show" :closeOnClickOverlay="options.closeOnClickOverlay" @close="close" @closed="closed"
					mode="center" round="16rpx" :safeAreaInsetBottom="false" :z-index="options.zIndex"
					:overlayStyle="options.overlayStyle" :customStyle="{ transform: 'translateY(-50%)' }">
					<slot name="container" :options="options" :focus="focus">
						<view class="c-modal-input">
							<slot name="title" :options="options">
								<view class="c-model-input-title" v-if="options.showTitle">{{ options.title }}</view>
							</slot>
							<slot name="content" :options="options" :focus="focus">
								<view class="c-model-input-content">
									<!-- 微信小程序不支持动态的type -->
									<slot :options="options" :focus="focus">
										<input v-if="options.type == 'text'" ref="input" type="text" :focus="focus"
											:value="options.value" @keyboardheightchange="keyboardheightchange"
											@input="onInput" :placeholder="options.placeholder" @confirm="confirm" />
										<input v-if="options.type == 'number'" ref="input" type="number" :focus="focus"
											:value="options.value" @keyboardheightchange="keyboardheightchange"
											@input="onInput" :placeholder="options.placeholder" @confirm="confirm" />
										<input v-if="options.type == 'idcard'" ref="input" type="idcard" :focus="focus"
											:value="options.value" @keyboardheightchange="keyboardheightchange"
											@input="onInput" :placeholder="options.placeholder" @confirm="confirm" />
										<input v-if="options.type == 'digit'" ref="input" type="digit" :focus="focus"
											:value="options.value" @keyboardheightchange="keyboardheightchange"
											@input="onInput" :placeholder="options.placeholder" @confirm="confirm" />
										<input v-if="options.type == 'safe-password'" ref="input" type="safe-password"
											:focus="focus" :value="options.value"
											@keyboardheightchange="keyboardheightchange" @input="onInput"
											:placeholder="options.placeholder" @confirm="confirm" />
										<input v-if="options.type == 'nickname'" ref="input" type="nickname"
											:focus="focus" :value="options.value"
											@keyboardheightchange="keyboardheightchange" @input="onInput"
											:placeholder="options.placeholder" @confirm="confirm" />
									</slot>
								</view>
							</slot>
							<slot name="footer" :options="options">
								<view class="c-model-input-footer">
									<c-button v-if="options.showCancel"
										:custom-style="{ flex: 1, marginRight: '48rpx' }" :text="options.cancelText"
										size="small" type="info" plain @click="cancel" />
									<c-button v-if="options.showConfirm" :custom-style="{ flex: 1 }"
										:text="options.confirmText" size="small" @click="confirm" />
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
				default: ''
			},
			showTitle: {
				type: Boolean,
				default: true
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
				default: false
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
			type: {
				type: String,
				default: 'text',
				validator(v) {
					return ['text', 'number', 'idcard', 'digit', 'safe-password', 'nickname'].includes(v)
				}
			},
			placeholder: {
				type: String,
				default: ''
			},
			asyncClose: {
				type: Boolean,
				default: false
			},
			openModalInputEvent: {
				type: String,
			}
		},
		provide() {
			return {
				openModalInput: this.open
			}
		},
		mounted() {
			if (!this.$slots.event && this.openModalInputEvent) uni.$on(this.openModalInputEvent, this.open)
		},
		unmounted() {
			if (!this.$slots.event && this.openModalInputEvent) uni.$off(this.openModalInputEvent)
		},
		data() {
			return {
				focus: false,
				show: false,
				options: this.getOptions(),
				resolve: () => void 0,
				reject: () => void 0,
				keyboardHeight: 0
			}
		},
		watch: {
			show(v) {
				this.focus = false
				if (v) {
					setTimeout(() => {
						this.focus = true
					}, 500)
				}
			}
		},
		methods: {
			keyboardheightchange(e) {
				this.keyboardHeight = e.detail.height
			},
			onInput(e) {
				this.options.value = e.detail.value
			},
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
				if (typeof opts !== 'object') {
					opts = {
						value: opts || (opts === 0 ? 0 : '')
					}
				}
				return {
					title: this.title,
					showTitle: this.showTitle,
					confirmText: this.confirmText,
					showConfirm: this.showConfirm,
					cancelText: this.cancelText,
					showCancel: this.showCancel,
					zIndex: this.zIndex,
					overlayStyle: this.overlayStyle,
					closeOnClickOverlay: this.closeOnClickOverlay,
					type: this.type,
					placeholder: this.placeholder,
					asyncClose: this.asyncClose,
					onConfirm: (e) => this.$emit('confirm', e),
					onCancel: (e) => this.$emit('cancel', e),
					...opts,
					...config
				}
			},
			confirm() {
				const close = () => this.show = false
				const res = {
					value: this.options.value
				}
				if (this.options.asyncClose) {
					res.close = close
				} else {
					close()
				}
				this.resolve(res)
				this.options.onConfirm(res)
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
<style lang="scss">
	.c-model-input-content {

		input {
			min-height: 68rpx;
			height: 68rpx;
			line-height: 68rpx;
			border: none;
			font-size: 28rpx;
			color: #333;

			&::placeholder {
				background: #b2b2b2;
				color: #b2b2b2;
			}
		}
	}
</style>
<style lang="scss" scoped>
	/* #ifndef MP-WEIXIN */
	.C-MODAL-INPUT {
		display: contents;
	}

	/* #endif */

	.c-modal-input {
		width: 542rpx;
		height: 332rpx;
		padding: 40rpx 48rpx 56rpx;

		.c-model-input-title {
			height: 44rpx;
			line-height: 44rpx;
			font-size: 32rpx;
			color: #333333;
			text-align: center;
			margin-bottom: 24rpx;
		}

		.c-model-input-content {
			width: 448rpx;
			border: 2rpx solid #f0f0f0;
			border-radius: 4rpx;
			padding: 0 20rpx;
			margin-bottom: 24rpx;
			height: 72rpx;
		}

		.c-model-input-footer {
			display: flex;
		}
	}
</style>