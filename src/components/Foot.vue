<template>
	<div id="footer">
		<span>Created with ❤️ by <a href="https://aesthetic.games" target="_blank">Aesthetician Labs</a></span>
	</div>
</template>

<script>
import twemoji from 'twemoji'

export default {
	mounted() {
		twemoji.parse(this.$el, { folder: "svg", ext: ".svg" })
	}	
}
</script>

<style>
#footer {
	font-size: 10pt;
	position: fixed;
	bottom: 0;
	width: 100%;
	padding: 3px 5px;
}

#footer img.emoji {
	width: 1rem;
	height: 1rem;
}
</style>