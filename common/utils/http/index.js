import {
	BASE_URL,
	TOKEN_KEY
} from '../../config'
import {
	useUserStore,
	useAppStore
} from '@/store'
import {
	hasOwnProperty,
} from '../object'
import {
	showToast
} from '../project'
import {
	createRequest,
	createUploadFile,
	createDownloadFile
} from './helper'
export {
	showLoading,
	hideLoading
} from './helper'

function errInterceptor(e) {
	const pages = getCurrentPages().unshift()
	if ((e.type == 'fail' || e.res.statusCode == 502) && page != '/pages/errorPage/errorPage') {
		uni.$u.route({
			url: '/pages/errorPage/errorPage',
			type: 'redirectTo',
			params: {
				type: e.res.statusCode == 502 ? '502' : 'fail'
			}
		})
	}
}

function resInterceptor(res, options, reloadFn) {
	const data = res.data
	if (hasOwnProperty(data, 'status') && !data.status) {
		if (['invalidAuthorization' /* , 'parameterMustBeNotnull' */ ].includes(data.responseCode)) {
			return useUserStore().login().then(reloadFn)
		}
		if (hasOwnProperty(data, 'message') && options.showError) showToast(data.message)
		return Promise.reject({
			type: 'status',
			res
		})
	}
	return data
}



export const downloadFile = createDownloadFile({
	baseURL: BASE_URL,
	headers() {
		const token = useUserStore().token
		return {
			...(token && {
				[TOKEN_KEY]: token
			}),
		}
	}
}, {
	errInterceptor
})



export const uploadFile = createUploadFile({
	baseURL: BASE_URL,
	headers() {
		const token = useUserStore().token
		return {
			...(token && {
				[TOKEN_KEY]: token
			}),
		}
	}
}, {
	resInterceptor,
	errInterceptor
})





export const request = createRequest({
	baseURL: BASE_URL,
	headers() {
		const token = useUserStore().token
		return {
			'source': 'miniProgram',
			'deliveryType': useAppStore().deliveryType,
			...(token && {
				[TOKEN_KEY]: token
			}),
		}
	}
}, {
	resInterceptor,
	errInterceptor
})

export default request
