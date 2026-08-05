<template>
	<view>
		<button @click="openModal">打开弹窗</button>
		<c-modal  ref="tips" />
	</view>
</template>

<script>
	import {
		tabBar
	} from '@/common/mixins'
	export default {
		mixins: [tabBar],
		data() {
			return {
				tabBarIndex: 0,
			}
		},
		onLoad() {
		},
		methods: {
			openModal(){
				this.$refs.tips.open('测试')
			}
		}
	}
</script>

<style>

</style>