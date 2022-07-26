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

const load_suggestions = (wrapper) => {
  // extract autocomplete suggestions from the
  // the autocomplete suggestions div
  const dropdown_menu = wrapper.find('div.dropdown-menu')
  console.log('DROPDOWN-MENU', dropdown_menu)
  const suggest_elems = $(dropdown_menu.element).find('span')
  console.log('SUGGEST-ELEMS', suggest_elems)
  const suggestions = [];

  // extract the autocomplete suggestion names
  // from the HTML element divs that they're housed in
  for (let k=0; k<suggest_elems.length; k++) {
    const suggest_elem = $(suggest_elems[k]);
    console.log('SINGLE-ELEM', suggest_elem)
    const suggestion = suggest_elem.text()
    console.log('SUGGEST', suggestion)
    suggestions.push(suggestion)
  }

  return suggestions;
}

describe('Home.vue Test', () => {
  let store;
  let wrapper;

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
    axios.defaults.baseURL = "http://127.0.0.1:0/"

    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    // before we ever start searching the load fail message 
    // shouldnt be there sicne we've never even searched before yet
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);

    // set the destination search inputs, the others are pre-filled
    wrapper.vm.destination_input = "Gap, France"
    // wait for vue to update state
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.allow_search).toBe(true)
    const search_started = wrapper.vm.begin_search()
    expect(search_started).toBe(true)

    // wait for the backend request to complete
    while (wrapper.vm.is_loading) { await sleep(100); }
    expect(wrapper.vm.is_loading).toBe(false)
    // expect the backend load error flag to be true
    expect(wrapper.vm.load_error).toBe(true)
    expect(wrapper.vm.status_text).toBe(Home.LOAD_FAIL_MSG);
    // we should still be allowed to search if previous search fails
    expect(wrapper.vm.allow_search).toBe(true)
  })

  // attempt a valid search now
  it('check valid hotel search status text', async () => {
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    // this test checks that we fail to load hotels
    // if the backend is down and we do a hotel search
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);

    const search_destination = "Gap, France"
    wrapper.vm.destination_input = search_destination
    // wait for vue to update state
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.allow_search).toBe(true)

    // attempt to search on the correct endpoint
    const search_started = wrapper.vm.begin_search()
    expect(search_started).toBe(true)
    // wait for the backend request to complete
    while (wrapper.vm.is_loading) { await sleep(100); }
    expect(wrapper.vm.is_loading).toBe(false)
    // expect the backend load error flag to be false
    expect(wrapper.vm.load_error).toBe(false)
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);
    // check that we disallow searching on the same params
    expect(wrapper.vm.allow_search).toBe(false)
    const status_text = wrapper.vm.status_text;
    expect(wrapper.vm.allow_search).toBe(false)
    expect(status_text).toBe(search_destination)

    await wrapper.vm.$nextTick()
    const cards = wrapper.find('.card')
    expect(cards.exists()).toBe(true)
    console.log("CARDS", cards, cards.length)
  })

  // check that autocomplete search results are sensible
  it('check autocomplete', async () => {
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    // this test checks that if we enter an exact destination
    // name into the autocomplete we will get the desination name
    // as the first result of our autocomplete.
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);
    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);

    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    const search_destination = "Gap, France"
    wrapper.vm.destination_input = search_destination
    await wrapper.vm.$nextTick()

    // make sure the the text input in the raw HTML element
    // of the autocomplete search bar is equal to the
    // destination_input vue data variable that we set
    // (confirms data binding of destination_input on searchbar)
    const autocomplete_bar = wrapper.find('#dest_search_field')
    console.log('AUTOCOMPLETE-BAR', autocomplete_bar)
    const autocomplete_elem = autocomplete_bar.element
    console.log('BAR-EL', autocomplete_bar.element)
    expect(autocomplete_elem._value).toBe(search_destination)

    const all_matches = fuzzysort.go(
      search_destination, destination_names
    )

    const suggestions = load_suggestions(wrapper)
    expect(suggestions.length).toBeLessThan(all_matches.length);
    expect(all_matches).toContain(suggestions);

    const start_time = (new Date()).getTime()
    const autocomplete_reuslts = wrapper.vm.filtered_search_matches;
    const end_time = (new Date()).getTime()
    const duration = end_time - start_time

    expect(autocomplete_reuslts[0]).toBe(search_destination);
  })

  // check that autocomplete search results are sensible
  it('check fuzz autocomplete', async () => {
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    // this test checks that if we enter the exact destination
    // name into the autocomplete we will get the desination name
    // as the first result of our autocomplete. We randomly try
    // different valid desinations names from our list of valid
    // destination names to make sure it works
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);
    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);

    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results

    for (let k=0; k<10; k++) {
      const search_destination = destination_names[
        Math.floor(Math.random() * destination_names.length)
      ];

      // const search_destination = "Gap, France"
      wrapper.vm.destination_input = search_destination
      await wrapper.vm.$nextTick()
      
      const start_time = (new Date()).getTime()
      const autocomplete_reuslts = wrapper.vm.filtered_search_matches;
      const end_time = (new Date()).getTime()
      const duration = end_time - start_time
      console.log('SEARCH TIME', k, search_destination, duration)

      expect(autocomplete_reuslts[0]).toBe(search_destination);
    }
  })
})
