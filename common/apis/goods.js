import {
	request
} from '@/common/utils'

export function get_goods_list(params, opts) {
	return request.get('/app-api/product/page', params, {}, opts)
}
export function get_goods_recommend(params, opts) {
	return request.get('/app-api/product/recommend', params, {}, opts)
}
export function get_goods_similar(params, opts) {
	return request.get('/app-api/product/similar', params, {}, opts)
}
export function get_goods_suggest(params, opts) {
	return request.get('/app-api/product/suggest', params, {}, {
		loading: false,
		...opts
	})
}
export function get_goods_detail(params, opts) {
	return request.get('/app-api/product/detail', params, {}, opts)
}

export function get_goodsCategory_tree(params, opts) {
	return request.get('/app-api/product_category/tree', params, {}, opts)
}

export function get_fixture_current(params, opts) {
	return request.get('/app-api/fixture/current', params, {}, opts)
}

export function get_goods_multi(params, opts) {
	return request.post('/app-api/product/multi', params, {}, {
		showErr: false,
		...opts
	})
}

export function get_goods_activity(params, opts) {
	return request.post('/app-api/product/activity', params, {}, {
		...opts
	})
}

export function get_definePage_detail(params, opts) {
	return request.get('/app-api/define_page/detail', params, {}, {
		showError: false,
		loading: false,
		...opts
	})
}

export function get_seckills(params, opts) {
	return request.get('/app-api/activity/seckills', params, {}, {
		showError: false,
		...opts
	})
}
/* 砍价详情 */
export function get_bargain_detail(params, opts) {
	return request.get('/app-api/bargain/detail', params, {}, {
		showError: false,
		loading: false,
		...opts
	})
}
/* 疯狂砍价、砍价列表 */
export function get_bargain_index(params, opts) {
	return request.get('/app-api/bargain/index', params, {}, {
		showError: false,
		...opts
	})
}
/* 砍价记录 */
export function get_bargain_record(params, opts) {
	return request.get('/app-api/bargain/record', params, {}, {
		showError: false,
		...opts
	})
}
/* 砍价*/
export function post_bargain_help(params, opts) {
	return request.post('/app-api/bargain/help', params, {}, {
		qs: false,
		...opts
	})
}
/* 分享：保存海报-发送朋友，记录分享次数 */
export function post_bargain_share(params, opts) {
	return request.post('/app-api/bargain/share', params, {}, {
		showError: false,
		...opts
	})
}
/* 发起砍价 */
export function post_bargain_start(params, opts) {
	return request.post('/app-api/bargain/start', params, {}, {
		qs: false,
		...opts
	})
}