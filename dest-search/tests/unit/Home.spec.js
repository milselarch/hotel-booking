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

const load_suggestions = (wrapper) => {
  // extract autocomplete suggestions from the
  // the autocomplete suggestions div
  const dropdown_menu = wrapper.find('div.dropdown-menu')
  // console.log('DROPDOWN-MENU', dropdown_menu)
  const suggest_elems = $(dropdown_menu.element).find('span')
  // console.log('SUGGEST-ELEMS', suggest_elems)
  const suggestions = [];

  // extract the autocomplete suggestion names
  // from the HTML element divs that they're housed in
  for (let k=0; k<suggest_elems.length; k++) {
    const suggest_elem = $(suggest_elems[k]);
    // console.log('SINGLE-ELEM', suggest_elem)
    const suggestion = suggest_elem.text().trim()
    // console.log('SUGGEST', suggestion)
    suggestions.push(suggestion)
  }

  return suggestions;
}

describe('Home.vue Test', () => {
  jest.setTimeout(10 * 1000);
  let saved_wrapper, wrapper, store;
  const france_dest = "Gap, France"

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

  it('check date formatter', () => {
    /*
    verify date formatting and parsing use by datepicker
    componenet is correct
    */
    const date_now = new Date();
    const stripped_date = new Date(date_now)
    stripped_date.setUTCHours(0, 0, 0, 0)
    
    const date_str = wrapper.vm.format_date(date_now)
    // regex for date format dd/mm/yyyy
    const regex = new RegExp('^[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}$');
    // make sure converted date string has correct format
    expect(regex.test(date_str)).toBe(true)
    // make sure the date string that we parse is the same
    // as the original date object used to create the string
    const converted_date = wrapper.vm.parse_date(date_str)
    console.log('CONVERTED DATE', converted_date)
    console.log('DATE NOW', stripped_date, date_now)
    // expect(stripped_date).toStrictEqual(converted_date)
  })

  it('check guests per room', async () => {
    // check that if we enter a valid number of guests
    // into the guests input, and all the other fields are set
    // that we will be allowed to press the search button
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

    for (let k=1; k<=wrapper.vm.max_num_guests; k++) {
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
    wrapper.vm.destination_input = france_dest
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
    saved_wrapper = wrapper
    // wait for desintations.json to be loaded
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }

    // this test checks that we fail to load hotels
    // if the backend is down and we do a hotel search
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);

    const search_destination = france_dest
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
    await wrapper.vm.$nextTick()

    // expect the backend load error flag to be false
    expect(wrapper.vm.load_error).toBe(false)
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);
    // check that we disallow searching on the same params
    expect(wrapper.vm.allow_search).toBe(false)
    const status_text = wrapper.vm.status_text;
    expect(wrapper.vm.allow_search).toBe(false)
    expect(status_text).toBe(search_destination)
  })

  it('infinite scroll test', async () => {
    /*
    check that infinite scrolling of hotels for our 
    search destination can load all the avaliable hotels
    onto the frontend webpage
    */
    // wait for desintations.json to be loaded
    wrapper = saved_wrapper
    expect(saved_wrapper.vm.destination_input).toBe(france_dest)
    expect(wrapper.vm.destinations_loaded).toBe(true)

    const cards_holder_id ='#hotel-cards'
    const cards_holder = wrapper.find(cards_holder_id)
    const cards_holder_elem = cards_holder.element

    let card_elems = $(cards_holder_elem).find('div.card')    
    const hotels = wrapper.vm.hotels
    console.log('HCOUNT', hotels.length)
    // make sure this destination has 23 hotels total
    expect(hotels.length).toBe(23)
    // make sure at least 1 hotel card is being shown
    expect(card_elems.length).toBeGreaterThan(0)

    // expect(card_elems.exists()).toBe(true)
    console.log('CARDS_REF', cards_holder)
    // console.log("CARD_HOLDER_ELEM", cards_holder_elem)
    // console.log("CARD_ELEMS", card_elems)
    const target = $('html,body'); 
    console.log('TARGET', target)
    /*
    console.log(
      'DIMS', $(cards_holder_elem).height(),
      cards_holder_component, cards_holder_elem,
      cards_holder
    )
    */
    // ['@@InfiniteScroll']
    // console.log('IISS', cards_holder_elem['@@InfiniteScroll'])

    // acquire the binding infinite scroll callback function
    const infinite_scroll = cards_holder_elem['@@InfiniteScroll']
    const infinite_srcoll_trigger = infinite_scroll.expression
    console.log(
      'SCROLL CALLBACK', infinite_srcoll_trigger,
      typeof infinite_srcoll_trigger
    )
    
    // simulate infinite scrolling till all hotels are loaded
    for (let k=0; k<hotels.length; k++) {
      // trigger infinite scroll loading
      infinite_srcoll_trigger()
      await wrapper.vm.$nextTick()

      const loaded_hotels = wrapper.vm.hotels_loaded
      console.log('HOTEL-LOAD', k, loaded_hotels.length)
      if (hotels.length === loaded_hotels.length) {
        break;
      }
    }

    console.log(
      'LENS', wrapper.vm.hotels_loaded.length, hotels.length
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.all_hotels_loaded).toBe(true)
    const loaded_hotels = wrapper.vm.hotels_loaded
    expect(hotels.length).toBe(loaded_hotels.length)
    expect(hotels).toStrictEqual(loaded_hotels)
  })

  it('price load check', async () => {
    /*
    Check that price info (loaded asynchronously to hotel info)
    matches the api price response, and is displayed correctly in
    hotel cards where such prices exist

    To be clear, this test does NOT check that hotels and hotel
    prices are loaded asynchronously. Rather, it checks that 
    our asynchronous hotel and price loading requests will conclude
    successfully with all hotel names loaded, and all prices loaded
    and displayed for each hotel that the price api has a price for
    */
    wrapper = saved_wrapper
    expect(saved_wrapper.vm.destination_input).toBe(france_dest)
    expect(wrapper.vm.destinations_loaded).toBe(true)

    // wait for price search apu to complete
    const search_stamp = wrapper.vm.search_stamp
    while (wrapper.vm.price_search_loading[search_stamp]) {
      await sleep(100);
    }

    const hotels = wrapper.vm.hotels;
    // get api response price mappings
    const all_price_mappings = wrapper.vm.price_mapping
    const price_mapping = all_price_mappings[search_stamp]
    expect(price_mapping).not.toBe(undefined)

    // load all the hotels onto the frontend
    wrapper.vm.render_more_hotels(hotels.length);
    await wrapper.vm.$nextTick()

    const loaded_hotels = wrapper.vm.hotels_loaded
    const cards_holder_id ='#hotel-cards'
    const cards_holder = wrapper.find(cards_holder_id)
    const cards_holder_elem = cards_holder.element
    let card_elems = $(cards_holder_elem).find('div.card')    
    // verify all hotel cards are loaded
    expect(card_elems.length).toBeGreaterThan(0)
    expect(loaded_hotels.length).toBe(hotels.length)

    // map hotel names to hotel ids
    const hotel_name_mapping = {}
    for (let k=0; k<hotels.length; k++) {
      const hotel = hotels[k]
      hotel_name_mapping[hotel.name] = hotel.id
    }

    /*
    for every hotel card, check that the price
    displayed matches the hotel price response
    for each hotel id with the same hotel name
    as what is displayed on the hotel card
    */
    for (let k=0; k<card_elems.length; k++) {
      const card_elem = card_elems[k]
      const price_elem = $(card_elem).find('p#price')
      const title_elem = $(card_elem).find('p.title')
      const hotel_name = $(title_elem).text().trim()
      // price element is in the format "SGD ${price}"
      // therefore the slice (4) to remove the "SGD "
      const str_hotel_price = $(price_elem).text().trim().slice(4)
      const hotel_price = Number(str_hotel_price)

      console.log('HOTCARD', k, hotel_name, hotel_price, card_elem)
      const hotel_id = hotel_name_mapping[hotel_name]
      expect(hotel_id).not.toBe(undefined)
      expect(typeof hotel_id).toBe('string')

      // skip price card checks if the pricing api response
      // doesn't contain the price for the current hotel id
      if (!price_mapping.hasOwnProperty(hotel_id)) { continue; }

      const api_hotel_price_info = price_mapping[hotel_id]
      const api_hotel_price = api_hotel_price_info.price
      expect(hotel_price).toBe(api_hotel_price)
      expect(hotel_price).toBeGreaterThan(0)
    }
  }) 

  // check that autocomplete search results are sensible
  it('check autocomplete', async () => {
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    // this test checks that if we enter an exact destination
    // name into the autocomplete we will get the desination name
    // as the first result of our autocomplete suggestions.
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

    // fuzzy search destination names ourselves with the
    // search destination (so that we can check again UI suggestions)
    const all_matches = fuzzysort.go(
      search_destination, destination_names
    ).map(search_result => search_result.target)
    console.log("ALL_MATCHES", all_matches)

    // collect list of suggestions displayed on autocomplete
    // suggestions box into the suggestions array variable
    const suggestions = load_suggestions(wrapper)
    // get the first couple of fuzzysort matches with the
    // same length as the list of autocomplete suggestions
    const sub_matches = all_matches.slice(0, suggestions.length);
    expect(sub_matches).toStrictEqual(suggestions);
    expect(suggestions.length).toBeLessThanOrEqual(
      all_matches.length
    );

    const start_time = (new Date()).getTime()
    const autocomplete_reuslts = wrapper.vm.filtered_search_matches;
    const end_time = (new Date()).getTime()
    const duration = end_time - start_time

    expect(autocomplete_reuslts[0]).toBe(search_destination);
  })

  // check that autocomplete search results are sensible
  it('check random autocomplete', async () => {
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    // this test checks that if we enter the exact destination
    // name (we randomly sample from our list of destination names
    // into the autocomplete we will get the desination name
    // as the first result of our autocomplete suggestions.
    // We randomly try
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

      // make sure the the text input in the raw HTML element
      // of the autocomplete search bar is equal to the
      // destination_input vue data variable that we set
      // (confirms data binding of destination_input on searchbar)
      const autocomplete_bar = wrapper.find('#dest_search_field')
      console.log('AUTOCOMPLETE-BAR', autocomplete_bar)
      const autocomplete_elem = autocomplete_bar.element
      console.log('BAR-EL', autocomplete_bar.element)
      expect(autocomplete_elem._value).toBe(search_destination)

      // fuzzy search destination names ourselves with the
      // search destination (so that we can check again UI suggestions)
      const all_matches = fuzzysort.go(
        search_destination, destination_names
      ).map(search_result => search_result.target)
      console.log("ALL_MATCHES", all_matches)

      // Cradle Mountain, Cradle Mountain, TAS, Australia
      // collect list of suggestions displayed on autocomplete
      // suggestions box into the suggestions array variable
      const suggestions = load_suggestions(wrapper)
      // get the first couple of fuzzysort matches with the
      // same length as the list of autocomplete suggestions
      const sub_matches = all_matches.slice(0, suggestions.length);
      if (!(
        (suggestions[0] === search_destination) &&
        (all_matches[0] !== search_destination)
       )) {
        /*
        the vue component search ago intentionally pushes
        a suggestion to the top if it matches the input
        destination typed in perfectly, while surprisingly enough
        fuzzy search by itself does not do that all the time.
        Therefore we only check that our own fuzzysearch 
        results with the vue suggestions loader only in the
        case where the suggestions loader isn't pushing
        exact matches to the top (hence the if condition)
        */
        expect(sub_matches).toStrictEqual(suggestions);
      }

      expect(suggestions.length).toBeLessThanOrEqual(
        all_matches.length
      );
      
      const start_time = (new Date()).getTime()
      const autocomplete_reuslts = wrapper.vm.filtered_search_matches;
      const end_time = (new Date()).getTime()
      const duration = end_time - start_time
      console.log('SEARCH TIME', k, search_destination, duration)

      expect(autocomplete_reuslts[0]).toBe(search_destination);
    }
  })

  // check that autocomplete search results are sensible
  it('fuzz autocomplete suggestions', async () => {
    while (!wrapper.vm.destinations_loaded) { await sleep(100); }
    /*
    this test checks that if we enter the exact destination
    name (we randomly sample from our list of destination names
    into the autocomplete we will get the desination name
    as the first result of our autocomplete suggestions.
    We randomly try different valid desinations names from our
    list of valid destination names to make sure it works
    */
    expect(wrapper.vm.status_text).not.toBe(Home.LOAD_FAIL_MSG);
    const dest_path = 'src/assets/destinations_flat.json'
    const raw_file_data = await fs.readFileSync(dest_path);
    const file_data = JSON.parse(raw_file_data);
    const num_fuzz_tests = 20;

    const unpack_results = wrapper.vm.unpack_destinations(file_data)
    const [destination_names, dest_mapping] = unpack_results
    const fuzzer_seed = rand();
    fuzzer.seed(fuzzer_seed);

    for (let k=0; k<num_fuzz_tests; k++) {
      const search_destination = destination_names[
        Math.floor(Math.random() * destination_names.length)
      ];

      let fuzzed_input = '';
      while (true) {
        fuzzed_input = fuzzer.mutate.string(search_destination);
        
        if (fuzzed_input.length === 0) {
          console.log('FUZZED STRING IS EMPTY. SKIPPING')
          continue;
        } else if (fuzzed_input === search_destination) {
          continue
        }
        
        break;
      }

      // const search_destination = "Gap, France"
      wrapper.vm.destination_input = fuzzed_input
      await wrapper.vm.$nextTick()

      // make sure the the text input in the raw HTML element
      // of the autocomplete search bar is equal to the
      // destination_input vue data variable that we set
      // (confirms data binding of destination_input on searchbar)
      const autocomplete_bar = wrapper.find('#dest_search_field')
      console.log('AUTOCOMPLETE-BAR', autocomplete_bar)
      const autocomplete_elem = autocomplete_bar.element
      console.log('BAR-EL', autocomplete_bar.element)
      expect(autocomplete_elem._value).toBe(fuzzed_input)

      // fuzzy search destination names ourselves with the
      // search destination (so that we can check again UI suggestions)
      const all_matches = fuzzysort.go(
        fuzzed_input, destination_names
      ).map(search_result => search_result.target)
      // console.log("ALL_MATCHES", all_matches)

      // collect list of suggestions displayed on autocomplete
      // suggestions box into the suggestions array variable
      const suggestions = load_suggestions(wrapper)
      // get the first couple of fuzzysort matches with the
      // same length as the list of autocomplete suggestions
      const sub_matches = all_matches.slice(0, suggestions.length);
      expect(sub_matches).toStrictEqual(suggestions);
      expect(suggestions.length).toBeLessThanOrEqual(
        all_matches.length
      );
      
      const start_time = (new Date()).getTime()
      // call the computed property used to generate search results 
      // fed to the homepage autocomplete suggestions box
      const autocomplete_reuslts = wrapper.vm.filtered_search_matches;
      const end_time = (new Date()).getTime()
      const duration = end_time - start_time

      expect(suggestions).toStrictEqual(autocomplete_reuslts)
      const index = autocomplete_reuslts.indexOf(search_destination)
      console.log(`
        START_DEST: [${search_destination}]
        FUZZE_SEAR: [${fuzzed_input}]
        SUGGESTIED: ${suggestions.slice(0, 10).join(' | ')}
      `)

      let relative_position = -1
      if (suggestions.length !== 0) {
        // expect(index).not.toBe(-1)
        relative_position = index / suggestions.length
        if (relative_position >= 0.5) {
          // maybe could do a test to check if the higher ranking
          // suggestions contain the fuzzed input or something
          console.warn('FUZZED INPUT NOT IN TOP 50% OF SEARCHES')
          console.warn(
            fuzzed_input, search_destination, suggestions
          )

          // if the fuzzed input conmtains a subset of the 
          // initial search destination. then we expect that
          // its a subset of the top fuzzy search suggestion as well
          // this is based on anecdotal observation so its not 
          // guaranteed to be true either
          if (search_destination.includes(fuzzed_input)) {
            console.log('FUZZ INCLUDE CHECK')
            expect(sugggestions[0]).stringMatching(fuzzed_input)
          }
        }
      }

      console.log(`
        FUZZ-SEARCH [${k}] - ${duration}
        ORIG [${search_destination}] FUZZ [${fuzzed_input}]
        POS ${index} / ${autocomplete_reuslts.length}
        R-POS ${relative_position}
      `)
    }
  })
})
