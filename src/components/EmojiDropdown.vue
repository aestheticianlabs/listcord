<template>
	<b-dropdown 
		variant="outline-secondary" 
		ref="dropdown"
		@shown="_onShown"
		@hidden="_onHidden"
	>
		<template #button-content>
			<b-icon icon="emoji-smile" v-if="!emoji" />
			<span v-if="emoji"> {{ emoji.native }} </span>
		</template>
		<emoji-picker 
			ref="picker"
			:data="emojiIndex"
			:native="true" 
			:autoFocus="true" 
			@select="_onSelect" 
		/>
	</b-dropdown>
</template>

<script>
// TODO: does storing the index here create a lot of data duplication?
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker as EmojiPicker, EmojiIndex } from 'emoji-mart-vue-fast'

export default {
	components: {
		EmojiPicker
	},
	data() {
		return {
			emoji: null,
			emojiIndex: new EmojiIndex(data),
			shown: false
		}
	},
	created() {
		window.addEventListener('keydown', this._onKeyDown)
	},
	methods: {
		_onSelect(emoji) {
			this.emoji = emoji
			this.$refs.dropdown.hide(false)
		},
		_onShown(event) {
			console.log("shown")
			this.$refs.picker.$refs.search.$el.firstChild.focus()
			this.$emit('shown', event)
			this.shown = true
		},
		_onHidden(event) {
			console.log("hidden")
			this.$emit('hidden', event)
			this.shown = false
		},
		_onKeyDown(event) {
			if(this.shown) {
				event.preventDefault()
				return false
			}
		}
	}
}
</script>