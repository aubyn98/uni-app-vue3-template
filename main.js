import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App'
import * as apis from '@/common/apis'
import * as utils from '@/common/utils'
import CONFIG from '@/common/config'
// import customUI from '@/components/custom-ui'
import uviewPlus from 'uview-plus'
import {
	global
} from '@/common/mixins'

export function createApp() {
	const app = createSSRApp(App)
	const pinia = createPinia()

	app.config.globalProperties.$utils = utils
	app.config.globalProperties.$apis = apis

	app.use(CONFIG).use(pinia).use(uviewPlus)

	return { app, pinia }
}
