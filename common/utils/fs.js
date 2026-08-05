import {
	downloadFile
} from './http/index.js'
// #ifndef H5
export const $fs = uni.getFileSystemManager();
// #endif

const encodingList = ['ascii', 'base64', 'binary', 'hex', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'utf-8', 'utf8',
	'latin1'
]

export function getImgBase64Prefix(imgType = 'png') {
	return `data:image/${imgType};base64,`
}
// #ifndef H5
export function readFile({
	filePath,
	encoding,
	sync,
	opts = {}
}) {
	if (!encodingList.includes(encoding)) throw '编码不符合'
	if (sync === true) {
		try {
			const res = $fs.readFileSync(filePath, encoding, opts.position, opts.length)
			return res
		} catch (e) {
			console.error(e)
			return null
		}
	}
	return new Promise(function(resolve, reject) {
		$fs.readFile({
			filePath,
			encoding,
			...opts,
			success(res) {
				resolve(res)
			},
			fail: reject
		})
	})
}
readFile.sync = function(opts) {
	return readFile({
		...opts,
		sync: true
	})
}


export function writeFile({
	filePath,
	data,
	encoding,
	sync,
	opts
}) {
	encoding = encoding || 'binary'
	if (!encodingList.includes(encoding)) throw '编码不符合'
	if (sync === true) {
		try {
			$fs.writeFileSync(filePath, data, encoding)
			return {
				tempFilePath: filePath,
				unlink: () => $fs.unlinkSync(filePath)
			}
		} catch (e) {
			console.error(e)
			return null
		}
	}
	return new Promise(function(resolve, reject) {
		$fs.writeFile({
			filePath,
			encoding,
			data,
			...opts,
			success(res) {
				if (res.errMsg !== 'writeFile:ok') return reject(new Error(res.errMsg))
				resolve({
					tempFilePath: filePath,
					unlink: () => $fs.unlinkSync(filePath)
				})
			},
			fail: reject
		})
	})
}
writeFile.sync = function(opts) {
	return writeFile({
		...opts,
		sync: true
	})
}

export function getArraybufferTempPath({
	arraybuffer,
	fileType,
	method,
	canvasId,
	width,
	height,
	ctx,
	sync,
}) {
	if (typeof arraybuffer !== 'object' || arraybuffer.toString().slice(8, -1) !== 'ArrayBuffer') return reject(
		new Error(
			'ArrayBuffer must be a ArrayBuffer'))
	method = method || 'canvas'
	fileType = fileType || 'png'
	if (method === 'fs') {
		const filePath = wx.env.USER_DATA_PATH + '/' + Date.now() + '.' + fileType
		return writeFile({
			filePath,
			data: arraybuffer,
			sync
		})
	}
	if (method === 'canvas') {
		return new Promise(function(resolve, reject) {
			if (!['canvas', 'fs'].includes(method)) return reject(new Error('method must be canvas | fs'))
			const base64Url = `data:image/${fileType};base64,${uni.arrayBufferToBase64(arraybuffer)}`
			if (typeof canvasId !== 'string') return reject(new Error('canvasId must be a string [#id]'))
			const query = uni.createSelectorQuery()
			if (ctx) query.in(ctx)
			query.select(canvasId).fields({
				node: true,
				size: true,
			}).exec(async res => {
				res = res[0]
				if (!res) return reject(new Error('No canvas nodes were obtained'))
				width = width || res.width
				height = height || res.height
				const canvas = res.node
				if (!canvas) return reject(new Error('No canvas instances were obtained'))
				const context = canvas.getContext('2d')
				const image = canvas.createImage()
				await new Promise(resolve => {
					image.onload = resolve
					image.src = base64Url
				}).catch(reject)
				context.clearRect(0, 0, width, height)
				context.drawImage(image, 0, 0, width, height)
				uni.canvasToTempFilePath({
					canvas,
					width,
					height,
					fileType,
					success: resolve,
					fail: reject
				})
			})
		})
	}
}

const canChooseMedia = uni.canIUse('chooseMedia')

export function chooseImg(opts) {
	opts = {
		count: 1,
		...opts
	}
	return new Promise((resolve, reject) => {
		canChooseMedia ? uni.chooseMedia({
			...opts,
			mediaType: 'image',
			sizeType: ['original', 'compressed'],
			success(res) {
				if (res.errMsg == "chooseMedia:ok" && res.tempFiles[0]) {
					const tempFilePaths = res.tempFiles.map(it => it.tempFilePath)
					resolve(tempFilePaths)
				} else {
					reject(res.errMsg)
				}
			},
			fail(err) {
				reject(err)
			}
		}) : uni.chooseImage({
			count,
			success(res) {
				resolve(res.tempFilePaths);
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

export function saveImageToPhotosAlbum(url) {
	return new Promise((r, j) => {
		downloadFile(url).then(res => {
			uni.saveImageToPhotosAlbum({
				filePath: res.tempFilePath,
				success: (e) => {
					uni.showToast({
						icon: 'none',
						title: '保存成功'
					})
					r(e)
				},
				fail: (e) => {
					j(e)
				},
			})
		})
	})
}
// #endif