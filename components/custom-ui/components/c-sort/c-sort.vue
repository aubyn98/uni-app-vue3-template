<template>
	<view :class="[staticClass]" @tap.stop="clickHandle">
		<view>
			<slot>{{ label }}</slot>
		</view>
		<view :style="{ marginLeft: gap }">
			<image :src="getPath('asc_checked')" v-if="computedVal == 'ASC' && !disabled" />
			<image :src="getPath('asc')" v-else />
			<image :src="getPath('desc_checked')" v-if="computedVal == 'DESC' && !disabled" />
			<image :src="getPath('desc')" v-else />
		</view>
	</view>
</template>

<script>
	const dict = {
		default: {
			asc: 'asc',
			asc_checked: 'asc-checked',
			desc: 'desc',
			desc_checked: 'desc-checked',
		},
		green: {
			asc: 'asc2',
			asc_checked: 'asc2-checked',
			desc: 'desc2',
			desc_checked: 'desc2-checked',
		}
	}
	export default {
		options: {
			virtualHost: true
		},
		props: {
			LowerCase: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			value: {
				type: String,
				default: ''
			},
			imagePath: { // 图片路径
				type: String,
				default: '/static/images/sort/'
			},
			type: {
				type: String,
				default: 'default',
				validator(val) {
					return ['default', 'green'].indexOf(val) !== -1;
				},
			},
			gap: {
				type: String,
				default: '10rpx'
			},
			label: {
				type: String
			},
		},
		computed: {
			staticClass() {
				return this.type == 'green' ? 'c-sort-green' : 'c-sort'
			},
			computedVal() {
				return this.value.toLocaleUpperCase()
			}
		},
		data() {
			return {

			}
		},
		methods: {
			clickHandle() {
				if (this.disabled) return
				let v = !this.value ? 'ASC' : this.value === 'ASC' ? 'DESC' : ''
				if (this.LowerCase) v = v.toLocaleLowerCase()
				this.$emit('input', v)
				this.$emit('change', v)
			},
			getPath(icon) {
				return this.imagePath + dict[this.type][icon] + '.png'
			}
		}
	}
</script>

<style lang="scss" scoped>
	%flex-y-center {
		display: flex;
		align-items: center;

		image {
			display: block;
		}
	}

	.c-sort {
		@extend %flex-y-center;

		image {
			margin: 4rpx 0;
			width: 10rpx;
			height: 6rpx;
		}
	}

	.c-sort-green {
		@extend %flex-y-center;

		image {
			margin: 4rpx 0;
			width: 12rpx;
			height: 8rpx;
		}
	}
</style>