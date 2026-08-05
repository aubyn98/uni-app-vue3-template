<template>
	<block>
		<scroll-view class="category-scroll-view" :style="[fixedStyle]" scroll-y
			:scroll-into-view="$SCROLLKEY + currentSubCategory.parentId">
			<view class="category-menus">
				<view :id="$SCROLLKEY + item.id" class="category-menu-item"
					:class="{ 'is-active': item.id == currentSubCategory.parentId  }" v-for="item in goodsCategoryTree"
					:key="item.id" @click="categoryClick(item)">
					<view class="category-name">{{ item.name }}</view>
				</view>
			</view>
		</scroll-view>
		<view class="condition-wrapper" :style="[fixedStyle]" v-if="subCategorys.length > 1">
			<scroll-view class="subCategory-menus" scroll-x :scroll-into-view="$SCROLLKEY + currentSubCategory.id">
				<view :id="$SCROLLKEY + it.id" class="subCategory-menus-item"
					:class="{ 'is-active': it.id == currentSubCategory.id  }" v-for="it in subCategorys" :key="it.id"
					@click="subCategoryClick(it)">
					{{ it.name }}
				</view>
			</scroll-view>
		</view>
		<view id="scroll-content" :style="moveStyle" @touchstart="wxsBiz.touchstartEvent"
			@touchmove="wxsBiz.touchmoveEvent" @touchend="wxsBiz.touchendEvent" @touchcancel="wxsBiz.touchendEvent"
			:change:prop="wxsBiz.propObserver" :prop="wxsProp">
			<mescroll-body class="mescroll-body" :top="top" @init="mescrollInit" @down="downCallback" @up="upCallback"
				:down="downOption" :up="upOption" offsetLeft="152rpx">
				<view class="main-container" :style="{ minHeight: `calc(100vh - ${top} - 110rpx)`}">
					<p-goods-list-item class="list-item-wrapper" v-for="goods in goodsList" :key="goods.id"
						:source="goods" />
				</view>
			</mescroll-body>
		</view>
	</block>
