<template>
	<ul class="list-group" v-sortable="{onUpdate: onListUpdate}">
		<list-item 
			class="list-group-item" 
			v-for="(text,i) in list" 
			:key="i" 
			:value="text"
			@input="onItemUpdate(i, $event)"
		/>
	</ul>
</template>

<script>
import ListItem from './ListItem.vue'
export default {
	components: { ListItem },
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
			this.notifyInput(list)
		},
		onItemUpdate(i, val) {
			var list = this.list
			list[i] = val
			this.notifyInput(list)
		},
		notifyInput(newList) {
			this.$emit('input', newList.join('\n'))
		}
	}
}
</script>
