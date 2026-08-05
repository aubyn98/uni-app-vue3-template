import { defineStore } from 'pinia'
import * as apis from '@/common/apis'
import {
	TOKEN_KEY
} from '@/common/config'
import { useAppStore } from '@/store/app'
import { useCartStore } from '@/store/modules/cart'

let loginPromise = null

export const useUserStore = defineStore('user', {
	state: () => ({
		info: uni.getStorageSync('userInfo') || {},
		token: uni.getStorageSync(TOKEN_KEY) || '',
		openid: uni.getStorageSync('openid') || '',
		memberCardInfo: uni.getStorageSync('memberCardInfo') || '',
	}),
	getters: {
		hasLogin(state) {
			return !!state.token
		}
	},
	actions: {
		clearMemberCardInfo() {
			this.memberCardInfo = ''
			uni.removeStorageSync('memberCardInfo')
		},
		setMemberCardInfo(provider) {
			this.memberCardInfo = provider
			uni.setStorageSync('memberCardInfo', provider)
		},
		clearLoginInfo() {
			this.token = ''
			this.info = {}
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync(TOKEN_KEY)
		},
		setOpenid(openid) {
			this.openid = openid
			uni.setStorageSync('openid', openid)
		},
		setLoginInfo(provider) {
			this.info = provider.info;
			uni.setStorageSync('userInfo', provider.info)

			this.token = provider.token
			uni.setStorageSync(TOKEN_KEY, provider.token)
		},
		getMemberCardInfo() {
			return apis.get_myself({}, {
				showError: false
			}).then(res => {
				this.setMemberCardInfo(res.data)
				return res
			}).catch((rej) => {
				this.clearMemberCardInfo()
				return rej
			})
		},
		logout() {
			this.clearLoginInfo()
			// 原 commit('cart/clearCartInfo', null, { root: true }) → Pinia 跨 store 直接调用
			useCartStore().clearCartInfo()
		},
		login(storeId) {
			if (loginPromise) return loginPromise
			const appStore = useAppStore()
			loginPromise = uni.login({
				provider: 'weixin',
			}).then(result => apis.get_openid({
				code: result.code
			})).then(res => {
				const openid = res.data.openid
				if (!openid) {
					uni.showToast({
						icon: 'none',
						title: 'openid为空'
					})
					return
				}

				this.setOpenid(openid)

				return apis.wechat_login({
					openId: openid,
					nickname: '',
					avatarUrl: '',
					storeId: storeId || appStore.storeId
				})
			}).then(result => {
				// 获取用户基本信息
				const provider = result.data
				this.setLoginInfo(provider)


				const userInfo = provider.info;
				if (!userInfo.nickname || userInfo.nickname.indexOf(
						'微信用户') > -1) {
					uni.$u.route('/packageMine/pages/editUserInfo/editUserInfo')
				}
				// dispatch('getMemberCardInfo')
			}).finally(() => {
				loginPromise = null
			})
			return loginPromise
		},
		mobileLogin(mobileData) {
			const appStore = useAppStore()
			return wx.login({
				provider: 'weixin',
			}).then(result => apis.get_openid({
				code: result.code
			})).then(res => {
				const openid = res.data.openid
				if (!openid) {
					uni.showToast({
						icon: 'none',
						title: 'openid为空'
					})
					return
				}
				this.setOpenid(openid)
				return apis.member_binding_mobile({
					encryptedData: mobileData.encryptedData,
					iv: mobileData.iv,
					sessionKey: res.data.session_key
				})

			}).then(() => {
				return apis.wechat_login({
					openId: this.openid,
					nickname: '',
					avatarUrl: '',
					storeId: appStore.storeId
				})
			}).then(result => {
				// 获取用户基本信息
				const provider = result.data
				this.setLoginInfo(provider)
				const userInfo = provider.info;
				// dispatch('getMemberCardInfo')
			})
		},
	},
})
