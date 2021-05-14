<template>
	<li class="list-group-item" @click="onClick">
		<emoji-dropdown 
			ref="picker" 
			:emoji="value.emoji"
			@shown="$emit('picker-shown', $event)"
			@hidden="$emit('picker-hidden', $event)"
			@select="_onEmojiSelect"
		/>
		<div v-show="!editing">{{ value.text }}</div>
		<input 
			ref="input"
			v-show="editing"
			:value="value.text" 
			@input="_onInput"
			@focus="onFocus"
			@blur="editing=false"
			@keydown="keyDown"
		>
	</li>
</template>

<script>
import EmojiDropdown from './EmojiDropdown.vue'

export default {
  components: { EmojiDropdown },
	comopnents: {
		EmojiDropdown
	},
	props: {
		value: {
			require: true,
		}
	},
	data() {
		return {
			editing: false,
		}
	},
	methods: {
		keyDown(event) {
			console.log(event)

			if (event.metaKey) {
				switch(event.code) {
					case 'KeyB':
						// bold
						this._toggleBold()
						break;
					case 'KeyU':
						// underline
						this._toggleUnderline()
						break;
				}
			}
			else {
				switch(event.code) {
					case 'Escape':
						this.$refs.input.blur();
						break;
				}
			}

			this.$emit('keydown', event)
		},
		_toggleBold() {
			let result = this.value.text.replace(/\*\*(.*)\*\*/g, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `**${this.value.text}**`
			}
		},
		_toggleUnderline() {
			let result = this.value.text.replace(/__(.*)__/g, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `__${this.value.text}__`
			}
		},
		onClick(event) {
			if (this.$refs.picker.$el.contains(event.target)) {
				event.stopPropagation()
				return
			}

			this.editing = true; 
			this.$nextTick(() => this.$refs.input.focus())
			this.$emit('click', event);
		},
		onFocus(event) {
			this.editing = true;
			setTimeout(() => event.target.select(), 50)
		},
		_onInput(event) {
			this.value.text = event.target.value
			this.$emit('input', this.value)
		},
		_onEmojiSelect(emoji) {
			this.value.emoji = emoji
			this.$emit('input', this.value)
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