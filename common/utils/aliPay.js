import * as apis from '@/common/apis';

function createNode(key, data, form) {
	const node = document.createElement('input')
	node.name = key
	node.value = data[key]
	form.append(node)
}


export function aliPay(params, type = 'pay') {

	return apis.get_alipay(params).then(res => {
		if (!res.status) {
			return uni.showToast({
				icon: 'none',
				title: res.message
			})
		}

		const data = res.data;
		delete data.alipayUrl
		const form = document.createElement('form')
		form.action = 'https://mapi.alipay.com/gateway.do'
		type == 'pay' ? Object.keys(data).forEach((key, i) => (key != 'sn' && key != 'id') &&
			createNode(key, data, form)) : Object.keys(data).forEach((key, i) => createNode(key,
			data, form))
		document.getElementsByTagName('body')[0].append(form)
		form.submit()
	})
}

export default {
	aliPay
}