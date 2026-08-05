<template>
	<view class="goods-list-item" @click.stop="toDetail">
		<p-goods-image class="goods-image" :source="source" />
		<view class="goods-info">
			<view class="goods-name">
				{{ source.name }}
			</view>
			<scroll-view class="goods-tag-list" scroll-x="true" enable-flex>
				<view class="goods-tag" v-for="a in activities" :key="a">{{ a }}</view>
			</scroll-view>
			<view class="goods-price-list">
				<view class="goods-price">
					<text class="goods-price-sign">￥</text>
					<text>{{ source.price }}</text>
				</view>
				<view v-if="source.marketPrice && source.marketPrice != source.price" class="goods-original-price">￥{{ source.marketPrice }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			source: {
				type: Object,
				default: () => ({
					skus: []
				})
			},
		},
		data() {
			return {

			}
		},
		computed: {
			activities() {
				return [...new Set(this.source.skus.reduce((_, it) => _.concat(it.productSkuActivity.activities.map(i => i
					.badge)), []))]
			}
		},
		methods: {
			toDetail() {
				return uni.$u.route('/packageGoods/pages/detail/detail', {
					id: this.source.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list-item {
		flex-shrink: 0;
		display: flex;

		.goods-image {
			flex-shrink: 0;
			width: 160rpx;
			height: 160rpx;
			display: block;
			margin-right: 20rpx;
		}

		.goods-info {
			width: 0;
			flex: 1;
			display: flex;
			flex-direction: column;
		}



		.goods-name {
			flex-shrink: 0;
			height: 70rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 8rpx;
			@include textLineClamp(2);
		}

		.goods-tag-list {
			flex-shrink: 0;
			font-size: 0;
			display: flex;
			height: 32rpx;
			width: 100%;
			margin-bottom: 8rpx;

			.goods-tag {
				flex-shrink: 0;
				padding: 0 8rpx;
				height: 32rpx;
				line-height: 32rpx;
				background: #ffeeee;
				border-radius: 4rpx;
				font-size: 20rpx;
				color: #ff0000;
				margin-right: 8rpx;
				max-width: 100%;
				@include textLineClamp;
			}
		}

		.goods-price-list {
			flex-shrink: 0;
			height: 40rpx;
			line-height: 40rpx;
			display: flex;
			align-items: center;

			.goods-price {
				font-size: 28rpx;
				color: #ff0a0a;
			}

			.goods-price-sign {
				font-size: 18rpx;
			}

			.goods-original-price {
				margin-left: 4rpx;
				color: #aaaaaa;
				font-size: 20rpx;
				text-decoration: line-through;
			}
		}
	}
</style>