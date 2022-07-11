import { fa0 } from '@fortawesome/free-solid-svg-icons'
import Vue from 'vue'
// import Vuex from 'vuex'

// import { createSharedMutations } from 'vuex-electron'
import modules from './modules'
import VuexAttach from './VuexAttach.js'
// const VuexAttach = require('./VuexAttach');

console.log('MODULKES LOADED', modules)
const attacher = new VuexAttach(Vue);
const store = attacher.create_store(modules);

export default store