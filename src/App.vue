<template>
	<div id="app">
		<h1>listcord 📝</h1>
		<span>Create and paste lists for Discord</span>

		<div class="mx-auto my-2 justify-content-center" style="max-width: 512px">
			<text-list 
				ref="list"
				v-model="message" 
				class="my-2"
			/>

			<!-- debug message list -->
			<!-- <textarea 
				:value="text" 
				disabled 
				class="my-3" 
				style="width: 100%; height: 150px;"
			/> -->

			<b-button 
				id="btn-copy"
				ref="copyBtn"
				variant="outline-primary"
				class="my-2"
				@click="_copyMessage"
			>
				Copy message
			</b-button>

			<b-tooltip
				target="btn-copy"
				:show.sync="showTooltip"
				title="Copied!"
				triggers
				@shown="_setTooltipTimeout"
			/>

			<!-- instructions -->
			<div id="instructions" class="my-2">
				<p><b>&#9650;</b>/<b>&#9660;</b> or <b>K</b>/<b>J</b> for navigation.</p>
				<p><b>Enter</b> to edit text or add a new line. <b>Esc</b> to stop editing.</p>
				<p><b><meta-key />B</b> to embolden line, <b><meta-key />U</b> to underline.</p>
				<p><b>E</b> to edit emoji. <b>Backspace</b> in empty search to remove.</p>
				<p><b>Backspace</b> on an empty line to remove. <b><meta-key />Backspace</b> to clear the list.</p>
				<p><b>Drag</b> to rearrange.</p>
				<p><b><meta-key />C</b> to copy message to clipboard.</p>
			</div>
		</div>

		<foot />

		<div id="theme-switch" class="text-secondary py-2 px-3">
			<b-icon icon="moon" class="mr-2" />
			<b-form-checkbox 
				v-model="lightTheme" 
				name="Theme switch" 
				style="display: inline-block;"
				switch 
			/>
			<b-icon icon="sun"/>
		</div>
	</div>
</template>

<script>
import Foot from "./components/Foot.vue"
import TextList from './components/TextList.vue'
import MetaKey from './components/MetaKey.vue'
import twemoji from 'twemoji'

export default {
	name: 'App',
	components: {
		Foot,
		TextList,
		MetaKey
	},
	data() {
		return {
			message: [
				{ text: "**__Check__**" },
				{ text: "out" },
				{ text: "this" },
				{ text: "list" }
			],
			showTooltip: false,
			lightTheme: localStorage.theme || true
		}
	},
	computed: {
		text() {
			return this.message
				.map(v => {
					let str = v.text
					if(v.emoji) str = `${v.emoji.native} ${str}`
					return str
				})
				.join('\n')
		},
		theme() {
			return this.lightTheme ? 'light' : 'dark';
		}
	},
	created() {
		if (localStorage.message) {
			this.message = JSON.parse(localStorage.message)
		}

		this.lightTheme = localStorage.theme === 'true' || !(window.matchMedia
			&& window.matchMedia('(prefers-color-scheme: dark)').matches)

		document.documentElement.dataset.theme = this.theme

		window.addEventListener('keydown', this._keyDown)
	},
	mounted() {
		twemoji.parse(document, { folder: "svg", ext: ".svg" })
	},	
	watch: {
		message(val) {
			if (val.length === 0) {
				this.message = [{ text: "" }]
				return;
			}
			localStorage.message = JSON.stringify(val)
		},
		theme(val) {
			document.documentElement.dataset.theme = val
		},
		lightTheme(val) {
			localStorage.theme = val
		}
	},
	methods: {
		_copyMessage() {
			navigator.clipboard.writeText(this.text)
			this.showTooltip = true
		},
		_setTooltipTimeout() {
			setTimeout(() => { this.showTooltip = false }, 1000)
		},
		_keyDown(event) {
			if(this.$refs.list.editing) return

			if(event.metaKey && event.code === 'KeyC') {
				this.$refs.copyBtn.click()
			}
		}
	}
}
</script>

<style>

html[data-theme='dark'] {
	--dark: #f8f9fa;
	--light: #343a40;
	--secondary: #888;
}

html, body {
	transition: background 0.2s;
	background: var(--light) !important;
	color: var(--dark) !important;
}

#app {
	text-align: center;
	margin-top: 60px;
	padding: 0px 12px
}

#instructions {
	color: var(--secondary);
	font-size: 10pt
}

#instructions p {
	margin-bottom: 0.2rem
}

#instructions b {
	color: var(--dark)
}

img.emoji {
	width: 1.1em;
	vertical-align: text-bottom;
}

#theme-switch {
	position: fixed;
	top: 0;
	right: 0;
}
</style>
