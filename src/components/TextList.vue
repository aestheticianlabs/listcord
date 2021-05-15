<template>
	<div>
		<ul class="list-group" v-sortable="{onUpdate: _onListUpdate}">
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
				@input="_onItemUpdate(i, $event)"
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
			keysEnabled: true,
		}
	},
	computed: {
		editing() {
			var component = this._getSelectedComponent()
			return component && component.editing
		}
	},
	created() {
		this._updateList(this.value)
		window.addEventListener('keydown', this._keyDown);
	},
	mounted() {
		this._setSelected(this.selected, false, true)
	},
	watch: {
		value(val) { this._updateList(val) }
	},
	methods: {
		_addItem(i) {
			var item = { text: "", uuid: uuidv4() }
			this.list.splice(i + 1, 0, item)
			this.$nextTick(() => { this.$refs[item.uuid][0].$el.click() })
		},
		_removeItem(i) {
			this.list.splice(i, 1)
			this._moveSelection(-1, false)
		},
		_keyDown(event) {
			if(!this.keysEnabled) return;

			var component = this._getSelectedComponent()

			switch(event.code) {
				case 'Enter': 
					if (component.editing) {
						this._addItem(this.selected)
					}
					break;
				case 'Backspace': 
					if(this.list[this.selected].text === '') 
						this._removeItem(this.selected)
					break;
				case 'KeyJ':
					if (!component.editing) {
						this._moveSelection(1)
					}
					break;
				case 'ArrowDown':
					this._moveSelection(1, true)
					break;
				case 'KeyK':
					if (!component.editing) {
						this._moveSelection(-1)
					}
					break;
				case 'ArrowUp':
					this._moveSelection(-1, true)
					break;
			}
		},
		_getComponent(i) {
			if (!this.list[i]) return null;
			return this.$refs[this.list[i].uuid][0]
		},
		_getSelectedComponent() {
			return this._getComponent(this.selected)
		},
		_moveSelection(amt, click = false) {
			var next = mod((this.selected + amt), this.list.length);
			this._setSelected(next, click)
		},
		_setSelected(i, click = false, focus = true) {
			if (i !== this.selected) {
				var selected = this._getSelectedComponent()
				if (selected) {
					selected.$el.blur()
				}
			}

			if (click) {
				this._getComponent(i).$el.click()
			}
			else if (focus) {
				this._getComponent(i).$el.focus()
			}

			this.selected = i;
		},
		_onListUpdate(event) {
			var list = this.list
			list.splice(event.newIndex, 0, list.splice(event.oldIndex, 1)[0])
			this.selected = event.newIndex
			this._notifyInput(list)
		},
		_onItemUpdate(i, val) {
			this.$set(this.list, i, val)
			this._notifyInput(this.list)
		},
		_notifyInput(newList) {
			this.$emit('input', newList)
		},
		_updateList(val) {
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

<style>
.list-group-item {
	background-color: var(--light) !important;
}

.btn-outline-secondary {
	color: var(--secondary);
	fill: var(--secondary);
}

.form-control {
	background-color: var(--light) !important;
	color: var(--dark) !important;
}

html[data-theme="dark"] .list-group-item,
html[data-theme="dark"] .btn,
html[data-theme="dark"] .form-control {
	background-color: var(--light) !important;
	border-color: var(--secondary) !important;
}

html[data-theme="dark"] .list-group-item-primary {
	border-color: var(--primary) !important;
	background-color: #555 !important;
}
</style>
