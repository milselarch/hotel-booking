import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8000/"

import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from './router'

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Buefy, { defaultIconPack: 'fas' })
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
