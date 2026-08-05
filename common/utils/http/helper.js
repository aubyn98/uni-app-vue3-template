import {
	cloneDeepWithDescriptors,
} from '../object'
import {
	getCache,
	setCache,
	composeAsync,
	getRandomStr
} from '../magic'
export const CONTENT_TYPES = Object.freeze({
	/** json */
	JSON: 'application/json;charset=UTF-8',
	/** text/plain */
	TEXT: 'text/plain;charset=UTF-8',
	/** form-data 一般配合qs */
	FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
	/** form-data  上传 */
	FORM_DATA: 'multipart/form-data;charset=UTF-8'
})

export const CancelToken = {
	caches: {},
	add(token, Task) {
		this.caches[token] = Task
	},
	delete(token) {
		delete this.caches[token]
	},
	_cancel(token) {
		const Task = this.caches[token]
		if (Task) Task.abort()
	},
	cancelAll() {
		Object.values(this.caches).forEach(task => task.abort())
		this.caches = {}
	},
	source() {
		const token = getRandomStr()
		return {
			token,
			cancel: () => this._cancel(token)
		}
	}
}

export function promisifyRequest(type, {
	cancelToken,
	...opts
}) {
	return new Promise((resolve, reject) => {
		const Task = uni[type]({
			...opts,
			success(res) {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					return resolve(res)
				}
				reject({
					type: 'fail',
					res
				})
			},
			fail(res) {
				reject({
					type: 'fail',
					res
				})
			},
			complete() {
				if (cancelToken) CancelToken.delete(cancelToken)
			}
		})
		if (cancelToken) CancelToken.add(cancelToken, Task)
	})
}

let isLoading = false;

export function showLoading(title) {
	if (!isLoading) {
		isLoading = true;
		uni.showLoading({
			title,
			mask: true
		});
	}
}

export function hideLoading() {
	if (isLoading) {
		isLoading = false;
		uni.hideLoading();
	}
}

let loadingCount = 0

export function startLoading(title = '加载中...') {
	loadingCount++
	if (loadingCount === 1) showLoading(title)
}

export function endLoading() {
	if (loadingCount > 0) loadingCount--
	if (loadingCount === 0) hideLoading()
}

function simplify(_request, type) {
	return function(url, params, config, options) {
		return _request(url, type, params, config, options)
	}
}

function normalizeHeaders(headers) {
	return typeof headers === 'function' ? headers : () => headers
}

function normalizeConfig(url, defaultConfig, config) {
	const tempConfig = {
		...defaultConfig,
		...config,
		headers: {
			...normalizeHeaders(defaultConfig.headers)(),
			...normalizeHeaders(config.headers)()
		}
	}
	const {
		headers,
		...configRes
	} = tempConfig

	const urlRes = url.startsWith('http') ? url : tempConfig.baseURL ? tempConfig.baseURL + url : url
	return {
		urlRes,
		headers,
		configRes
	}
}

function normalizeInterceptor(interceptor) {
	if (typeof interceptor === 'function') return [interceptor]
	if (interceptor instanceof Array) return interceptor.filter(item => typeof item === 'function')
	return []
}

function normalizeOpts({
	url,
	loadingText
}, defaultOpts = {}, options = {}) {
	const opts = {
		qs: true,
		showError: true,
		isCache: false,
		cacheKey: `api:${url}`,
		cacheExpire: 1000 * 60 * 60 * 1,
		loadingText,
		loading: true,
		reqInterceptor: (e) => e,
		resInterceptor: (res) => res,
		errInterceptor: () => void 0,
		...defaultOpts,
		...options
	};

	['reqInterceptor', 'resInterceptor', 'errInterceptor'].forEach(k => {
		const mergedInterceptors = [
			...normalizeInterceptor(defaultOpts[k]),
			...normalizeInterceptor(options[k])
		]
		opts[k] = mergedInterceptors.length ? composeAsync(...mergedInterceptors) : (e) => e
	})

	return opts
}

function getReload(fn, argvs) {
	return () => fn(...cloneDeepWithDescriptors(argvs))
}

