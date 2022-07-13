import Vue from 'vue';
import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import Home from '../../src/components/Home.vue'
import VuexAttach from '../../src/store/VuexAttach.js'

// import store from '../../src/store' 
// you could also mock this out.
import axios from 'axios'
import Vuex from 'vuex'
import Buefy from 'buefy'

const fs = require('fs');
const mock = require('./mock.js');

// console.error("DIRNAME", __dirname);
console.log("DIR PARSE DONE", __dirname);

const test_folder = 'src/store/modules';
fs.readdirSync(test_folder).forEach(file => {
  console.log(file);
});

const infiniteScroll =  require('vue-infinite-scroll');
const localVue = createLocalVue();
localVue.use(infiniteScroll)
localVue.use(Vuex);

describe('Home.vue Test', () => {
  let store;

  beforeEach(() => {
    axios.defaults.baseURL = "http://127.0.0.1:8000/"
    const attacher = new VuexAttach(localVue);
    store = attacher.create_store(mock.modules);
    store.commit('initialize_store');
  })

  it('check message when component is created', () => {
    // render the component
    const wrapper = mount(Home, {
      store, localVue,
      propsData: {
        msg: 'Welcome to Your Vue.js App'
      },
      //specify custom components
      stubs: { 
        transition: false,
        'b-button': true,
        'b-modal': true,
        'b-field': true,
        'b-autocomplete': true,
        'square': true,
        'b-input': true,
        'b-select': true,
        'b-datepicker': true,
      }
    })

    // check the msg of the component
    expect(wrapper.vm.msg).toMatch('Welcome to Your Vue.js App')
    // check that the title is rendered
    expect(wrapper.vm.$options.name).toMatch('Home')
  })

  it('check hotel search unresponsive text', () => {
    // render the component
    const wrapper = mount(Home, {
      store, localVue,
      propsData: {
        msg: 'Welcome to Your Vue.js App'
      },
      //specify custom components
      stubs: { 
        transition: false,
        'b-button': true,
        'b-modal': true,
        'b-field': true,
        'b-autocomplete': true,
        'square': true,
        'b-input': true,
        'b-select': true,
        'b-datepicker': true,
      }
    })
  
    axios.defaults.baseURL = "http://127.0.0.1:0/"
    // set the destination search inputs, the others are pre-filled
    wrapper.vm.destination = "Santander, Spain (SDR)"
    const hotel_loader = wrapper.vm.load

    // check the msg of the component
    expect(wrapper.vm.msg).toMatch('Welcome to Your Vue.js App')
    // check that the title is rendered
    expect(wrapper.vm.$options.name).toMatch('Home')
  })
})
