import { defineStore } from 'pinia'

export const useStatusBarStore = defineStore('statusBar', {
	state: () => ({
		statusBarHeight: 0,
		MenuButton: {},
		titleHeight: 0,
		titleContentHeight: 0
	}),
	actions: {
		initBarInfo() {
			let statusBarHeight = uni.$u.sys('getWindowInfo').statusBarHeight;
			const MenuButton = uni.getMenuButtonBoundingClientRect()
			while (!MenuButton || MenuButton.left == 0 || MenuButton.right == 0 || MenuButton.top == 0 || MenuButton
				.bottom == 0 ||
				MenuButton.width == 0 || MenuButton.height == 0) {
				MenuButton = uni.getMenuButtonBoundingClientRect()
			}
			let marginTop = MenuButton.top - statusBarHeight
			if (marginTop < 0) {
				marginTop = 4
				statusBarHeight = statusBarHeight - marginTop * 2
			}
			this.statusBarHeight = statusBarHeight
			this.MenuButton = {
				marginTop,
				...MenuButton
			};
			this.titleHeight = MenuButton.height + MenuButton.top + this.MenuButton.marginTop
			this.titleContentHeight = this.titleHeight - statusBarHeight
		}
	}
})
