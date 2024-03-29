<template>
	<b-dropdown 
		variant="outline-secondary" 
		ref="dropdown"
		class="emoji-dropdown"
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
	computed: {
		emojiSVG() {
			return twemoji.parse(this.emojiInternal.native, { 
				base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
				folder: 'svg', ext: '.svg'
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
	watch: {
		emoji(val) { this.emojiInternal = val }
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
.dropdown-toggle img.emoji {
	width: 20px;
	height: 20px;
}

.emoji-dropdown .dropdown-menu {
	background-color: var(--light) !important;
	color: var(--dark) !important;
	padding: 0;
}

.emoji-mart {
	background: var(--light);
}

.emoji-mart button {
	color: var(--dark);
}

.emoji-mart button:hover {
	color: var(--secondary);
}

.emoji-mart-category-label {
	color: var(--dark);
	background: var(--light) !important;
}

.emoji-mart-search {
	margin-bottom: 6px;
}
html[data-theme="dark"] .emoji-mart-category .emoji-mart-emoji:hover:before,
html[data-theme="dark"] .emoji-mart-emoji-selected:before {
	background-color: var(--secondary)
}

html[data-theme="dark"] .emoji-mart-preview-name {
	color: var(--text);
}
</style>