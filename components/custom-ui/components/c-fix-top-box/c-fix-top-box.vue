<template>
	<view class="c-fix-top-box-placeholder" :style="{ height: occupySpaceHeight }">
		<view id="c-fix-top-box" class="c-fix-top-box" :class="classList" :style="[ getStyle ]">
			<slot :paddingX="paddingX" :paddingY="paddingY" :statusBarHeight="statusBarHeight + 'px'"
				:minHeight="minHeight" :titleHeight="titleHeight" />
		</view>
	</view>
</template>

<script>
	import {
		useStatusBarStore
	} from '@/store';
	export default {
		options: {
			virtualHost: true
		},
		props: {
			position: {
				type: String,
				default: 'fixed'
			},
			top: {
				type: String,
				default: '0'
			},
			zIndex: {
				type: [String, Number],
				default: 10
			},
			// 是否开启占位
			occupySpace: {
				type: Boolean,
				default: true
			},
			statusBar: {
				type: Boolean,
				default: true
			},
			background: {
				type: String,
				default: '#fff'
			},
			otherHeight: {
				type: String
			},
			customClass: { // 自定义类名
				type: String,
				default: ''
			},
			customStyle: { // 自定义样式
				type: Object,
				default: () => ({})
			}
		},
		computed: {
			statusBarHeight() {
				return useStatusBarStore().statusBarHeight
			},
			MenuButton() {
				return useStatusBarStore().MenuButton
			},
			titleHeight() {
				return useStatusBarStore().titleHeight
			},
			titleContentHeight() {
				return useStatusBarStore().titleContentHeight
			},
			occupySpaceHeight() {
				if (this.occupySpace) {
					return this.otherHeight ? `calc(${this.titleHeight}px + ${this.otherHeight})` : `${this.titleHeight}px`
				}
				return 0
			},
			paddingX() {
				return (this.MenuButton.width + 12) + 'px'
			},
			paddingY() {
				return this.MenuButton.marginTop + 'px'
			},
			minHeight() {
				return this.titleContentHeight + 'px'
			},
			getStyle() {
				const statusBarHeight = this.statusBarHeight;
				const MenuButton = this.MenuButton;
				return {
					zIndex: this.zIndex,
					top: this.top,
					position: this.position,
					background: this.background,
					'line-height': MenuButton.height + 'px',
					...(this.statusBar && {
						'padding-top': statusBarHeight + 'px'
					}),
					...this.customStyle
				};
			},
			classList() {
				const classList = [];
				const customClass = this.customClass;
				if (typeof customClass === 'string') classList.push(customClass);
				if (typeof customClass === 'object') Object.keys(customClass).forEach(key => customClass[key] && classList
					.push(key));
				return classList;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.c-fix-top-box-placeholder {
		flex-shrink: 0;
	}

	.c-fix-top-box {
		left: 0;
		right: 0;
		transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
	}
</style>
