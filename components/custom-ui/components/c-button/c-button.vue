<template>
	<button :style="[{width},customStyle]" class="custom-button" :class="classList" :data-name="dataName"
		:disabled="disabled" :form-type="formType" :open-type="openType" :hover-class="hoverClass"
		:hover-start-time="Number(hoverStartTime)" :hover-stay-time="Number(hoverStayTime)"
		:app-parameter="appParameter" :hover-stop-propagation="hoverStopPropagation" :lang="lang"
		:session-from="sessionFrom" :send-message-title="sendMessageTitle" :send-message-path="sendMessagePath"
		:send-message-img="sendMessageImg" :show-message-card="showMessageCard" @tap.stop="click"
		@getphonenumber="getphonenumber" @getuserinfo="getuserinfo" @error="error" @opensetting="opensetting"
		@launchapp="launchapp">
		<image :style="[imageStyle]" :class="imageClass" v-if="image" :src="`${imagePath}${image}.png`"></image>
		<text :style="[textStyle]" :class="[textClass]">
			<slot>{{text}}</slot>
		</text>
	</button>
</template>

<script>
	import {
		throttle
	} from '@/common/utils/magic';

	function emit(key) {
		return function(...argvs) {
			this.$emit(key, ...argvs);
		};
	}
	export default {
		options: {
			virtualHost: true
		},
		props: {
			// 节流，一定时间内只能触发一次
			throttleTime: {
				type: [String, Number],
				default: 1000
			},
			width: { // 自定义样式
				type: String,
				default: 'auto'
			},
			customStyle: { // 自定义样式
				type: Object,
				default: () => ({})
			},
			customClass: { // 自定义类名
				type: String,
				default: ''
			},
			text: { // 按钮文字
				type: String,
				default: ''
			},
			textStyle: { // 文字样式
				type: Object,
				default: () => ({})
			},
			textClass: { // 文字类名
				type: String,
				default: ''
			},
			imageStyle: { // 图片样式
				type: Object,
				default: () => ({})
			},
			imageClass: { // 图片类名
				type: String,
				default: ''
			},
			imagePath: { // 图片路径前缀
				type: String,
				default: '/static/images/'
			},
			image: { // 图片名称
				type: String,
				default: null
			},
			type: { // 按钮颜色类型
				type: String,
				default: 'success',
				validator: function(value) {
					return ['success', 'warning', 'danger', 'info', 'disabled'].indexOf(value) !== -1;
				}
			},
			size: { // 按钮大小
				type: String,
				default: 'default',
				validator: function(value) {
					return ['default', 'small'].indexOf(value) !== -1;
				}
			},
			bold: { // 文字是否加粗
				type: Boolean,
				default: true
			},
			round: { // 是否为椭圆
				type: Boolean,
				default: true
			},
			plain: { // 是否镂空
				type: Boolean,
				default: false
			},
			halfBorder: { // 边框是否为0.5
				type: Boolean,
				default: false
			},
			dataName: { // 附带额外数据
				type: String,
				default: ''
			},
			disabled: { // 是否禁用
				type: Boolean,
				default: false
			},
			formType: {
				type: String
			},
			openType: {
				type: String
			},
			hoverClass: {
				type: String,
				default: 'button-hover'
			},
			hoverStartTime: {
				type: Number,
				default: 20
			},
			hoverStayTime: {
				type: Number,
				default: 70
			},
			appParameter: {
				type: String
			},
			hoverStopPropagation: {
				type: Boolean,
				default: false
			},
			lang: {
				type: String,
				default: 'en'
			},
			sessionFrom: {
				type: String
			},
			sendMessageTitle: {
				type: String,
				default: '当前标题'
			},
			sendMessagePath: {
				type: String,
				default: '当前分享路径'
			},
			sendMessageImg: {
				type: String,
				default: '截图'
			},
			showMessageCard: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			classList() {
				const classList = [];
				this.bold && classList.push('_bold');
				this.round && classList.push('_round');
				this.plain && classList.push('_plain');
				this.halfBorder && classList.push('_halfBorder');
				classList.push('_' + this.type);
				classList.push('_' + this.size);
				const customClass = this.customClass;
				if (typeof customClass === 'string') classList.push(customClass);
				if (typeof customClass === 'object') Object.keys(customClass).forEach(key => customClass[key] && classList
					.push(key));
				return classList;
			}
		},
		created() {
			this.throttleClick = throttle((e) => {
				this.$emit('click', e)
			}, this.throttleTime);
		},
		methods: {
			click(e) {
				// 进行节流控制，每this.throttle毫秒内，只在开始处执行
				if (this.throttleTime == 0) return this.$emit('click', e);
				this.throttleClick(e);
			},
			getphonenumber: emit('getphonenumber'),
			getuserinfo: emit('getuserinfo'),
			error: emit('error'),
			opensetting: emit('opensetting'),
			launchapp: emit('launchapp')
		}
	};
</script>

<style lang="scss" scoped>
	@import './button-variables.scss';
</style>