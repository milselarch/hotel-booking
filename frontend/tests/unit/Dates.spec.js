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

describe('Home.vue datepicker Test', () => {
  // unit tests for the datepicker component in home.vue
  // and the date formatting and parsing methods we've written
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

  it('check date formatter', () => {
    /*
    verify date formatting and parsing use by datepicker
    componenet is correct
    */
    const date_now = new Date();
    const stripped_date = new Date(date_now)
    stripped_date.setHours(0, 0, 0, 0)
    
    const date_str = wrapper.vm.format_date(date_now)
    // regex for date format dd/mm/yyyy
    const regex = new RegExp('^[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}$');
    // make sure converted date string has correct format
    expect(regex.test(date_str)).toBe(true)
  })

  it('check date formatter empty array edge case', () => {
    /*
    verify that passing in an empty array to date_format
    will return an empty string
    */
    const date_str = wrapper.vm.format_date([])
    expect(date_str).toBe('')
  })

  it('check date formatter edge case', () => {
    /*
    verify that passing in an array of two dates
    to date_format will return a stirng with format
    'dd/mm/yyyy - dd/mm/yyyy'
    */
    const date1 = new Date();
    const date2 = new Date();
    const date_input = [date1, date2]

    const date_str = wrapper.vm.format_date(date_input)
    // regex for date format dd/mm/yyyy
    const base_regex = '[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}'
    // regex for date format 'dd/mm/yyyy - dd/mm/yyyy'
    const regex = new RegExp(`^${base_regex} - ${base_regex}$`);
    expect(regex.test(date_str)).toBe(true)
  })

  it('check date formatter same case', () => {
    /*
    verify that passing in an array of the two dates
    (where both dates are the same and current date)
    to date_format will return a stirng with format
    'dd1/mm1/yyyy1 - dd2/mm2/yyyy2', and ensure each subdate string
    is the same i.e. dd1/mm1/yyyy1 = dd2/mm2/yyyy2
    */
    const date1 = new Date();
    const date2 = date1
    const date_input = [date1, date2]

    const date_str = wrapper.vm.format_date(date_input)
    // regex for date format dd/mm/yyyy
    const base_regex = '[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}'
    // regex for date format 'dd/mm/yyyy - dd/mm/yyyy'
    const regex = new RegExp(`^${base_regex} - ${base_regex}$`);
    expect(regex.test(date_str)).toBe(true)

    const sub_dates = date_str.split(' - ')
    const [date_str1, date_str2] = sub_dates;
    expect(date_str1).toBe(date_str2)
  })

  it('fuzz date formatter array inputs', () => {
    /*
    verify that passing in an array of the two ramdom 
    (future) dates to date_format will return a stirng with format
    'dd1/mm1/yyyy1 - dd2/mm2/yyyy2', and ensure each subdate string
    dd1/mm1/yyyy1 and dd2/mm2/yyyy2 match the original input dates
    (in terms of day, month, and year) when parsed
    */
    const date_now = new Date();
    const timestamp = date_now.getTime()

    for (let k=0; k<100; k++) {
      const future_stamp1 = (1 + Math.random()) * timestamp
      const future_stamp2 = (1 + Math.random()) * timestamp
      const date1 = new Date(future_stamp1)
      const date2 = new Date(future_stamp2)
      const date_input = [date1, date2]

      const stripped_date1 = new Date(date1)
      stripped_date1.setHours(0, 0, 0, 0)
      const stripped_date2 = new Date(date2)
      stripped_date2.setHours(0, 0, 0, 0)

      const date_str = wrapper.vm.format_date(date_input)
      // regex for date format dd/mm/yyyy
      const base_regex = '[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}'
      // regex for date format 'dd/mm/yyyy - dd/mm/yyyy'
      const regex = new RegExp(`^${base_regex} - ${base_regex}$`);
      expect(regex.test(date_str)).toBe(true)

      const sub_dates = date_str.split(' - ')
      const [date_str1, date_str2] = sub_dates;
      const converted_date1 = wrapper.vm.parse_date(date_str1)
      const converted_date2 = wrapper.vm.parse_date(date_str2)
      expect(stripped_date1).toStrictEqual(converted_date1)
      expect(stripped_date2).toStrictEqual(converted_date2)
    }
  })

  it('check date string parse', () => {
    /*
    verify when we feed in a date string created by
    our format_date method, our parse_date method can
    return a valid date object
    */
    const date_now = new Date();
    const stripped_date = new Date(date_now)
    stripped_date.setHours(0, 0, 0, 0)
    
    const date_str = wrapper.vm.format_date(date_now)
    // make sure the date string that we parse is the same
    // as the original date object used to create the string
    const converted_date = wrapper.vm.parse_date(date_str)
    expect(converted_date instanceof Date).toBe(true)
  })

  it('check date format & parse consistency', () => {
    /*
    Verify when we feed in a date string based off the 
    current date into our format_date method, our parse_date 
    method can parse it and return a valid date object
    that has the same day, month, year as the original
    date object (in the local timezeone), and that the
    parsed date is the first possible date of the (local) day
    */
    const date_now = new Date();
    const stripped_date = new Date(date_now)
    stripped_date.setHours(0, 0, 0, 0)
    
    const date_str = wrapper.vm.format_date(date_now)
    // make sure the date string that we parse is the same
    // as the original date object used to create the string
    const converted_date = wrapper.vm.parse_date(date_str)
    expect(converted_date instanceof Date).toBe(true)
    expect(stripped_date).toStrictEqual(converted_date)
  })

  it('earliest boundary date format & parse consistency', () => {
    /*
    (boundary value analysis)
    Verify when we feed in a date string based off the 
    earliest date that represents the day in the current timezone
    current date into our format_date method, our parse_date 
    method can parse it and return a valid date object
    that has the same day, month, year as the original
    date object (in the local timezeone), and that the
    parsed date is the first possible date of the (local) day
    */
    const date_now = new Date();
    const earliest_date = new Date(date_now)
    earliest_date.setHours(0, 0, 0, 0)
    
    const date_str = wrapper.vm.format_date(earliest_date)
    // make sure the date string that we parse is the same
    // as the original date object used to create the string
    const converted_date = wrapper.vm.parse_date(date_str)
    expect(converted_date instanceof Date).toBe(true)
    expect(earliest_date).toStrictEqual(converted_date)
  })

  it('latest boundary date format & parse consistency', () => {
    /*
    (boundary value analysis)
    Verify when we feed in a date string based off a
    date that is one millisecond BEFORE the 
    earliest date that represents the day in the current timezone
    current date into our format_date method, our parse_date 
    method can parse it and return a valid date object
    that has the same day, month, year as the original
    date object (in the local timezeone)

    The parsed date here should be 1 day behind the original day
    */
    const date_now = new Date();
    const earliest_date = new Date(date_now)
    earliest_date.setHours(0, 0, 0, 0)
    const before_date = new Date(
      earliest_date.getTime() - 1
    );
    
    const ref_date_str = wrapper.vm.format_date(earliest_date)
    const date_str = wrapper.vm.format_date(before_date)
    // make sure the date string that we parse is the same
    // as the original date object used to create the string
    const converted_date = wrapper.vm.parse_date(date_str)
    expect(converted_date instanceof Date).toBe(true)
    expect(date_str).not.toBe(ref_date_str)
    expect(
      earliest_date.getTime() - converted_date.getTime()
    ).toStrictEqual(24 * 3600 * 1000)
  })

  it('iterate fuzz date format & parse consistency', () => {
    /*
    Verify when we feed in date strings
    into our format_date method, our parse_date 
    method can parse it and return a valid date object
    that has the same day, month, year as the original
    date object (in the local timezeone), and that the
    parsed date is the first possible date of the (local) day
    */
    const date_now = new Date();

    for (let k=0; k<100; k++) {
      // generate dates 0 to 100 (exclusive) hours
      // offset to the current date and make sure that
      // when we format then parse the date we get back
      // an equivilant date value (for day, month, and year only)
      const offset = k * 3600 * 1000
      const date = new Date(date_now.getTime() + offset)
      const stripped_date = new Date(date)
      stripped_date.setHours(0, 0, 0, 0)
      
      const date_str = wrapper.vm.format_date(date)
      // make sure the date string that we parse is the same
      // as the original date object used to create the string
      const converted_date = wrapper.vm.parse_date(date_str)
      expect(converted_date instanceof Date).toBe(true)
      expect(stripped_date).toStrictEqual(converted_date)
    }
  })

  it('random fuzz date format & parse consistency', () => {
    /*
    Verify when we feed in random future date strings
    into our format_date method, our parse_date 
    method can parse it and return a valid date object
    that has the same day, month, year as the original
    date object (in the local timezeone), and that the
    parsed date is the first possible date of the (local) day

    We only care about future dates because you can't book
    hotels in the past anyway.
    */
    const date_now = new Date();
    const timestamp = date_now.getTime()

    for (let k=0; k<100; k++) {
      // generate random dates in the future and make sure that
      // when we format then parse the date we get back
      // an equivilant date value (for day, month, and year only)
      const future_stamp = (1 + Math.random()) * timestamp
      const date = new Date(future_stamp)
      const stripped_date = new Date(date)
      stripped_date.setHours(0, 0, 0, 0)
      
      const date_str = wrapper.vm.format_date(date)
      // make sure the date string that we parse is the same
      // as the original date object used to create the string
      const converted_date = wrapper.vm.parse_date(date_str)
      expect(converted_date instanceof Date).toBe(true)
      expect(stripped_date).toStrictEqual(converted_date)
    }
  })

  it('random fuzz boundary date format & parse consistency', () => {
    /*
    Verify when we feed in random future date strings
    (based of the earliest dates that represents their
    respective days in the current timezone)
    into our format_date method, our parse_date 
    method can parse it and return a valid date object
    that has the same day, month, year as the original
    date object (in the local timezeone), and that the
    parsed date is the first possible date of the (local) day

    We only care about future dates because you can't book
    hotels in the past anyway.
    */
    const date_now = new Date();
    const timestamp = date_now.getTime()

    for (let k=0; k<100; k++) {
      // generate random dates in the future and make sure that
      // when we format then parse the date we get back
      // an equivilant date value (for day, month, and year only)
      const future_stamp = (1 + Math.random()) * timestamp
      const date = new Date(future_stamp)
      const earliest_date = new Date(date)
      earliest_date.setHours(0, 0, 0, 0)
      
      const date_str = wrapper.vm.format_date(earliest_date)
      // make sure the date string that we parse is the same
      // as the original date object used to create the string
      const converted_date = wrapper.vm.parse_date(date_str)
      expect(converted_date instanceof Date).toBe(true)
      expect(earliest_date).toStrictEqual(converted_date)
    }
  })
})
