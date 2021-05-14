<template>
	<div>
		<ul class="list-group" v-sortable="{onUpdate: onListUpdate}">
			<list-item 
				:class="{
					'list-group-item': true, 
					'list-group-item-action': true,
					'list-group-item-primary': selected === i
				}" 
				v-for="(v,i) in list" 
				:ref="v.uuid"
				:key="v.uuid" 
				:value="v.text"
				@input="onItemUpdate(i, $event)"
				@click="selected=i"
			/>
		</ul>

		<b-button variant="primary" @click="addItem" >
			<b-icon icon="plus" />
		</b-button>
	</div>
</template>

<script>
import ListItem from './ListItem.vue'
import { v4 as uuidv4 } from 'uuid'

function mod(n, m) {
	return ((n % m) + m) % m;
}

export default {
	components: { ListItem },
	props: {
		value: {
			require: true
		}
	},
	data() {
		return {
			list: [],
			selected: 0
		}
	},
	created() {
		this.updateList(this.value)
		window.addEventListener('keydown', this.keyDown);
	},
	watch: {
		value(val) { this.updateList(val) }
	},
	methods: {
		addItem(i) {
			var item = { text: "", uuid: uuidv4() }
			this.list.splice(i + 1, 0, item)
			this.$nextTick(() => { this.$refs[item.uuid][0].$el.click() })
		},
		removeItem(i) {
			this.list.splice(i, 1)
		},
		keyDown(event) {
			console.log(event.code)
			switch(event.code) {
				case 'Enter': 
					this.addItem(this.selected)
					break;
				case 'Backspace': 
					if(this.list[this.selected].text === '') 
						this.removeItem(this.selected)
					break;
				case 'ArrowDown':
					this.moveSelection(1)
					break;
				case 'ArrowUp':
					this.moveSelection(-1)
					break;
			}
		},
		moveSelection(amt) {
			var next = mod((this.selected + amt), this.list.length);
			this.$refs[this.list[this.selected].uuid][0].$el.blur()
			this.$refs[this.list[next].uuid][0].$el.click()
			this.selected = next;
		},
		onListUpdate(event) {
			var list = this.list
			list.splice(event.newIndex, 0, list.splice(event.oldIndex, 1)[0])
			this.selected = event.newIndex
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
