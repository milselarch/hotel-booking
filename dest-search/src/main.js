import Vue from 'vue'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Buefy, { defaultIconPack: 'fas' })

new Vue({
  el: '#app',
  render: h => h(App)
})
