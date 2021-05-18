export default {
	isMac() {
		return navigator.userAgent.match(/Macintosh/)
	},
	isMainModifierDown(event) {
		return this.isMac() ? event.metaKey : event.ctrlKey
	},
	getModifierSymbol() {
		return this.isMac() ? "&#8984;" : "^"
	}
}