<template>
	<span v-html="key"></span>
</template>

<script>
import Platform from '../platform'

export default {
	computed: {
		key() {
			return Platform.getModifierSymbol()
		}
	}
}
</script>