</template>
<script>
	import {
		mapState,
		mapGetters,
	} from 'vuex'
	import {
		debounce
	} from '@/common/utils'
	import MescrollMixin from "@/components/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import MescrollBody from "@/components/mescroll-uni/components/mescroll-body/mescroll-body.vue";
	import WxsMixin from './wxs/mixins.js'
	import {
		tabBar
	} from '@/common/mixins'
	import {
		PAGE_JUMP_KEYS
	} from '@/common/config'
	
	/** 分类的循环引用 */
	export default {
		mixins: [MescrollMixin, WxsMixin, tabBar],
		components: {
			MescrollBody,
		},
		data() {
			return {
				tabBarIndex: 1,
				goodsCategoryTree: [],
				form: {
					status: this.$GOODS_STATUS.ENABLE,
					pageNumber: 1,
					pageSize: 20,
				},
				goodsList: [],
				currentSubCategory: {},
				downOption: {
					textInOffset: '下拉加载上一个',
					textOutOffset: '释放加载',
					isLock: true,
				},
				upOption: {
					page: {
						num: 1,
						size: 20
					},
					auto: false,
					textNoMore: '上滑加载下一分类'
				},
				pager: -1,
				locked: true,
				reachTheBottom: false,
				moveStyle: '',
				$SCROLLKEY: 'scrollTo_'
			}
		},
		computed: {
			/** 是否可以下拉刷新 */
			isDisabledDown() {
				let disabled = true
				const firt = this.goodsCategoryTree[0]
				if (firt) {
					disabled = this.currentSubCategory.parentId == firt.id && this.currentSubCategory.id == firt
						?.children[0].id
				}
				return disabled
			},
			/** 是否为最一个大类的最后一个子类 */
			isLast() {
				if (!this.goodsCategoryTree.length) return true
				const last = this.goodsCategoryTree[this.goodsCategoryTree.length - 1]
				const {
					parentId,
					id
				} = this.currentSubCategory
				const subLast = last.children[last.children.length - 1]
				return parentId == last.id && id == subLast.id
			},
			/** 当前分类是否加载完成 */
			curGoodsloaded() {
				return this.form.pageNumber == this.pager || this.pager == 0
			},
			/** 是否可以上拉加载下一类目 */
			canSlideUp() {
				return this.curGoodsloaded && !this.isLast && (this.reachTheBottom || !this.goodsList.length)
			},
			/** 当前大类索引 */
			categoryIdx() {
				return this.goodsCategoryTree.findIndex(it => it.id == this.currentSubCategory.parentId)
			},
			/** 当前子类 */
			subCategorys() {
				return this.goodsCategoryTree.find(i => i.id == this.currentSubCategory.parentId)?.children || []
			},
			/** 当前子类索引 */
			subCategoryIdx() {
				return this.subCategorys.findIndex(it => it.id == this.currentSubCategory.id)
			},
			/** 筛选条件的高度 mescroll的top */
			top() {
				return uni.$u.getPx(this.conditionOccupySpace.height) + uni.$u.getPx(this.fixedStyle.top) +
					'px'
			},
			/** 侧边栏和筛选条件的固定定位Top */
			fixedStyle() {
				return {
					top: 0 + 'px'
				}
			},
			/** 筛选条件的高度 */
			conditionOccupySpace() {
				return {
					height: this.subCategorys.length > 1 ? '100rpx' : '0'
				}
			},
			/** 请求参数 */
			postParams() {
				return {
					...this.form,
					categoryId: this.currentSubCategory.id,

				}
			}
		},
		watch: {
			isDisabledDown(v) {
				this.mescroll && this.mescroll.lockDownScroll(v)
			},
			canSlideUp(v) {
				if (v) this.mescroll.optUp.textNoMore = '上滑加载下一分类'
			},
			isLast(v) {
				if (v) this.mescroll.optUp.textNoMore = '到底了'
				else this.mescroll.optUp.textNoMore = '上滑加载下一分类'
			}
		},
		async onLoad(e) {
			await this.init(e)
			uni.$on(PAGE_JUMP_KEYS.FIND_MEDICINE, this.onJump)
		},
		onUnload() {
			uni.$off(PAGE_JUMP_KEYS.FIND_MEDICINE, this.onJump)
		},
		onPageScroll(e) {
			this.queryContentHeight(e)
		},
		onReachBottom() {
			setTimeout(() => {
				this.reachTheBottom = true
			}, 17);
		},
		methods: {
			async init(e) {
				const data = await this.getGoodsCategory()
				const res = this.onJump()
				if (res) return
				this.subCategoryClick(data[0].children[0], true)
			},
			onJump() {
				const categoryId = uni.getStorageSync(PAGE_JUMP_KEYS.FIND_MEDICINE)
				if (categoryId) {
					let index = 0
					const item = this.$utils.findTreeItem(this.goodsCategoryTree, (item, idx) => {
							const flag = item.id == categoryId
							if (flag) index = idx
							return flag
						},
						'children')
					uni.removeStorageSync(PAGE_JUMP_KEYS.FIND_MEDICINE)
					if (item) {
						const firt = item.parentId ? this.goodsCategoryTree.find(it => it.id === item.parentId) : item
						const idx = item.parentId ? index : 0
						return this.categoryClick(firt, idx)
					}
				}
			},
			queryContentHeight: debounce(function(e) {
				return this.$uGetRect('#scroll-content').then(rect => {
					this.reachTheBottom = this.mescroll.bodyHeight + e.scrollTop >= rect.height - 50
				})
			}, 50),
			wxsCall(msg) {
				if (msg.type === 'setWxsProp') {
					this.wxsProp = {
						canSlideUp: this.canSlideUp,
						optDown: this.mescroll.optDown,
						bodyHeight: this.mescroll.getBodyHeight(),
						t: Date.now()
					}
				} else if (msg.type === 'touchend') {
					this.nextHandle()
				}
			},
			prevHandle() {

				const subIdx = this.subCategoryIdx
				/* 不是第一个子类 */
				if (subIdx > 0) {
					const subPrev = this.subCategorys[subIdx - 1]
					return this.subCategoryClick(subPrev)
				}

				const idx = this.categoryIdx
				/* 是第一个子类,不是第一个大类 */
				if (idx > 0) {
					const prev = this.goodsCategoryTree[idx - 1]
					return this.subCategoryClick(prev.children[prev.children.length - 1])
				}
				/* 第一个大类，第一个子类 */
				return Promise.resolve()
			},
			nextHandle() {

				const lastSubIdx = this.subCategorys.length - 1
				const subIdx = this.subCategoryIdx

				/* 不是最后一个子类 */
				if (subIdx < lastSubIdx) {
					const next = this.subCategorys[subIdx + 1]
					return this.subCategoryClick(next)
				}

				const lastIdx = this.goodsCategoryTree.length - 1
				const idx = this.categoryIdx
				/* 最后一个子类,不是最后一个大类 */
				if (idx < lastIdx) {
					const next = this.goodsCategoryTree[idx + 1]
					return this.subCategoryClick(next.children[0])
				}

				/* 最后一个子类, 最后一个大类 */
				return Promise.resolve()
			},
			downCallback() {
				return this.prevHandle().finally(() => {
					this.mescroll.endSuccess()
				})
			},
			upCallback() {
				if (this.locked) {
					this.locked = false
					return this.mescroll.endSuccess(this.goodsList.length, this.form.pageNumber < this.pager)
				}
				if (this.form.pageNumber < this.pager) {
					this.form.pageNumber++
					this.getGoodsList().finally(() => {
						this.mescroll.endSuccess(this.goodsList.length, this.form.pageNumber < this.pager)
					})
				} else {
					this.mescroll.endSuccess(this.goodsList.length, false)
				}
			},
			categoryClick(category, index = 0) {
				return this.subCategoryClick(category.children[index])
			},
			subCategoryClick(subCategory, reload = false) {
				if (this.currentSubCategory.id == subCategory.id && !reload) return
				this.currentSubCategory = subCategory
				this.locked = true
				return this.getGoodsList(true).then(() => uni.pageScrollTo({
					scrollTop: 0
				})).then(() => {
					this.mescroll.resetUpScroll(false)
				})
			},
			getGoodsList(reload) {
				if (reload) {
					this.pager = -1
					this.form.pageNumber = 1
				}
				return this.$apis.get_goods_list(this.postParams, {
					loading: false
				}).then(res => {
					if (reload) {
						this.goodsList = res.data.data
						this.pager = res.data.pages
					} else {
						this.goodsList.push(...res.data.data)
					}
					this.$nextTick(() => {
						this.queryContentHeight({
							scrollTop: 0
						})
					})
				})
			},
			getGoodsCategory() {
				return this.$apis.get_goodsCategory_tree().then(res => {
					const data = res.data
					data.forEach(it => {
						if (!it.children.length) it.children = [{
							...it,
							parentId: it.id,
						}]
					})
					this.goodsCategoryTree = Object.freeze(data)
					return data
				})
			}
		}
	}
