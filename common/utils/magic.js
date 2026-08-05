// 组合函数
export function compose(...fns) {
	if (fns.some(fn => typeof fn !== 'function')) {
		throw new TypeError('compose 参数必须是函数');
	}
	if (fns.length === 0) return (...args) => args.length === 1 ? args[0] : args;
	return fns.reduce(
		(l, r) =>
		function(...args) {
			return r.call(this, (...nArgs) => l.apply(this, nArgs.concat(args)), ...args)
		}
	)
}

export function composeAsync(...fns) {
	if (fns.some(fn => typeof fn !== 'function')) {
		throw new TypeError('composeAsync 参数必须是函数');
	}

	if (fns.length === 0) {
		return async (...args) => args.length === 1 ? args[0] : args;
	}

	return fns.reduce((l, r) => {
		return async function(...args) {
			return r.call(this, async (...nArgs) => l.apply(this, nArgs.concat(args)), ...args);
		};
	});
}

export function pipe(...fns) {
	if (fns.some(fn => typeof fn !== 'function')) {
		throw new TypeError('pipe 参数必须是函数');
	}
	if (fns.length === 0) return (...args) => args.length === 1 ? args[0] : args;
	return fns.reduce(
		(l, r) =>
		function(...args) {
			return l.call(this, (...nArgs) => r.apply(this, nArgs.concat(args)), ...args)
		}
	)
}

export function pipeAsync(...fns) {
	if (fns.some(fn => typeof fn !== 'function')) {
		throw new TypeError('pipeAsync 参数必须是函数');
	}

	if (fns.length === 0) {
		return async (...args) => args.length === 1 ? args[0] : args;
	}

	return fns.reduce((l, r) => {
		return async function(...args) {
			return l.call(this, async (...nArgs) => r.apply(this, nArgs.concat(args)), ...args);
		};
	});
}

// 防抖
export function debounce(fn, delay) {
	let timer = null;
	_.stop = () => timer && clearTimeout(timer);

	function _(...argvs) {
		_.stop();
		timer = setTimeout(() => {
			fn.apply(this, argvs);
		}, delay);
	}
	return _;
}

export function debouncePromise(fn, delay) {
	let timer = null,
		arr = [];
	_.stop = () => {
		if (timer) {
			arr.shift()?.('cancel');
			clearTimeout(timer);
		}
	};

	function _(...argvs) {
		return new Promise((resolve, reject) => {
			_.stop();
			arr.push(reject);
			timer = setTimeout(() => {
				resolve(fn.apply(this, argvs));
			}, delay);
		});
	}
	return _;
}

// 节流
export function throttle(func, wait = 500, immediate = true) {
	let timer, flag;
	return immediate ? function(...argvs) {
		if (flag) return
		flag = true;
		typeof func === 'function' && func.apply(this, argvs);
		timer = setTimeout(() => {
			flag = false;
		}, wait);

	} : function(...argvs) {
		if (flag) return
		flag = true
		timer = setTimeout(() => {
			flag = false
			typeof func === 'function' && func.apply(this, argvs);
		}, wait);
	}
}

// 路径参数编解码
export function encodeURIParams(params) {
	return encodeURIComponent(JSON.stringify(params || {}))
}
export function decodeURIParams(params) {
	return JSON.parse(decodeURIComponent(params || '{}'))
}
// 路径参数对象化
export function getSearchParams(str) {
	const collect = {}
	decodeURIComponent(str).replace(/([^?^&]*?)=([^?^&]*)/g, (match, k, v) => {
		const temp = collect[k]
		if (!temp) return (collect[k] = v)
		if (temp && typeof temp === 'string') return (collect[k] = [temp, v])
		collect[k].push(v)
	})
	return collect
}

export function getRandomStr(len = 8, $chars) {
	len = len || 32;
	$chars ||= 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	const maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

// 获取路径参数
export function getSearchStr(params) {
	return Object.keys(params)
		.map(key => {
			const v = params[key];
			return `${key}=${v && typeof v === 'object' ? JSON.stringify(v) : v}`;
		})
		.join('&');
}

// 获取页面参数
export function getOnLoadParams(e) {
	const scene = e.scene
	if (scene) {
		e = {
			fromCode: true,
			...e,
			...getSearchParams(scene)
		}
	}
	return e
}

/**
 * 设置本地缓存（带过期时间）
 * @param {string} key 缓存键名
 * @param {any} data 缓存数据
 * @param {number} expire 过期时间（毫秒），默认1小时
 * @returns {boolean} 设置成功返回true，失败返回false
 */
export function setCache(key, data, expire = 1000 * 60 * 60 * 1) {
	try {
		uni.setStorageSync(key, {
			time: Date.now(),
			expire,
			data
		})
		return true
	} catch (error) {
		console.error(`设置缓存[${key}]失败：`, error);
		return false
	}
}

/**
 * 获取本地缓存（自动校验有效性，过期自动清理）
 * @param {string} key 缓存键名
 * @returns {any|null} 有效数据返回数据，否则返回null
 */
export function getCache(key) {
	try {
		const cache = uni.getStorageSync(key);
		const isInvalidCache = !cache ||
			typeof cache !== 'object' ||
			Array.isArray(cache) ||
			!('time' in cache) ||
			!('expire' in cache);

		if (isInvalidCache) {
			cache && uni.clearStorageSync(key);
			return null;
		}

		if (Date.now() - cache.time >= cache.expire) {
			uni.clearStorageSync(key);
			return null;
		}

		return cache.data;
	} catch (error) {
		console.error(`获取缓存[${key}]失败：`, error);
		return null;
	}
}