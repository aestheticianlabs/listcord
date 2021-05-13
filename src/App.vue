<template>
	<div id="app">
		<h1>listcord 📝</h1>
		<span>Create and paste lists for Discord</span>

		<text-list v-model="message" />

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
			message: "Check\nout\nthis\nlist!",
		}
	},
}
</script>

<style>
#app {
	text-align: center;
	margin-top: 60px;
}
</style>