</script>
<script src="./wxs/slideUp.wxs" module="wxsBiz" lang="wxs"></script>
<style>
	page {
		background: #fff;
		padding-bottom: calc(constant(safe-area-inset-bottom) + 49px);
		padding-bottom: calc(env(safe-area-inset-bottom) + 49px);
	}
</style>
<style lang="scss" scoped>
	#scroll-content {
		position: relative;
		will-change: transform;

		.mescroll-body {
			display: block;
			background-color: #fff;
		}


	}

	.category-scroll-view {
		position: fixed;
		left: 0;
		bottom: 49px;
		@include safe-padding-bottom;
		width: 152rpx;
		background: #f8f8f8;
		z-index: 2;

		.category-menus {
			overflow: hidden;
		}

		.category-menu-item {
			height: 104rpx;
			padding: 24rpx;
			font-size: 26rpx;
			color: #666666;

			display: flex;
			align-items: center;

			.category-name {
				@include textLineClamp(2);
			}

			&.is-active {
				background-color: white;
				color: #333333;
				position: relative;

				&::before,
				&::after {
					content: '';
					display: block;
					position: absolute;
					width: 56rpx;
					height: 56rpx;
					right: 0;
					border-radius: 100%;
					box-shadow: 0 0 0 56rpx white;
				}

				&::before {
					top: -56rpx;
					clip-path: inset(50% -10px 0 50%)
				}

				&::after {
					bottom: -56rpx;
					clip-path: inset(0 -10px 50% 50%);
				}
			}

		}
	}


	.condition-wrapper {
		background: #fff;
		position: fixed;
		z-index: 2;
		right: 0;
		left: 152rpx;
		padding: 24rpx;

		.subCategory-menus {
			height: 52rpx;
			white-space: nowrap;

			.subCategory-menus-item {
				vertical-align: top;
				display: inline-block;
				padding: 0 16rpx;
				height: 52rpx;
				line-height: 52rpx;
				border-radius: 26rpx;
				font-size: 24rpx;
				text-align: center;
				color: #666666;
				background-color: #f8f8f8;

				&+.subCategory-menus-item {
					margin-left: 18rpx;
				}

				&.is-active {
					color: $primary-color;
					background: #f4e6ff;
				}
			}
		}


	}



	.main-container {
		margin-left: 152rpx;
		padding-bottom: 1px;
		overflow: hidden;

		.list-item-wrapper {
			display: block;
			margin: 24rpx;
			background-color: #fff;
		}
	}
</style>