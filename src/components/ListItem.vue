<template>
	<li 
		:class="{
			'list-group-item': true,
			'z-3000': pickerOpen
		}" 
		@click="_onClick"
		@focus="$emit('focus', $event)"
		@keydown="_keyDown"
		tabindex="0"
	>
		<div class="input-group">
			<div class="input-group-prepend">
				<emoji-dropdown 
					ref="picker" 
					:emoji="value.emoji"
					@focus="$emit('focus', $event)"
					@shown="_pickerShown"
					@hidden="_pickerHidden"
					@select="_onEmojiSelect"
				/>
			</div>
			<div class="form-control h-auto">
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
					@focus="_onFocus"
					@blur="editing=false"
				>
			</div>
		</div>
	</li>
</template>

<script>
import EmojiDropdown from './EmojiDropdown.vue'
import Platform from '../platform'

const emphasisRegex = /\*(.*)\*/g
const boldRegex = /\*\*(.*)\*\*/g
const underlineRegex = /__(.*)__/g
const strikethroughRegex = /~~(.*)~~/g

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
				.replace(boldRegex, "<b>$1</b>") // must process bold first b/c otherwise italics will take over
				.replace(emphasisRegex, "<em>$1</em>")
				.replace(underlineRegex, "<u>$1</u>")
				.replace(strikethroughRegex, "<s>$1</s>")
		}
	},
	methods: {
		_keyDown(event) {
			if(event.target === this.$refs.picker.$refs.searchInput) return;

			if (Platform.isMainModifierDown(event)) {
				switch(event.code) {
					case 'KeyI':
						// bold
						this._toggleEmphasis()
						break;
					case 'KeyB':
						// bold
						this._toggleBold()
						break;
					case 'KeyU':
						// underline
						this._toggleUnderline()
						break;
					case 'KeyS':
						// strikethrough (ctrl+shift+s)
						if (event.shiftKey) {
							this._toggleStrikethrough()
						}
				}
			}
			else if (!this.editing) {
				switch(event.code) {
					case 'Enter':
						event.stopPropagation()
						this.$el.click()
						return
					case 'KeyE':
						this.$refs.picker.$refs.dropdown.show()
						break;
				}
			}
			else {
				switch (event.code) {
					case 'Escape':
						this.$refs.input.blur()
						this.$el.focus()
						break;
				}
			}

			this.$emit('keydown', event)
		},
		_toggleEmphasis() {
			let result = this.value.text.replace(emphasisRegex, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `*${this.value.text}*`
			}
			this.$emit('input', this.value)
		},
		_toggleBold() {
			let result = this.value.text.replace(boldRegex, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `**${this.value.text}**`
			}
			this.$emit('input', this.value)
		},
		_toggleUnderline() {
			let result = this.value.text.replace(underlineRegex, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `__${this.value.text}__`
			}
			this.$emit('input', this.value)
		},
		_toggleStrikethrough() {
			let result = this.value.text.replace(strikethroughRegex, "$1")
			if (result !== this.value.text) {
				this.value.text = result
			} else {
				this.value.text = `~~${this.value.text}~~`
			}
			this.$emit('input', this.value)
		},
		_onClick(event) {
			if (this.$refs.picker.$el.contains(event.target)) {
				event.stopPropagation()
				return
			}

			this.editing = true; 
			this.$nextTick(() => this.$refs.input.focus())
			this.$emit('click', event);
		},
		_onFocus(event) {
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
			this.$nextTick(() => this.$el.focus())
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