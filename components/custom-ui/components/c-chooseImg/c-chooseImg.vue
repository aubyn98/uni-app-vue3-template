<template>
	<view class="c-chooseImg" :style="{ '--gap': gap, '--size': size, '--icon-size': iconSize  }">
		<view class="c-chooseImg-item" v-for="(item, index) in formatVal" :key="index" v-if="formatVal.length">
			<view class="_wrapper">
				<image :src="item" mode="" />
			</view>
			<image :src="delIconPath" class="delete" @click="remove(index)" />
		</view>
		<image v-if="len < max" class="c-chooseImg-add" :src="addIconPath" @click="choose"></image>
	</view>
</template>

<script>
	export default {
		options: {
			virtualHost: true
		},
		props: {
			value: {
				type: [String, Array],
				default: ''
			},
			addIconPath: {
				type: String,
				default: '/packageOther/static/images/promotion/drawCash/sctp.png'
			},
			delIconPath: {
				type: String,
				default: '/packageOther/static/images/promotion/drawCash/gb.png'
			},
			max: {
				type: Number,
				default: 1
			},
			gap: {
				type: String,
				default: '24rpx'
			},
			size: {
				type: String,
				default: '160rpx'
			},
			iconSize: {
				type: String,
				default: '28rpx'
			}
		},
		computed: {
			isString() {
				return this.max === 1 && typeof this.value === 'string'
			},
			formatVal() {
				return this.isString ? (this.value ? [this.value] : []) : this.value
			},
			len() {
				return this.formatVal.length
			}
		},
		data() {
			return {

			}
		},
		methods: {
			choose() {
				this.$utils.chooseImg({
					count: this.max - this.len
				}).then((chooseImageRes) => {
					const res = this.formatVal.concat(chooseImageRes)
					this.update(res)
				})
			},
			remove(index) {
				const res = [...this.formatVal]
				res.splice(index, 1)
				this.update(res)
			},
			update(res) {
				if (this.isString) res = res[0] || ''
				this.$emit('change', res)
				this.$emit('input', res)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.c-chooseImg {
		display: flex;
		flex-wrap: wrap;
		margin-right: calc(0rpx - var(--gap));
		margin-bottom: calc(0rpx - var(--gap));

		.c-chooseImg-add {
			width: var(--size);
			height: var(--size);
			margin-right: var(--gap);
			margin-bottom: var(--gap);
		}

		.c-chooseImg-item {
			width: var(--size);
			height: var(--size);
			margin-right: var(--gap);
			margin-bottom: var(--gap);
			position: relative;

			._wrapper {
				width: 100%;
				height: 100%;
				overflow: hidden;
				border-radius: 4rpx;
				border: 1px solid #f0f0f0;
			}

			.delete {
				width: var(--icon-size);
				height: var(--icon-size);
				position: absolute;
				top: 0;
				right: 0;
				transform: translate(50%, -50%);
			}

			image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
</style>