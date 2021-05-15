<template>
	<b-dropdown 
		variant="outline-secondary" 
		ref="dropdown"
		@shown="_onShown"
		@hidden="_onHidden"
	>
		<template #button-content>
			<b-icon
				v-if="!emoji"
				icon="emoji-smile"
			/>
			<!-- <emoji 
				v-if="emojiInternal"
				:data="index"
				:emoji="emojiInternal.id"
				:size="20"
				:sheetSize="20"
				class="p-0 align-text-bottom"
				set="twitter"
			/> -->
			<span
				v-if="emojiInternal"
				v-html="emojiSVG"
			></span>
		</template>
		<emoji-picker 
			ref="picker"
			style="z-index: 100"
			set="twitter"
			:emoji="emojiInternal ? emojiInternal.id : undefined"
			:data="index"
			:autoFocus="true" 
			@select="_onSelect" 
			@keydown="_keyDown"
		/>
	</b-dropdown>
</template>

<script>
// TODO: does storing the index here create a lot of data duplication?
import data from 'emoji-mart-vue-fast/data/twitter.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker as EmojiPicker, EmojiIndex } from 'emoji-mart-vue-fast'
import twemoji from 'twemoji'

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
			index: new EmojiIndex(data),
			shown: false
		}
	},
	watch: {
		emoji(val) { this.emojiInternal = val }
	},
	computed: {
		emojiSVG() {
			return twemoji.parse(this.emojiInternal.native, {
				folder: 'svg',
				ext: '.svg',
			})
		}
	},
	created() {
		this.emojiInternal = this.emoji
	},
	mounted() {
		this.$refs.searchInput = this.$refs.picker.$refs.search.$el.firstChild
		this.$refs.searchInput.addEventListener('keydown', this._keyDown)
		this.$refs.dropdown.$refs.toggle.addEventListener(
			'focus', (e) => this.$emit('focus', e)
		)
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

<style>
img.emoji {
	width: 20px;
	height: 20px;
	vertical-align: text-bottom;
}
</style>