export function createRequest(defaultConfig, defaultOpts) {

	function _request(url, method, params, config, options) {
		const source = CancelToken.source()
		const reloadFn = getReload(_request, arguments)

		options = normalizeOpts({
			url,
			loadingText: '加载中...'
		}, defaultOpts, options)

		const {
			urlRes,
			headers,
			configRes
		} = normalizeConfig(url, defaultConfig, config)

		if (options.isCache) {
			const cache = getCache(options.cacheKey)
			if (cache) return Promise.resolve(cache)
		}

		options.loading && startLoading(options.loadingText)
		let closeLoading = () => {
			options.loading && endLoading()
			closeLoading = null
		}

		const finalArgvs = options.reqInterceptor({
			cancelToken: source.token,
			method,
			url: urlRes,
			data: params,
			header: {
				'Content-Type': method.toUpperCase() === 'GET' ? CONTENT_TYPES.JSON : options.qs ?
					CONTENT_TYPES.FORM_URLENCODED : CONTENT_TYPES.JSON,
				...headers
			},
			...configRes
		})

		return promisifyRequest('request', finalArgvs)
			.then(res => {
				closeLoading()
				return options.resInterceptor(res, options, reloadFn)
			})
			.then(temp => {
				if (options.isCache) setCache(options.cacheKey, temp, options.cacheExpire)
				return temp
			})
			.catch(e => {
				closeLoading && closeLoading()
				options.errInterceptor(e)
				return Promise.reject(e)
			})
	}
	_request.get = simplify(_request, 'get')
	_request.post = simplify(_request, 'post')
	return _request
}

export function createUploadFile(defaultConfig, defaultOpts) {
	return function _uploadFile(url, params, config, options) {
		const source = CancelToken.source()

		const reloadFn = getReload(_uploadFile, arguments)
		params = {
			keyName: 'file',
			filePath: '',
			...params
		}

		options = normalizeOpts({
			loadingText: '上传中...'
		}, defaultOpts, options)

		const {
			urlRes,
			headers,
			configRes
		} = normalizeConfig(url, defaultConfig, config)

		const {
			keyName,
			filePath,
			...formData
		} = params

		if (!filePath.startsWith('http://tmp') && !filePath.startsWith('wxfile://tmp')) return Promise.resolve({
			data: filePath
		})

		options.loading && startLoading(options.loadingText)
		let closeLoading = () => {
			options.loading && endLoading()
			closeLoading = null
		}

		const finalArgvs = options.reqInterceptor({
			cancelToken: source.token,
			url: urlRes,
			filePath,
			name: keyName,
			formData,
			header: {
				...headers
			},
			...configRes
		})

		return promisifyRequest('uploadFile', finalArgvs)
			.then(res => {
				closeLoading()
				try {
					res.data = JSON.parse(res.data)
					return options.resInterceptor(res, options, reloadFn)
				} catch (e) {
					return Promise.reject({
						type: 'code error',
						res: e
					})
				}
			})
			.catch(e => {
				closeLoading && closeLoading()
				options.errInterceptor(e)
				return Promise.reject(e)
			})

	}
}

export function createDownloadFile(defaultConfig, defaultOpts) {
	return function _downloadFile(url, params, config, options) {
		const source = CancelToken.source()

		options = normalizeOpts({
			loadingText: '下载中...'
		}, defaultOpts, options)

		const {
			urlRes,
			headers,
			configRes
		} = normalizeConfig(url, defaultConfig, config)

		const hasParams = typeof params === 'object' && params !== null
		if (hasParams) {
			params = Object.keys(params).reduce((prev, k) => {
				const val = params[k]
				val && prev.push(encodeURIComponent(k) + '=' + encodeURIComponent(val))
				return prev
			}, []).join('&')
		}

		options.loading && startLoading(options.loadingText)
		let closeLoading = () => {
			options.loading && endLoading()
			closeLoading = null
		}

		const finalArgvs = options.reqInterceptor({
			cancelToken: source.token,
			url: urlRes + (hasParams ?
				'?' + params : ''),
			header: {
				...headers
			},
			...configRes
		})

		return promisifyRequest('downloadFile', finalArgvs).then((res) => {
			closeLoading()
			return options.resInterceptor(res, options)
		}).catch((e) => {
			closeLoading && closeLoading()
			options.errInterceptor(e)
			return Promise.reject(e)
		})
	}
}