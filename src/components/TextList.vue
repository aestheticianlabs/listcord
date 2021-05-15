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
				:value="v"
				@input="onItemUpdate(i, $event)"
				@focus="_setSelected(i, false, false)"
				@click="_setSelected(i, false, false)"
				@picker-shown="keysEnabled=false"
				@picker-hidden="_pickerHidden"
			/>
		</ul>
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
			selected: 0,
			keysEnabled: true
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
			this.moveSelection(-1, false)
		},
		keyDown(event) {
			if(!this.keysEnabled) return;

			var component = this._getSelectedComponent()

			switch(event.code) {
				case 'Enter': 
					if (component.editing) {
						this.addItem(this.selected)
					}
					break;
				case 'Backspace': 
					if(this.list[this.selected].text === '') 
						this.removeItem(this.selected)
					break;
				case 'KeyJ':
					if (!component.editing) {
						this.moveSelection(1)
					}
					break;
				case 'ArrowDown':
					this.moveSelection(1, true)
					break;
				case 'KeyK':
					if (!component.editing) {
						this.moveSelection(-1)
					}
					break;
				case 'ArrowUp':
					this.moveSelection(-1, true)
					break;
			}
		},
		_getComponent(i) {
			return this.$refs[this.list[i].uuid][0]
		},
		_getSelectedComponent() {
			return this._getComponent(this.selected)
		},
		moveSelection(amt, click = false) {
			var next = mod((this.selected + amt), this.list.length);
			this._setSelected(next, click)
		},
		_setSelected(i, click = false, focus = true) {
			this._getSelectedComponent().$el.blur()

			if (click) {
				this._getComponent(i).$el.click()
			}
			else if (focus) {
				this._getComponent(i).$el.focus()
			}

			this.selected = i;
		},
		onListUpdate(event) {
			var list = this.list
			list.splice(event.newIndex, 0, list.splice(event.oldIndex, 1)[0])
			this.selected = event.newIndex
			this.notifyInput(list)
		},
		onItemUpdate(i, val) {
			this.$set(this.list, i, val)
			this.notifyInput(this.list)
		},
		notifyInput(newList) {
			this.$emit('input', newList)
		},
		updateList(val) {
			let newList = val

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
		},
		_pickerHidden() {
			setTimeout(() => this.keysEnabled = true, 50)
		}
	}
}
</script>
