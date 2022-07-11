import Vue from 'vue';
import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import Home from '../../src/components/Home.vue'
// import store from '../../src/store' // you could also mock this out.
import Vuex from 'vuex'
import Buefy from 'buefy'

const fs = require('fs');

// import axios from 'axios'

// jest.mock('axios');

// describe('Test for Home.vue successful http get', () => {
//     let wrapper = null
//     beforeEach(() => {
//         const responseGet = {data: {
//             destinationsLoaded: false,
//             destinationNames: [],
//             destinationMappings: {},
//         }}
//     })
// })

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
    store = new Vuex.Store({})
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
    expect(wrapper.vm.msg).stoMatch('Welcome to Your Vue.js App')

    // check that the title is rendered
    expect(wrapper.vm.$options.name).toMatch('Home')
  })
})
