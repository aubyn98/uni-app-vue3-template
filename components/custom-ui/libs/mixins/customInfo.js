function fails() {
	console.error('info call fails')
}
export default {
	data() {
		$info: null
	},
	mounted() {
		this.$info = this.$refs.info || {
			success: fails,
			error: fails,
			open: fails,
			close: fails,
		}
	}
}
