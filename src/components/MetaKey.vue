<template>
	<span v-html="key"></span>
</template>

<script>
export default {
	computed: {
		key() {
			return navigator.userAgent.match(/Macintosh/) ? "&#8984;" : "^"
		}
	}
}
</script>