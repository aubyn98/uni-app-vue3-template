<template>
	<view class="p-goods-image">
		<image :src="image || defaultImg" :mode="mode" lazy-load />
		<image v-if="removed && showStatus" class="mask" src="/static/images/goods/removed.png" />
		<image v-else-if="goods.stock < 1 && showStatus" class="mask" src="/static/images/goods/outOfStock.png" />
	</view>
</template>

<script>
	import {
		DEFAULT_GOODS_IMG
	} from '@/common/config'
	export default {
		props: {
			source: {
				type: Object,
				default: () => ({})
			},
			mode: {
				type: String,
				default: ''
			},
			showStatus: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				defaultImg: DEFAULT_GOODS_IMG
			}
		},
		computed: {
			image() {
				return this.goods?.imageInfo?.large || this.goods.image
			},
			goods() {
				return this.source.sku || this.source
			},
			removed() {

				if (this.$utils.hasOwnProperty(this.source, 'sku')) {
					if (this.source.sku.status) return this.source?.product?.status !== this.$GOODS_STATUS.ENABLE
					return !this.source.sku.status
				}
				if (this.$utils.hasOwnProperty(this.source, 'status')) {
					if (typeof this.source.status === 'string') return this.source?.status !== this.$GOODS_STATUS.ENABLE
					else return !this.source.status
				}
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.p-goods-image {
		position: relative;
		width: 100%;
		height: 100%;

		image {
			width: 100%;
			height: 100%;
		}

		.mask {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
</style>