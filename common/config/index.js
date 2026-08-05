export const IS_DEV = process.env.NODE_ENV === 'development'

export const VERSION = '0.0.1'

export const API_ADDRESS = Object.freeze({
	DEV: 'https://global.api.360hwj.com',
	// DEV: 'http://global.test.360hwj.com',
	// DEV: 'https://global.api.360hwj.com',
	PRO: 'https://global.api.360hwj.com'
})

export const BASE_URL = API_ADDRESS[IS_DEV ? 'DEV' : 'PRO']

export const AesKey = 'Nzk0NDg3NDUxNTA1ODQ3Mw=='

/** token的键名 */
export const TOKEN_KEY = 'Authorization'

/** 默认分享图 */
export const DEFAULT_SHARE_IMG = 'http://image.360hwj.com/store/20240121/c47b71d72bde4063946baba0541b20f1.png'

/** 默认商品图片 */
export const DEFAULT_GOODS_IMG = 'http://image.360hwj.com/store/empty.png'

/** 商品状态 */
export const GOODS_STATUS = Object.freeze({
	/** 上架中的商品 */
	ENABLE: 'ENABLE',
	/** 仓库中的商品 */
	DISABLED: 'DISABLE',
	/** 已售罄的商品 */
	SOLD_OUT: 'SOLD_OUT',
	/** 警戒库存商品 */
	ALERT_STOCK: 'ALERT_STOCK',
	/** 回收站中的商品 */
	RECYCLE: 'RECYCLE'
})
/** sku类型 */
export const SKU_TYPES = Object.freeze({
	/** 多规格 */
	MULTIPLE: 'MULTIPLE',
	/** 单规格 */
	SINGLE: 'SINGLE'
})
/** 订单类型 */
export const ORDER_TYPES = Object.freeze({
	/** 正常订单 */
	NORMAL: 'NORMAL',
	/** 拼团订单  */
	JOINT: 'JOINT',
	/** 砍价订单  */
	BARGAIN: 'BARGAIN',
})

/** 订单状态 */
export const ORDER_STATUS = Object.freeze({
	/** 待支付 */
	CREATE: 'CREATE',
	/** 已支付/待发货  */
	DELIVERY: 'DELIVERY',
	/** 已发货  */
	SHIPPING: 'SHIPPING',
	/** 确认收货  */
	CONFIRMED: 'CONFIRMED',
	/** 已完成  */
	COMPLETED: 'COMPLETED',
	/** 已取消  */
	CANCELED: 'CANCELED',
	/** 售后 */
	AFTERSALE: 'AFTERSALE',
})

/** 售后单类型 */
export const AFTERSALE_TYPES = Object.freeze({
	/** 退货退款 */
	RETURN: 'RETURN_AFTER_REFUND',
	/** 仅退款 */
	REFUND: 'ONLY_REFUND'
})

/** 售后单状态 */
export const AFTERSALE_STATUS = Object.freeze({
	/** 申请 */
	APPLY: 'APPLY',
	/** 审核不通过 */
	AUDIT_REJECT: 'AUDIT_REJECT',
	/** 审核通过 */
	AUDIT_PASS: 'AUDIT_PASS',
	/** 填写单号/寄回 */
	SENT_BACK: 'SENT_BACK',
	/** 平台收货 */
	RECEIVED: 'RECEIVED',
	/** 完成 */
	COMPLETE: 'COMPLETE',
	/** 关闭 */
	CLOSE: 'CLOSE'
})

/** 拼团状态 */
export const GROUP_STATUS = Object.freeze({
	/** 拼团进行中 */
	CREATE: 'CREATE',
	/** 拼团失败  */
	FAILURE: 'FAILURE',
	/** 拼团成功  */
	SUCCESS: 'SUCCESS',
})

/** 支付方式 */
export const PAY_METHODS = Object.freeze({
	/** 微信支付(小程序) */
	WX_MINI: 'wxpay_miniapp',
	/** 钱包支付  */
	BALANCE: 'balance_pay',
})

/** tabBar页面跳转键名 */
export const PAGE_JUMP_KEYS = Object.freeze({
	/** 跳转找药页面参数 存储缓存的键 */
	FIND_MEDICINE: 'jump-findMedicine',
})

/** 提现方式 */
export const WITHDRAWAL_TYPES = Object.freeze({
	/** 银行卡 */
	BANK: 'BANK',
	/** 微信 */
	WECHAT: 'WECHAT',
	/** 支付宝 */
	ALIPAY: 'ALIPAY'
})
/** 提现状态 */
export const WITHDRAWAL_STATUS = Object.freeze({
	/** 审核中 */
	CREATE: 'CREATE',
	/** 已提现 */
	SUCCESS: 'SUCCESS',
	/** 未通过 */
	FAILURE: 'FAILURE',
})

export default {
	install(app) {
		app.config.globalProperties.$IS_DEV = IS_DEV
		app.config.globalProperties.$API_ADDRESS = API_ADDRESS
		app.config.globalProperties.$BASE_URL = BASE_URL
		app.config.globalProperties.$TOKEN_KEY = TOKEN_KEY
		app.config.globalProperties.$DEFAULT_SHARE_IMG = DEFAULT_SHARE_IMG
		app.config.globalProperties.$DEFAULT_GOODS_IMG = DEFAULT_GOODS_IMG

		app.config.globalProperties.$GOODS_STATUS = GOODS_STATUS
		app.config.globalProperties.$SKU_TYPES = SKU_TYPES
		app.config.globalProperties.$ORDER_TYPES = ORDER_TYPES
		app.config.globalProperties.$ORDER_STATUS = ORDER_STATUS
		app.config.globalProperties.$GROUP_STATUS = GROUP_STATUS
		app.config.globalProperties.$PAY_METHODS = PAY_METHODS
		app.config.globalProperties.$WITHDRAWAL_TYPES = WITHDRAWAL_TYPES
		app.config.globalProperties.$WITHDRAWAL_STATUS = WITHDRAWAL_STATUS
	}
}