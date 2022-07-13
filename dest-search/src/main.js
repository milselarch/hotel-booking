import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";

import Vuex from 'vuex';
import store from './store';
import { sync } from 'vuex-router-sync';

import VueSpinners from 'vue-spinners'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from './router'

import axios from 'axios'

import VueCardFormat from 'vue-credit-card-validation';

const infiniteScroll =  require('vue-infinite-scroll');

axios.defaults.baseURL = "http://127.0.0.1:8000/"

Vue.use(Vuex)
// const store = new Vuex.Store(VuexStore);
// sync(store, router);

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Buefy, { defaultIconPack: 'fas' })

Vue.use(VueSpinners)


/*
Vue.use(Buefy, { 
  defaultIconPack: 'fas',
  defaultIconComponent: "vue-fontawesome",
  customIconPacks: {
    fas: {
      sizes: {
        default: "lg",
        "is-small": "1x",
        "is-medium": "2x",
        "is-large": "3x"
      },
      iconPrefix: ""
    }
  }
})
*/
Vue.use(infiniteScroll)
Vue.use(VueRouter);

//For credit card validation
Vue.use(VueCardFormat);

new Vue({
  el: '#app',
  router,
  store,
  beforeCreate() {
    this.$store.commit('initialize_store');
  },
  render: h => h(App)
})
