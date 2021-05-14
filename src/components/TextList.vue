<template>
	<ul class="list-group" v-sortable="{onUpdate: onListUpdate}">
		<list-item 
			class="list-group-item" 
			v-for="(v,i) in list" 
			:key="v.uuid" 
			:value="v.text"
			@input="onItemUpdate(i, $event)"
		/>
	</ul>
</template>

<script>
import ListItem from './ListItem.vue'
import { v4 as uuidv4 } from 'uuid'

export default {
	components: { ListItem },
	props: {
		value: {
			require: true
		}
	},
	data() {
		return {
			list: []
		}
	},
	created() {
		this.updateList(this.value)
	},
	watch: {
		value(val) { this.updateList(val) }
	},
	methods: {
		onListUpdate(event) {
			var list = this.list
			list.splice(event.newIndex, 0, list.splice(event.oldIndex, 1)[0])
			this.notifyInput(list)
		},
		onItemUpdate(i, val) {
			var list = this.list
			list[i].text = val
			this.notifyInput(list)
		},
		notifyInput(newList) {
			this.$emit('input', newList.map(v => v.text).join('\n'))
		},
		updateList(val) {
			var newList = val.split('\n')
				.map(t => ({ text: t }))

			for (var i = 0; i < newList.length; i++) {
				// keep uuids for unchanged list items
				if (i < this.list.length 
					&& newList[i].text === this.list[i].text
				) {
					newList[i].uuid = this.list[i].uuid
				}
				else {
					newList[i].uuid = uuidv4()
				}
			}
			
			this.list = newList
		}
	}
}
</script>
