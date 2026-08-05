export function takeSnapshot(id, {
	type = 'file',
	format = 'png'
} = {}) {
	return new Promise((success, fail) => {
		uni.createSelectorQuery()
			.select(id)
			.node()
			.exec(res => {
				const node = res[0].node
				node.takeSnapshot({
					type,
					format,
					success,
					fail
				})
			})
	})
}