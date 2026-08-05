<template>
	<view class="input-container">
		<image src="/static/images/icon_search.png" mode=""></image>
		<input v-model="newValue" type="text" placeholder="请输入关键字进行搜索" class="input" placeholder-class="input-placeholder">
		<c-button size="search" @click="search(newValue)">搜索</c-button>
	</view>
</template>

<script>
	export default {
		props: {
			value:''
		},
		computed: {},
		data() {
			return {
				newValue:this.value
			}
		},
		watch:{
			newValue(val){
				this.$emit('input',val)
			},
			value(val){
				this.newValue = val
			}
		},
		methods: {
			search(value) {
				this.$emit('search',value)
			},
		}
	}
</script>

<style lang="scss" scoped>
.input-container{
	width: 686rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	background: #ffffff;
	border: 2rpx solid #ffcb45;
	border-radius: 222px;
	justify-content: space-between;
	position: relative;
	margin: 0 auto;
	image{
		position: absolute;
		top: 50%;
		margin-top: -14rpx;
		left: 28rpx;
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
	}
	.input{
		padding-left: 68rpx;
		padding-right: 24rpx;
		flex: 1;
		font-size: 28rpx;
	}
	/deep/ .input-placeholder{
      color: #b2b2b2 !important;
      font-size: 28rpx;
    }
}
</style>
