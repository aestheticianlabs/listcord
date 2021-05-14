<template>
	<li class="list-group-item" @click="onClick">
		<emoji-dropdown 
			ref="picker" 
			@shown="$emit('picker-shown', $event)"
			@hidden="$emit('picker-hidden', $event)"
		/>
		<div v-show="!editing">{{ value }}</div>
		<input 
			ref="input"
			v-show="editing"
			:value="value" 
			@input="$emit('input', $event.target.value)"
			@focus="onFocus"
			@blur="editing=false"
			@keydown="keyDown"
		>
	</li>
</template>

<script>
import EmojiDropdown from './EmojiDropdown.vue'

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
		}
	},
	methods: {
		keyDown(event) {
			switch(event.code) {
				case 'Escape':
					this.$refs.input.blur();
					break;
			}

			this.$emit('keydown', event)
		},
		onClick(event) {
			if (this.$refs.picker.$el.contains(event.target)) {
				event.stopPropagation()
				return
			}

			this.editing = true; 
			this.$nextTick(() => this.$refs.input.focus())
			this.$emit('click', event);
		},
		onFocus(event) {
			this.editing = true;
			setTimeout(() => event.target.select(), 50)
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
</style>