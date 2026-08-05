<template>
	<view class="c-time-range-picker">
		<c-tag :round="false" bold plain :text="value[0]" @click="!disabled && (showStartPicker = true)" />
		<view class="_line"></view>
		<c-tag :round="false" bold plain :text="value[1]" @click="!disabled && (showEndPicker = true)" />
		<c-time-picker v-model="showStartPicker" :default-value="value[0]" @change="startTimeChange"></c-time-picker>
		<c-time-picker v-model="showEndPicker" :default-value="value[1]" @change="endTimeChange" :start="value[0]"></c-time-picker>
	</view>
</template>

<script>
	export default {
		props: {
			value: { // 双向绑定的值
				type: Array,
				default: () => ['00:00', '23:59']
			},
			disabled: { // 是否禁用
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showStartPicker: false,
				showEndPicker: false,
			}
		},
		methods: {
			startTimeChange(val) {
				const [hS, mS] = val.split(':').map(Number)
				const [hE, mE] = this.value[1].split(':').map(Number)
				const isReset = hS > hE || (hS === hE && mS > mE) // 判断结束时间是否小于开始时间
				this.change([val, isReset ? val : this.value[1]])
			},
			endTimeChange(val) {
				this.change([this.value[0], val])
			},
			change(val) {
				this.$emit('input', val)
				this.$emit('change', val)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-time-range-picker {
		display: flex;
		align-items: center;

		._line {
			width: 20rpx;
			height: 4rpx;
			margin: 0 16rpx;
			background: #666666;
		}
	}
</style>
