<template>
	<ul class="list-group" v-sortable="{onUpdate: onListUpdate}">
		<li class="list-group-item" v-for="text in list" :key="text">{{ text }}</li>
	</ul>
</template>

<script>
export default {
	props: {
		value: {
			require: true
		}
	},
	computed: {
		list: {
			get() { return this.value.split('\n') },
		} 
	},
	methods: {
		onListUpdate(event) {
			var list = this.list
			list.splice(event.newIndex, 0, list.splice(event.oldIndex, 1)[0])
			this.$emit('input', list.join('\n'))
		}
	}
}
</script>
