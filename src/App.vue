<template>
	<div id="app">
		<h1>listcord 📝</h1>
		<span>Create and paste lists for Discord</span>

		<div class="mx-auto justify-content-center" style="max-width: 512px">
			<text-list v-model="message"/>

			<!-- debug message list -->
			<textarea 
				:value="text" 
				disabled 
				class="my-3" 
				style="width: 100%; height: 150px;"
			/>

			<b-button 
				id="btn-copy"
				variant="outline-primary"
				@click="copyMessage"
			>
				Copy message
			</b-button>
			<b-tooltip
				target="btn-copy"
				:show.sync="showTooltip"
				title="Copied!"
				triggers
				@shown="setTooltipTimeout"
			/>
		</div>

		<foot />
	</div>
</template>

<script>
import Foot from "./components/Foot.vue"
import TextList from './components/TextList.vue'

export default {
	name: 'App',
	components: {
		Foot,
		TextList
	},
	data() {
		return {
			message: [
				{ text: "Check" },
				{ text: "out" },
				{ text: "this" },
				{ text: "list" }
			],
			showTooltip: false
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
		}
	},
	methods: {
		copyMessage() {
			navigator.clipboard.writeText(this.text)
			this.showTooltip = true
		},
		setTooltipTimeout() {
			setTimeout(() => { this.showTooltip = false }, 1000)
		}
	}
}
</script>

<style>
#app {
	text-align: center;
	margin-top: 60px;
	padding: 0px 12px
}
</style>
