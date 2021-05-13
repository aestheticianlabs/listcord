<template>
	<div id="app">
		<h1>listcord 📝</h1>
		<span>Create and paste lists for Discord</span>

		<div class="mx-auto justify-content-center" style="max-width: 512px">
		<text-list v-model="message"/>

		<!-- debug message list -->
		<textarea :value="message" disabled class="my-3" style="width: 100%; height: 150px;"></textarea>
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
			message: "Check\nout\nthis\nlist!",
		}
	},
}
</script>

<style>
#app {
	text-align: center;
	margin-top: 60px;
	padding: 0px 12px
}
</style>
