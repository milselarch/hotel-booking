import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import Home from '../../src/components/Home.vue'
import VuexAttach from '../../src/store/VuexAttach.js'

// import store from '../../src/store' 
// you could also mock this out.
import axios from 'axios'
import Vuex from 'vuex'
import sleep from 'await-sleep'
import stubs from './stubs.js'

const segfault_handler = require('segfault-handler');
const fs = require('fs');
const mock = require('./mock.js');

segfault_handler.registerHandler('crash.log');
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
  let wrapper;

  beforeEach(() => {
    axios.defaults.baseURL = "http://127.0.0.1:8000/"
    const attacher = new VuexAttach(localVue);
    store = attacher.create_store(mock.modules);
    store.commit('initialize_store');

    // render the component
    wrapper = mount(Home, {
      store, localVue,
      propsData: {
        msg: 'Welcome to Your Vue.js App'
      },
      //specify custom components
      stubs: stubs
    })
  })

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('check message when component is created', () => {
    // check the default msg of the component
    expect(wrapper.vm.msg).toMatch('Welcome to Your Vue.js App')
    // check that the title is rendered
    expect(wrapper.vm.$options.name).toMatch('Home')
  })

  it('check hotel search unresponsive text', async () => {
    // this test checks that we fail to load hotels
    // if the backend is down and we do a hotel search
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);

    // trick axios into thinking its running on the browser
    // otherwise all requests will report with NetworkError
    axios.defaults.adapter = require('axios/lib/adapters/http');
    axios.defaults.baseURL = "http://127.0.0.1:0/"

    // wait for desintations to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    expect(wrapper.vm.destinations_loaded).toBe(true)
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);

    // set the destination search inputs, the others are pre-filled
    wrapper.vm.destination_input = "Gap, France"
    expect(wrapper.vm.allow_search).toBe(true)
    const search_started = wrapper.vm.begin_search()
    expect(search_started).toBe(true)

    // wait for the backend request to complete
    while (wrapper.vm.is_loading) { await sleep(100); }
    expect(wrapper.vm.is_loading).toBe(false)
    // expect the backend load error flag to be true
    expect(wrapper.vm.load_error).toBe(true)
    expect(wrapper.vm.status_text).toBe(Home.LOAD_FAIL_MSG);
  })
})
