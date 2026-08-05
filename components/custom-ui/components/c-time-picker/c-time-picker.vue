<template>
	<u-popup :show="value" @close="close" @open="open" mode="bottom" height="auto" safe-area-inset-bottom>
		<view class="custom-time-picker-contianer">
			<view class="_time-picker-header">
				<view class="_time-picker-cancel" @tap.stop="cancel">
					取消
				</view>
				<view :class="{'_time-picker-confirm':!move}" @tap.stop="confirm">
					确认
				</view>
			</view>
			<picker-view v-if="value" :value="val" @change="bindChange" @pickstart="pickstart" @pickend="pickend"
				class="custom-time-picker" indicator-class="_time-picker-indicator">
				<picker-view-column>
					<view class="_time-picker-item" v-for="(item,index) in list.hours" :key="index">{{item}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="_time-picker-item" v-for="(item,index) in list.minutes" :key="index">{{item}}</view>
				</picker-view-column>
			</picker-view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			value: { // 双向绑定 是否显示弹窗
				type: Boolean
			},
			defaultValue: { // 默认值
				type: String,
				default: ''
			},
			start: { // 开始时间
				type: String,
				default: '00:00'
			},
			end: { // 结束时间
				type: String,
				default: '23:59'
			}
		},
		data() {
			return {
				val: [0, 0], // 选择的值在列表中的索引
				move: false
			}
		},
		computed: {
			// 根据开始和结束展示列表数据
			list() {
				const hours = []
				const minutes = []
				const [hStart, mStart] = this.start.split(':').map(Number)
				const [hEnd, mEnd] = this.end.split(':').map(Number)
				for (let i = 0; i < 60; i++) {
					const num = i < 10 ? `0${i}` : i.toString()
					if (i >= hStart && i <= hEnd) hours.push(num)
					if (i >= mStart && i <= mEnd) minutes.push(num)
				}
				return {
					hours,
					minutes
				}
			}
		},
		watch: {
			// 监听默认值的改变
			defaultValue: {
				handler(val) {
					const [hour, minute] = val.split(':')
					const {
						hours,
						minutes
					} = this.list
					const hIndex = hours.findIndex(it => it === hour)
					const mIndex = minutes.findIndex(it => it === minute)
					this.val = [hIndex !== -1 ? hIndex : 0, mIndex !== -1 ? mIndex : 0]
				},
				immediate: true
			}
		},
		methods: {
			open() {
				this.$emit('open')
			},
			close() {
				this.$emit('input', false)
			},
			// 确定
			confirm() {
				if (this.move) return
				const [hIndex, mIndex] = this.val
				const {
					hours,
					minutes
				} = this.list
				const res = hours[hIndex] + ':' + minutes[mIndex]
				this.close()
				this.$emit('update:defaultValue', res)
				this.$emit('change', res)
			},
			cancel() {
				this.close()
			},
			bindChange(e) {
				this.val = e.detail.value
			},
			pickstart() {
				this.move = true
			},
			pickend() {
				this.move = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';

	.custom-time-picker-contianer {
		._time-picker-header {
			height: 84rpx;
			padding: 0 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #ffffff;
			font-size: 32rpx;
			font-weight: 500;
			line-height: 1;
			border-bottom: 1px solid #f0f0f0;
			color: #aaaaaa;

			._time-picker-cancel {}

			._time-picker-confirm {
				color: $warning-color;
			}
		}

		.custom-time-picker {
			height: 548rpx;

			/deep/._time-picker-indicator {
				height: 96rpx;
			}

			._time-picker-item {
				display: flex;
				justify-content: center;
				align-items: center;
				color: #333;
			}
		}
	}
</style>