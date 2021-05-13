<template>
	<li class="list-group-item" @click="editing = true; $nextTick(() => $refs.input.focus())">
		<div v-show="!editing">{{ value }}</div>
		<input 
			ref="input"
			v-show="editing"
			:value="value" 
			@input="$emit('input', $event.target.value)"
			@focus="editing=true"
			@blur="editing=false"
		>
	</li>
</template>

<script>
export default {
	props: {
		value: {
			require: true,
		}
	},
	data() {
		return {
			editing: false
		}
	}
}
</script>

<style scoped>
li {
	text-align: left !important;
}

input {
	width: 100%;
	padding: 0;
	border: none;
}
</style>