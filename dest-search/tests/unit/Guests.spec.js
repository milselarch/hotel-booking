import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import Home from '../../src/components/Home.vue'
import VuexAttach from '../../src/store/VuexAttach.js'

// import store from '../../src/store' 
// you could also mock this out.
import axios from 'axios'
import Vuex from 'vuex'
import sleep from 'await-sleep'
import stubs from './stubs.js'
import small_stubs from './small_stubs.js'
import fuzzysort from 'fuzzysort'

import Buefy from 'buefy'
import { start } from 'repl'
import { raw } from 'file-loader'
import $ from 'jquery'
import exp from 'constants'
import { wrap } from 'module'
import { off } from 'process'

// string fuzzing generator
const fuzzer = require('fuzzer');
// random number generator
const rand = require('random-seed').create();
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

localVue.config.silent = true;
localVue.use(infiniteScroll)
localVue.use(Buefy)
localVue.use(Vuex);

describe('Home.vue guests per room input Test', () => {
  // unit tests for the guests per room input field in home.vue
  // and the validation methods we've written for it
  let saved_wrapper, wrapper, store;

  beforeEach(() => {
    // trick axios into thinking its running on the browser
    // otherwise all requests will report with NetworkError
    axios.defaults.adapter = require('axios/lib/adapters/http');
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
      stubs: small_stubs
    })
  })

  afterEach(() => {
    if (wrapper !== saved_wrapper) {
      wrapper.destroy();
      wrapper = null;
    }
  });

  it('check guests per room', async () => {
    // check that if we enter a valid number of guests
    // into the guests input, and all the other fields are set
    // that we will be allowed to press the search button
    // wait for destinations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    // select randomly from the list of valid destinations
    const search_destination = destination_names[
      Math.floor(Math.random() * destination_names.length)
    ];

    const search_button = wrapper.find('#search-button');
    expect(search_button.exists()).toBe(true);
    // make sure we aren't allowed to press the search button at first
    expect(search_button.attributes().disabled).toBe('disabled');
    wrapper.vm.destination_input = search_destination

    const guests_input = wrapper.find('#guests-input')
    const guests_input_elem = guests_input.element
    const max_num_guests = wrapper.vm.max_num_guests
    expect(max_num_guests).toBeGreaterThan(1)

    for (let k=1; k<=max_num_guests; k++) {
      // https://stackoverflow.com/questions/58009868/
      guests_input_elem.value = k
      guests_input.trigger('input')
      // wait for vue internal state to update
      await wrapper.vm.$nextTick()
      const num_guests = wrapper.vm.num_guests
      // verify data binding of vue data variable
      expect(num_guests).toBe(k)
      // make sure we're allowed to search
      expect(wrapper.vm.allow_search).toBe(true)
      expect(search_button.attributes().disabled).toBe(undefined);
    }
  })

  it('check negative guests per room', async () => {
    // check that if we enter a negative number of guests
    // into the guests input, and all the other fields are set
    // that we will not be allowed to press the search button
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    // select randomly from the list of valid destinations
    const search_destination = destination_names[
      Math.floor(Math.random() * destination_names.length)
    ];

    const search_button = wrapper.find('#search-button');
    expect(search_button.exists()).toBe(true);
    // make sure we aren't allowed to press the search button at first
    expect(search_button.attributes().disabled).toBe('disabled');
    wrapper.vm.destination_input = search_destination

    const guests_input = wrapper.find('#guests-input')
    const guests_input_elem = guests_input.element

    for (let k=-100; k<=0; k++) {
      // https://stackoverflow.com/questions/58009868/
      guests_input_elem.value = k
      guests_input.trigger('input')
      // wait for vue internal state to update
      await wrapper.vm.$nextTick()
      const num_guests = wrapper.vm.num_guests
      // verify data binding of vue data variable
      expect(num_guests).toBe(k)
      // make sure we're allowed to search
      expect(wrapper.vm.allow_search).toBe(false)
      expect(search_button.attributes().disabled).toBe('disabled');
    }
  })

  it('fuzz negative guests per room', async () => {
    // check that if we enter a negative (or zero) number of guests
    // into the guests input, and all the other fields are set
    // that we will not be allowed to press the search button
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    // select randomly from the list of valid destinations
    const search_destination = destination_names[
      Math.floor(Math.random() * destination_names.length)
    ];

    const search_button = wrapper.find('#search-button');
    expect(search_button.exists()).toBe(true);
    // make sure we aren't allowed to press the search button at first
    expect(search_button.attributes().disabled).toBe('disabled');
    wrapper.vm.destination_input = search_destination

    const guests_input = wrapper.find('#guests-input')
    const guests_input_elem = guests_input.element

    for (let k=0; k<1000; k++) {
      const negative_number = Math.floor(
        Math.random() * Number.MIN_SAFE_INTEGER
      )
      
      expect(negative_number).toBeLessThanOrEqual(0)
      guests_input_elem.value = negative_number
      guests_input.trigger('input')
      // wait for vue internal state to update
      await wrapper.vm.$nextTick()
      const num_guests = wrapper.vm.num_guests
      // verify data binding of vue data variable
      expect(num_guests).toBe(negative_number)
      // make sure we're allowed to search
      expect(wrapper.vm.allow_search).toBe(false)
      expect(search_button.attributes().disabled).toBe('disabled');
    }
  })

  it('fuzz floating point guests per room', async () => {
    // check that if we enter a floating point number of guests
    // that is within the min and max number of allowed guests
    // into the guests input, and all the other fields are set
    // that we will not be allowed to press the search button
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    // select randomly from the list of valid destinations
    const search_destination = destination_names[
      Math.floor(Math.random() * destination_names.length)
    ];

    const search_button = wrapper.find('#search-button');
    expect(search_button.exists()).toBe(true);
    // make sure we aren't allowed to press the search button at first
    expect(search_button.attributes().disabled).toBe('disabled');
    wrapper.vm.destination_input = search_destination

    const guests_input = wrapper.find('#guests-input')
    const guests_input_elem = guests_input.element
    const max_guests = wrapper.vm.max_num_guests
    const min_guests = 1

    for (let k=0; k<1000; k++) {
      const guests = min_guests + (
        Math.random() * (max_guests - min_guests)
      )
      
      expect(guests).toBeGreaterThan(0)
      if (Number.isInteger(guests)) { continue }
      guests_input_elem.value = guests
      guests_input.trigger('input')
      // wait for vue internal state to update
      await wrapper.vm.$nextTick()
      const num_guests = wrapper.vm.num_guests
      // verify data binding of vue data variable
      expect(num_guests).toBe(guests)
      // make sure we're allowed to search
      expect(wrapper.vm.allow_search).toBe(false)
      expect(search_button.attributes().disabled).toBe('disabled');
    }
  })

  it('check excessive guests per room', async () => {
    // check that if we enter a number of guests
    // that is above the maximum number of quests allowed
    // into the guests input, and all the other fields are set
    // that we will not be allowed to press the search button
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    // select randomly from the list of valid destinations
    const search_destination = destination_names[
      Math.floor(Math.random() * destination_names.length)
    ];

    const search_button = wrapper.find('#search-button');
    expect(search_button.exists()).toBe(true);
    // make sure we aren't allowed to press the search button at first
    expect(search_button.attributes().disabled).toBe('disabled');
    wrapper.vm.destination_input = search_destination

    const guests_input = wrapper.find('#guests-input')
    const guests_input_elem = guests_input.element
    const max_guests = wrapper.vm.max_num_guests

    for (let k=1; k<1000; k++) {
      const guests = max_guests + k
      
      expect(guests).toBeGreaterThan(max_guests)
      guests_input_elem.value = guests
      guests_input.trigger('input')
      // wait for vue internal state to update
      await wrapper.vm.$nextTick()
      const num_guests = wrapper.vm.num_guests
      // verify data binding of vue data variable
      expect(num_guests).toBe(guests)
      // make sure we're allowed to search
      expect(wrapper.vm.allow_search).toBe(false)
      expect(search_button.attributes().disabled).toBe('disabled');
    }
  })

  it('fuzz excessive guests per room', async () => {
    // check that if we enter a random number of guests
    // that is above the maximum number of quests allowed
    // into the guests input, and all the other fields are set
    // that we will not be allowed to press the search button
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    // select randomly from the list of valid destinations
    const search_destination = destination_names[
      Math.floor(Math.random() * destination_names.length)
    ];

    const search_button = wrapper.find('#search-button');
    expect(search_button.exists()).toBe(true);
    // make sure we aren't allowed to press the search button at first
    expect(search_button.attributes().disabled).toBe('disabled');
    wrapper.vm.destination_input = search_destination

    const guests_input = wrapper.find('#guests-input')
    const guests_input_elem = guests_input.element
    const max_guests = wrapper.vm.max_num_guests

    for (let k=0; k<1000; k++) {
      const guests = 1 + max_guests + Math.floor(
        Math.random() * 10000
      )
      
      expect(guests).toBeGreaterThan(max_guests)
      guests_input_elem.value = guests
      guests_input.trigger('input')
      // wait for vue internal state to update
      await wrapper.vm.$nextTick()
      const num_guests = wrapper.vm.num_guests
      // verify data binding of vue data variable
      expect(num_guests).toBe(guests)
      // make sure we're allowed to search
      expect(wrapper.vm.allow_search).toBe(false)
      expect(search_button.attributes().disabled).toBe('disabled');
    }
  })
})
