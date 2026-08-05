import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
	state: () => ({
		isAuthorized: false,
		location: null
	}),
	actions: {
		changeAuthorize(payload) {
			this.isAuthorized = payload
		},
		changeLocation(payload) {
			this.location = payload
		},
		startLocationUpdate() {
			uni.startLocationUpdate({
				success: () => {
					this.changeAuthorize(true)
				},
				fail: () => {
					this.changeAuthorize(false)
				}
			})
		},
		stopLocationUpdate() {
			uni.stopLocationUpdate({
				success() {

				},
				fail() {

				}
			})
		},
		onLocationChange(fn) {
			uni.onLocationChange((res) => {
				this.changeLocation(res)
				typeof fn === 'function' && fn(res)
			})
		},
		offLocationChange() {
			uni.offLocationChange()
		}
	},
})
