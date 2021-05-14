<template>
	<li 
		:class="{
			'list-group-item': true,
			'z-3000': pickerOpen
		}" 
		@click="onClick"
	>
		<div class="input-group">
			<div class="input-group-prepend">
				<emoji-dropdown 
					ref="picker" 
					:emoji="value.emoji"
					@shown="_pickerShown"
					@hidden="_pickerHidden"
					@select="_onEmojiSelect"
				/>
			</div>
			<div class="form-control">
				<span 
					v-show="!editing" 
					v-html="formattedText"
				></span>
				<input 
					ref="input"
					:style="{
						'display': editing ? 'inline' : 'none'
					}"
					:value="value.text" 
					@input="_onInput"
					@focus="onFocus"
					@blur="editing=false"
					@keydown="keyDown"
				>
			</div>
		</div>
	</li>
</template>

<script>
import EmojiDropdown from './EmojiDropdown.vue'

const boldRegex = /\*\*(.*)\*\*/g
const underlineRegex = /__(.*)__/g

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
			pickerOpen: false
		}
	},
	computed: {
		formattedText() {
			return this.value.text
				.replace(boldRegex, "<b>$1</b>")
				.replace(underlineRegex, "<u>$1</u>")
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
			let result = this.value.text.replace(boldRegex, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `**${this.value.text}**`
			}
		},
		_toggleUnderline() {
			let result = this.value.text.replace(underlineRegex, "$1")
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
		},
		_pickerShown(event) {
			this.pickerOpen = true
			this.$emit('picker-shown', event)
		},
		_pickerHidden(event) {
			this.pickerOpen = false
			this.$emit('picker-hidden', event)
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

.z-3000 {
	z-index: 3000 !important;
}
</style>