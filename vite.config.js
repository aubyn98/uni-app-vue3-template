import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
	plugins: [uni()],
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				// 非 App 平台移除 console 代码(包含所有 console 方法)
				drop_console: true,
				pure_funcs: [
					'__f__' // App 平台 vue 移除日志代码
				]
			}
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				// 取消 uview-plus 旧版 sass API 弃用报警
				silenceDeprecations: ['legacy-js-api', 'import']
			}
		}
	}
})
