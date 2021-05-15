<template>
	<b-dropdown 
		variant="outline-secondary" 
		ref="dropdown"
		@shown="_onShown"
		@hidden="_onHidden"
	>
		<template #button-content>
			<b-icon icon="emoji-smile" v-if="!emoji" />
			<span v-if="emojiInternal"> {{ emojiInternal.native }} </span>
		</template>
		<emoji-picker 
			ref="picker"
			style="z-index: 100"
			:emoji="emojiInternal ? emojiInternal.id : undefined"
			:data="emojiIndex"
			:native="true" 
			:autoFocus="true" 
			@select="_onSelect" 
			@keydown="_keyDown"
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
	props: {
		emoji: null
	},
	data() {
		return {
			emojiInternal: null,
			emojiIndex: new EmojiIndex(data),
			shown: false
		}
	},
	watch: {
		emoji(val) { this.emojiInternal = val }
	},
	created() {
		this.emojiInternal = this.emoji
	},
	mounted() {
		this.$refs.searchInput = this.$refs.picker.$refs.search.$el.firstChild
		this.$refs.searchInput.addEventListener('keydown', this._keyDown)
	},
	methods: {
		_onSelect(emoji) {
			this.emojiInternal = emoji
			this.$refs.dropdown.hide(false)
			this.$emit('select', emoji)
		},
		_onShown(event) {
			this.$refs.searchInput.focus()
			this.$emit('shown', event)
			this.shown = true
		},
		_onHidden(event) {
			this.$emit('hidden', event)
			this.shown = false
		},
		_keyDown(event) {
			switch(event.code) {
				case 'Backspace':
					if (this.$refs.searchInput.value === '') {
						this._onSelect(null)
					}
					break;
			}
		}
	}
}
</script>