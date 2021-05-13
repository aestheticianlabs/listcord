import Vue from 'vue'
import Sortable from 'sortablejs'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.directive('sortable', {
	inserted: function (el, binding) {
		new Sortable(el, binding.value || {})
	}
})
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
}).$mount('#app')