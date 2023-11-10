<template>
  <div 
    class="homepage"
    v-bind:class="{ 'full-bleed': full_bleed }"
  >
    <div 
      id="front-wrapper"
      v-bind:class="{ 'full-bleed': full_bleed }"
    >
      <div id="front-cover">
        <div class="description-wrapper">
          <div class="description">
            <h1>The Bestest Hotels in the Multiverse</h1>
            <p id="short-info">
              <span>
                <!--
                Kaligo co-founders Kyle Armstrong and Sebastian Grobys, 
                both veterans of the lifestyle and loyalty space, have 
                found a way to credit customers up to ten times the volume 
                of miles that can be earned elsewhere. That is for booking 
                the same hotel at the same or similar rates. 
                -->
                Use Ascenda's white label UIs and content aggregation hub 
                to deploy a hassle-free, OTA-level travel booking experience 
                for your rewards program.
                <!--
                Welcome to Ascenda: your premier gateway to a seamless
                travel experience. Leveraging our state-of-the-art 
                white label UIs and an extensive content aggregation 
                hub, we empower you to offer an unparalleled OTA-level
                travel booking journey. Tailored explicitly for rewards
                programs, Ascenda ensures that your users not only 
                find the ideal accommodations but also enjoy exclusive
                benefits and earn rewards with each booking. Dive into
                a hassle-free, streamlined, and rewarding travel 
                booking platform that sets new standards in the industry.
                Choose Ascenda, and let your rewards program stand out!
                -->
              </span>
            </p>

            <div class="buttons" v-show="!authenticated">
              <b-button 
                type="is-dark" id="login"
                @click="open_login()"
              >
                Login
              </b-button>
              <b-button 
                type="is-dark" id="signup"
                @click="open_signup()"
              >
                Sign Up
              </b-button>
            </div>
          </div>
        </div>

        <div class="search-options">
          <section>
            <b-field class="searchbox">
              <b-field>
                <b-autocomplete
                  id="dest_search_field"
                  v-model="destination_input"
                  :data="filtered_search_matches"
                  placeholder="Search Destination e.g. tioman island"
                  icon="search-location"
                  :disabled="is_loading"
                  :clearable="!is_loading"
                  @select="option => selected = option">
                  <template #empty>{{ search_empty_message }}</template>
                </b-autocomplete>
              </b-field>
            </b-field>

            <b-field 
              :type="{ 'is-danger': !(
                rooms_valid && is_valid_guests(num_guests)
              )}" expanded
            >
              <b-field 
                id="rooms-field" expanded class="custom-label"
                :disabled="is_loading"
              >
                <div class="label-header">
                  <div class="line"></div>
                  <p>Rooms</p>
                  <div class="line"></div>
                </div>

                <b-select
                  placeholder="Rooms" icon="door-closed"
                  expanded id="room-selector" v-model="num_rooms"
                  :disabled="is_loading"
                >
                  <option 
                    v-for="(num_rooms, index) in allowed_room_choices"
                    v-bind:key="index" :value="num_rooms"
                  >
                    {{ num_rooms }}
                  </option>
                </b-select>
              </b-field>

              <div class="mid-buffer"></div>

              <b-field 
                id="guests-field" expanded class="custom-label"
                :type="num_guests_has_error ? 'is-danger': 'text'"
                :message="guests_validation_error"
              >
                <div class="label-header">
                  <div class="line"></div>
                  <p>Guests per room</p>
                  <div class="line"></div>
                </div>

                <b-input placeholder="Guests"
                  label="test" ref="guests_input"
                  type="number" icon="user" id="guests-input"
                  v-model.number="num_guests"
                  :use-html5-validation="false"

                  min="1" :max="max_num_guests" default="1"
                  pattern="[0-9]+" required
                  :disabled="is_loading"
                >
                </b-input>
              </b-field>

            </b-field>


            <!--
            <b-field class="searchbox" label="Name">
              <b-input value="Kevin Garvey"></b-input>
            </b-field>
            -->

            <b-field>
              <b-datepicker
                placeholder="Select check in and checkout dates"
                v-model="dates" 
                icon="calendar"
                :date-formatter="format_date"
                :date-parser="parse_date"
                :icon-right="dates_are_valid ? 'check': ''"
                :unselectable-dates="should_exclude_date"
                :disabled="is_loading"
                :mobile-native="false"
                range>
              </b-datepicker>
            </b-field>

            <b-button
              id="search-button"
              type="is-dark" expanded
              @click.native="begin_search"
              :disabled="!allow_search || is_loading"
            > Search
            </b-button>

            <!--
            {{ [num_guests] }}

            <b-button @click="fast_forward_date"> 
              fast foward 1 day
            </b-button>

            <br/>
            {{ dates }}
            <br/>
            {{ current_date }}
            -->
          </section>
        </div>
      </div>

      <div 
        v-show="!full_bleed || is_loading || load_error"
        id="status-bar-wrapper"
      >
        <hr/>
        <div 
          v-bind:class="{ bland: is_destination_valid }"
          id="hotel-load-status"
        >        
          <div class="blur-background"></div>
          <div id="status" v-show="true">
            <p id="status-text">{{ status_text }}</p>
            <square id="spinner" v-show="is_loading"></square>

            <p id="search-params" v-show="search_success">
              <b-taglist class="search-taglist">
                <b-tag class="search-tag" type="is-light" size="is-medium">
                  {{ date_info }}
                </b-tag>
                <b-tag class="search-tag" type="is-light" size="is-medium">
                  {{ guests_info }}
                </b-tag>
              </b-taglist>
            </p>
          </div>
        </div>
      </div>

    </div>

    <div
      id="hotel-cards" ref="cards_holder"
      v-show="!full_bleed"
      v-infinite-scroll="render_more_hotels" 
      infinite-scroll-disabled="all_hotels_loaded"
      infinite-scroll-distance="100"
    >
      <HotelCard
        class="card" style="width: 20rem" 
        v-for="(hotel, key) in hotels_loaded" v-bind:key="key"
        @click.native="select_hotel(hotel)"
        ref="cards" :hotel="hotel" :price_map="price_mapping"
        :is_loading="price_search_loading[search_stamp]"
        :search_stamp="search_stamp"
      />
    </div>

    <div
      id="end-bar" 
      v-show="all_hotels_loaded && scrollable && !full_bleed"
      ref="end_bar"
    >
      <a v-on:click="scroll_to_top()">— Go back to top —</a>
    </div>

  </div>
</template>

<script>
// v-html="hotel['description']"
import fuzzysort from 'fuzzysort'
import moment, { utc } from 'moment'
import sleep from 'await-sleep'
import assert from 'assert'
import axios from 'axios'
import $ from 'jquery'
import _ from 'lodash'

import HotelCard from '@/components/HotelCard.vue'
import { faL } from '@fortawesome/free-solid-svg-icons'
import router from '../router'

const READ_UTC_OFFSET = () => {
  const test_date = new Date()
  // get timezone offset in minutes from UTC+0
  const utc_offset = -test_date.getTimezoneOffset();
  return utc_offset
}

const UTC_OFFSET = READ_UTC_OFFSET()
const LOAD_FAIL_MSG = "failed to load hotels\n●︿●";
const DATE_FORMAT = 'DD/MM/YYYY'
// max number of autocomplete suggestions to show
const MAX_SUGGESTIONS = 50

const print_error = () => {
  // print to console if we're not running a unit test
  if (process.env.NODE_ENV === 'test') { return false }
  console.error(...arguments);
  return true;
}

export default {
  name: 'Home',
  LOAD_FAIL_MSG: LOAD_FAIL_MSG,
  DATE_FORMAT: DATE_FORMAT,
  MAX_SUGGESTIONS: MAX_SUGGESTIONS,
  UTC_OFFSET: UTC_OFFSET,

  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      destinations_loaded: false,
      destination_names: [], // array of destination names
      destination_mappings: {}, // map destination name to ID
      // cap on the number of autocomplete suggestions to show
      num_suggestions: 1,

      hotels: [],
      hotels_loaded: [],
      hotels_searched_before: false,

      selected: null,
      destination: '',
      destination_input: '',
      card_width: null,
      card_holder_width: null,
      cards_preloaded: false,

      search_stamp: -1,
      price_mapping: {},
      price_search_loading: {},

      num_guests: 2,
      searched_num_guests: 0,
      max_num_guests: 20,
      current_date: new Date(),
      searched_dates: [],
      dates: [],

      max_num_rooms: 10,
      searched_num_rooms: 0,
      num_rooms: 1,

      is_loading: false,
      load_error: false,
      last_dest_id: null,
      last_dest_name: null,

      scrollable: false,
      
      // for vuex
      x: 0,
      y: 0,
    }
  },

  methods: {
    open_login() {
      this.$emit('open-login')  
    },

    open_signup() {
      this.$emit('open-signup')
    },

    fast_forward_date() {
      const date_now = moment(this.current_date)
      const cutoff_date = date_now.add(24, 'h').toDate();
      this.current_date = cutoff_date
    },

    format_date(date) {
      /*
      Format a date object into a date string with format dd/mm/yyyy
      OR given an array of 2 date objects, return a date string of
      the form 'dd/mm/yyyy - dd/mm/yyyy' where the 1st and 2nd dates
      in the array are formatted 1st and 2nd in the string respectively
      OR given an empty array, return an empty string

      Note that day, month and year are determined relative to the
      local time zone and not in UTC
      */
      console.log('INPUT-DATE', date)

      if (date instanceof Date) {
        const moment_date = moment(date).seconds(0).milliseconds(0)
        const local_date = moment_date.local()
        const utc_offset = local_date.utcOffset()
        // refresh the page if local timezone has changed
        // https://stackoverflow.com/questions/50849770
        if (utc_offset !== UTC_OFFSET) { 
          // console.error("OFFSET MISMATCH", utc_offset, UTC_OFFSET)
          window.location.reload()
        }
        const date_str = local_date.format(DATE_FORMAT);
        return date_str

      } else if (Array.isArray(date)) {
        assert(date.length <= 2)
        if (date.length === 0) { return '' }
        assert(date.length === 2)

        const date_str1 = this.format_date(date[0])
        const date_str2 = this.format_date(date[1])
        return `${date_str1} - ${date_str2}`
      }

      throw `BAD DATE ${date}`
    },

    parse_date(date_str) {
      /*
      Parse a date string in the dd/mm/yyyy format
      and return the date object at the start of the day
      that the dd/mm/yyyy date corresponds to

      Note that if we parse a date like '18/08/20222' and print out
      the parsed date in singapore you would see it printed
      as 2022-08-17T16:00:00.000Z
      (date print format is YYYY-MM-DD T HH:MM:SS:MILLISECONDS) Z
      The Z means that the date being shown has been formatted
      into a string using a UTC+0 timezone.

      The fact that the date printed has a day of 17 but the date 
      string has a day of 18 is not a mistake, because the earlist 
      date on 18/08/2022 in SG time (UTC+8) is 2022-08-18T00:00:00 
      SG time, which is actually 2022-08-17T16:00:00 UTC time
      hence the appearence of it as 2022-08-17T16:00:00.000Z

      Dates have been very annoying to work with
      */
      // console.log('DATE STR-PARSE', date_str)
      const test_date = new Date();
      // get UTC offset (in minutes) of the current timezone
      const offset = test_date.getTimezoneOffset();
      const moment_start_date = moment.utc(date_str, DATE_FORMAT)
      // offset the date to get the local start date of the day
      const local_moment_start_date = moment_start_date.add(
        -UTC_OFFSET, "minutes"
      )
      // console.log('M_DATE', m_date, m_date2, offset)
      const local_start_date = local_moment_start_date.toDate()
      // const utc_date = moment.utc(date_str, DATE_FORMAT)
      // const date = utc_date.utcOffset(offset).toDate();
      // console.log('DATES-PARSE', utc_date.toDate(), date)
      return local_start_date
    },

    should_exclude_date(date) {
      // prevent days that start less than 12 hours
      // away from the current timestamp
      const date_now = moment(this.current_date)
      const cutoff_date = date_now.add(12, 'h').toDate();
      // console.log('START DATE CMP', cutoff_date, date)
      return cutoff_date > date
    },

    begin_search() {
      /*
      returns true if hotels search request
      was launched, or false if search request is invalid
      */
      if (!this.allow_search) {
        // console.log('SEARCH BANNED')
        return false;
      } else if (this.is_loading) {
        // console.log('SEARCH ALR PENDING')
        return false;
      }

      if (!this.is_destination_valid) {
        // console.log('DEST INVALIUD')
        return false;
      }
      
      this.destination = this.destination_input;
      const mappings = this.destination_mappings;
      if (!mappings.hasOwnProperty(this.destination)) {
        // console.log('DEST INVALIUD V2')
        return false;
      }
      
      const dest_id = this.destination_mappings[this.destination]
      this.last_dest_id = dest_id
      this.last_dest_name = this.destination
      // load_hotels is an async method
      this.load_hotels(dest_id)
      assert(this.is_loading)
      return true;
    },

    select_hotel(hotel) {
      console.log('SELECTED', hotel, hotel['id']);
      const [start_date, end_date] = this.dates
      const start_date_str = moment(start_date).format('YYYY-MM-DD');
      const end_date_str = moment(end_date).format('YYYY-MM-DD');
      console.log(this.selected);

      var hotelinfo = {
        desc: hotel['description'], 
        dest: this.selected,
        name: hotel['name'],
        hotelid: hotel['id'],
        images: hotel['image_details'],
        checkin: start_date_str,
        checkout: end_date_str,
        numrooms: this.num_rooms,
        numguests: this.num_guests,
        destid: this.last_dest_id,
        lat: hotel['latitude'],
        long: hotel['longitude']
        }
      this.$store.commit("getDetails", hotelinfo)

      if (hotel['amenities'].length != 0){
        this.$store.commit("getAmenities", hotel['amenities'])
      }
      else {
        this.$store.commit("getAmenities", null)
      }

      router.push({
        path: (
          `/hotels/${hotel['original_metadata']['country']}` +
          `/${this.last_dest_id}/${hotel['id']}/${this.num_guests}` +
          `/${start_date_str}/${end_date_str}`
        )
      })
    },

    scroll_to_top() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    preload_cards() {
      if (
        (self.card_width === null) ||
        (self.card_holder_width === null) ||
        (self.cards_preloaded === true)
      ) {
        return false;
      }

      this.render_more_hotels()
      this.cards_preloaded = true
      return true
    },

    render_more_hotels(num_to_load=9) {
      /*
      loads hotel cards such the entirety
      of the last row is filled. We will attempt smart loading
      (load cards to fill the entirety of the last row) if
      hotel card width and hotel card holder width is avaliable.
      Otherwise, we will load a fixed number of cards
      */
      if (num_to_load === 0) { return false }
      assert(typeof num_to_load === 'number')
      assert(Number.isInteger(num_to_load))
      assert(num_to_load > 0)

      // console.log('NUM_TO_LOAD', num_to_load)
      const self = this;
      let smart_loading = true;
      
      if (
        (self.card_width === null) ||
        (self.card_width === 0) ||
        (self.card_holder_width === null) ||
        (self.card_holder_width === 0)
      ) {
        // if we don't know either the width of a single
        // card, or the width of the card holder, we will
        // disable smart loading
        smart_loading = false;
      }

      /*
      console.log(
        'LOAD', self.card_holder_width, self.card_width, smart_loading
      )
      */

      if (smart_loading) {
        const num_hotels_loaded = self.hotels_loaded.length;
        const cards_per_row = Math.max(1, Math.floor(
          self.card_holder_width / self.card_width
        ))

        // console.log('LOADP', num_hotels_loaded, num_to_load)

        // round off the number of hotel cards to load
        // so that it fills up the entirety of the last row
        num_to_load += cards_per_row - (
          (num_hotels_loaded + num_to_load) % cards_per_row
        )
        // console.log('NEWLOAD', num_to_load, cards_per_row)
        // console.log('LOADH', num_hotels_loaded, num_to_load)
      }

      // let num_to_load = 10;
      // num_to_load = 10

      for (let k=0; k<num_to_load; k++) {
        const hotel_index = this.hotels_loaded.length;
        if (hotel_index >= this.hotels.length) {
          return false;
        }

        this.hotels_loaded.push(this.hotels[hotel_index])
      }

      return true
    },

    search_params_match(
      dest_id, dates, num_guests, num_rooms,
      dest_name
    ) {
      if (
        (this.last_dest_id === dest_id) && (
          (this.last_dest_name === dest_name) ||
          (dest_name === undefined) 
        ) && (_.isEqual(this.searched_dates, dates)) &&
        (this.searched_num_guests === num_guests) &&
        (this.searched_num_rooms === num_rooms)
      ) {
        /*
        return true if we already searched
        the same destination previously already
        successfully (i.e. no errors) and in the same
        booking date range and same number of guests 
        and same number of rooms as previously as well

        we need to check both destination name and id
        as some destinations map different destination names
        to the same destination id
        */
        return true;
      }

      return false
    },

    async load_prices({
      dest_id, dates, num_guests, num_rooms,
      search_stamp
    }) {
      assert(typeof search_stamp === 'number')
      assert(!this.price_search_loading.hasOwnProperty(search_stamp))
      let price_resp = {}

      try {
        price_resp = await this.make_price_request(
          dest_id, dates, num_guests, num_rooms
        )
      } catch (e) {
        console.log('PRICING FAIL', search_stamp)
      }

      assert(this.price_search_loading.hasOwnProperty(search_stamp))
      /*
      if (process.env.NODE_ENV !== 'test') {
        console.log('PRICE_RESP', price_resp)
      }
      */

      const price_data = price_resp.data;
      // const price_data = price_resp.data;
      const price_mapping = {}

      if (price_data === undefined) {
        // pass if proxy_json has no data attribute
      } else if (price_data.proxy_json === undefined) {
        // pass if proxy_json not in price response
      } else if (price_data.proxy_json.hotels === undefined) {
        // pass if price response have no hotels
      } else {
        // add price as a property to each hotel
        // in the original hotels api response
        const hotel_prices = price_data.proxy_json.hotels
        // console.log('HOTEL_PRICES', hotel_prices)
        // console.log('MAPPING', hotel_mapping)

        for (let k=0; k<hotel_prices.length; k++) {
          const hotel_pricing = hotel_prices[k]
          const hotel_id = hotel_pricing.id
          price_mapping[hotel_id] = hotel_pricing
        }
      }

      const search_params_match = this.search_params_match(
        dest_id, dates, num_guests, num_rooms
      )

      if (
        this.search_stamp !== search_stamp ||
        !search_params_match || 
        this.load_error
      ) {
        // skip price map update if search params
        // DONT match, or if we had a load error
        console.log('REJECT MAPPING', dest_id, price_mapping)
        return false;
      }

      this.price_mapping = {} // clear existing price caches
      this.price_mapping[search_stamp] = price_mapping
      console.log('PRICE_MAP', this.price_mapping)
    },

    make_price_request(dest_id, dates, num_guests, rooms) {
      const [start_date, end_date] = dates
      const start_date_str = moment(start_date).format('YYYY-MM-DD');
      const end_date_str = moment(end_date).format('YYYY-MM-DD');
      const guests_query = Array(rooms).fill(num_guests).join('|')
      console.log('START DATE STR', start_date_str)
      console.log('END DATE STR', end_date_str)
      console.log('ROOMS QURY', guests_query)

      const price_endpoint = "proxy/hotels/prices"
      // pricing api has missing destinations (e.g. TXQ5)
      // [Aswan Dam, Aswan, Egypt] - TXQ5 fails for example
      const get_params = {
        destination_id: dest_id, partner_id: 1,
        checkin: start_date_str, checkout: end_date_str,
        lang: "en_US", currency: "SGD",
        country_code: "SG", guests: guests_query
      }

      // keep making the price request
      // till we get that completed is true
      const price_request = axios.get(
        price_endpoint, {params: get_params}
      )

      return price_request
    },

    async load_prices({
      dest_id, dates, num_guests, num_rooms,
      search_stamp
    }) {
      // asynchronously load hotel price info
      assert(typeof search_stamp === 'number')
      // declare that the price search for the current
      // search stamp is ongoing
      this.price_search_loading[search_stamp] = true
      let price_resp = {}

      try {
        price_resp = await this.make_price_request(
          dest_id, dates, num_guests, num_rooms
        )
      } catch (e) {
        console.log('PRICING FAIL', search_stamp)
      } finally {
        // declare that the price search for the current
        // search stamp is complete
        this.price_search_loading[search_stamp] = false
      }

      console.log('PRICE_RESP', price_resp)
      const price_data = price_resp.data;
      // const price_data = price_resp.data;
      const price_mapping = {}
      if (price_data === undefined) {
        // pass if proxy_json has no data attribute
      } else if (price_data.proxy_json === undefined) {
        // pass if proxy_json not in price response
      } else if (price_data.proxy_json.hotels === undefined) {
        // pass if price response have no hotels
      } else {
        // add price as a property to each hotel
        // in the original hotels api response
        const hotel_prices = price_data.proxy_json.hotels
        // console.log('HOTEL_PRICES', hotel_prices)
        for (let k=0; k<hotel_prices.length; k++) {
          const hotel_pricing = hotel_prices[k]
          const hotel_id = hotel_pricing.id
          price_mapping[hotel_id] = hotel_pricing
        }
      }
      
      const search_params_match = this.search_params_match(
        dest_id, dates, num_guests, num_rooms
      )

      if (
        (this.search_stamp !== search_stamp) ||
        !search_params_match || this.loadError
      ) {
        // skip price map update if search params
        // DONT match, or if we had a load error
        console.log('REJECT MAPPING', dest_id, price_mapping)
        return false;
      }

      assert(this.search_stamp === search_stamp)
      this.price_mapping = {} // clear existing price caches
      this.price_mapping[search_stamp] = price_mapping
      console.log('PRICE_MAP', this.price_mapping)
    },

    make_price_request(dest_id, dates, num_guests, rooms) {
      const [start_date, end_date] = dates
      const start_date_str = moment(start_date).format('YYYY-MM-DD');
      const end_date_str = moment(end_date).format('YYYY-MM-DD');
      const guests_query = Array(rooms).fill(num_guests).join('|')
      console.log('START DATE STR', start_date_str)
      console.log('END DATE STR', end_date_str)
      console.log('ROOMS QURY', guests_query)
      const price_endpoint = "proxy/hotels/prices"
      // pricing api has missing destinations (e.g. TXQ5)
      // [Aswan Dam, Aswan, Egypt] - TXQ5 fails for example
      const get_params = {
          destination_id: dest_id, partner_id: 1,
          checkin: start_date_str, checkout: end_date_str,
          lang: "en_US", currency: "SGD",
          country_code: "SG", guests: guests_query
        }
      // keep making the price request
      // till we get that completed is true
      const price_request = axios.get(
        price_endpoint, {params: get_params}
      )
      return price_request
    },

    async load_hotels(dest_id, dest_name) {
      const self = this;
      const dates = self.dates
      
      if (dates.length !== 2) {
        return false 
      } else if (!this.is_valid_guests(this.num_guests)) {
        return false
      } else if (!this.rooms_valid) {
        return false
      }
      
      self.is_loading = true;
      self.hotels_loaded = [];
      self.load_error = false;
      self.hotels = []

      self.search_stamp = new Date().getTime()
      self.searched_num_guests = self.num_guests
      self.searched_num_rooms = self.num_rooms
      self.searched_dates = dates;
      // await sleep(10000);
      
      /*
      / TODO: implement lazier loading i.e. dont 
      try and force showing all the hotels once their data
      has arrived (some searches have crashed the site lol)
      / TODO: add rating, address info, and booking button
      / TODO: filter by rating
      TODO: show loader when loading hotels
      TODO: show error message when hotel load fails
      TODO-P1: filter by room number 
      (have to add rooms to destinations.json)
      TODO-P2: dynamic card shrinking + pinterest gallery style layout
      */
      
      self.load_prices({
        dest_id: dest_id, dates: dates, 
        num_guests: self.num_guests, num_rooms: self.num_rooms,
        search_stamp: self.search_stamp
      })
      
      const hotel_request = axios.get("proxy/hotels", {
        params: {destination_id: dest_id}
      });

      try {
        // wait for both requests to complete
        let response = await hotel_request;
        const status_code = response.data.status_code
        // console.warn('HOTELS RESPONSE', response)
        // console.log('CODE', status_code)

        if (status_code !== 200) {
          throw response.statusText;
        }
        
        self.hotels = response.data.proxy_json;
        self.hotels.sort((hotel1, hotel2) => {
          if (hotel1.rating < hotel2.rating) {
            return 1
          } else if (hotel1.rating > hotel2.rating) {
            return -1
          } else {
            return 0
          }
        })

        self.hotels_loaded = []
        self.render_more_hotels();
        self.hotels_searched_before = true;
        
      } catch (error) {
        self.load_error = true;
        print_error(error);
      } finally {
        self.is_loading = false;
      }
    },

    is_valid_guests(num_guests) {
      if (typeof num_guests !== 'number') {
        return false
      } else if (!Number.isInteger(num_guests)) {
        return false
      } else if (num_guests <= 0) {
        return false
      } else if (num_guests > this.max_num_guests) {
        return false
      }

      return true
    },

    unpack_destinations(destinations_data) {
      /*
      we expect destinations_data to be an array
      with two arrays inside. the first inner array is a list
      of all the destination IDs, and the second inner array
      contains all the destinations name. For every destination i
      the destination uid is at index i of the 1st inner array
      and the destination name is at index i of the 2nd inner array
      */
      assert(destinations_data.length == 2)
      // destinations_data is actually an object, not an array
      // when deployed in production, so we can't use 
      // array destructuring to get uids and names
      const uids = destinations_data[0];
      const names = destinations_data[1];
      // const [uids, names] = destinations_data
      // console.log('DEST', destinations_data, uids, names)
      
      assert(uids.length === names.length)
      const destination_mappings = {};

      for (let k=0; k<uids.length; k++) {
        const uid = uids[k];
        const name = names[k];
        destination_mappings[name] = uid
      }

      return [names, destination_mappings]
    },

    fuzzy_search(
      search_input, input_names, num_suggestions=1
    ) {
      /*
      return a reordering of input_names where 
      sorted in order of name that matches the search_input
      best (first element of output) to name that matches the
      search_input worst (last element of output)

      num_suggestions: max number of suggestions we can load
      */
      const self = this
      assert(num_suggestions >= 1)
      search_input = search_input.trim()
      const matches = fuzzysort.go(search_input, input_names)
      if ((matches.length) === 0) { return [] }
      
      let names = []
      // get num of suggestions to load given current cap
      // on max number of suggestions we can load right now
      const length = Math.min(matches.length, num_suggestions)
      // max num of suggestions to load if all html elements are laoded
      const max_length = Math.min(matches.length, MAX_SUGGESTIONS)

      if (max_length > length) {
        /*
        asynchronously increase max number 
        of autocomplete suggestionms that can be loaded
        The reason we need to do this asynchronously and incrementally
        is because showing all 50 autocomplete suggestions right at
        the start will actually lag the autocomplete search bar
        quite a fair bit right at the start (lag is gone after though)
        */ 
        (async () => {
          await sleep(1);
          // wait for autocomplete suggestion elements to load
          await self.$nextTick()
          self.num_suggestions = Math.min(
            num_suggestions + 1,
            MAX_SUGGESTIONS
          )
        })();
      }

      for (let k=0; k<length; k++) {
        // console.log(k, matches[k])
        const destinationName = matches[k]['target'];
        names.push(destinationName)
      }

      if (input_names.includes(search_input)) {
        // if an exact match exsits in input_names
        // remmove it from our fuzzy search and prepend
        // it to the search results
        const search_index = names.indexOf(search_input)
        if (search_index !== -1) {
          names.splice(search_index, 1)
        }

        names = [search_input, ...names]
      }

      return names
    }
  },

  mounted: function () {
    const self = this;

    self.current_date = new Date()
    const date_now = moment(self.current_date)
    const checkin_date = date_now.add(48, 'h').toDate();
    const checkout_date = date_now.add(96 , 'h').toDate();
    self.dates = [checkin_date, checkout_date]

    const on_destinations_loaded = async (destinations_data) => {
      // await sleep(10000); // simulate json load delay
      // console.log('DESINATIONS JSON LOADED')
      // console.log('DATA LENGTH', destinations.length)
      // console.log("DEST-RAW-DATA", destinations_data);
      const [names, dest_mappings] = self.unpack_destinations(
        destinations_data
      )

      self.destination_names = names
      self.destination_mappings = dest_mappings
      // console.log('MAPPING', self.destination_mappings)
      self.destinations_loaded = true;
    }

    // console.log('NODE ENV', process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'test') {
      /*
      load destinations.js using fs if we're doing unit tests
      on vue-cli-service. The reason we need to do this instead
      of just using dynamic imports is because dynamic imports
      are a webpack feature, and the vue test code is actually
      running on node.js instead of on the browser
      */
      // console.log('RUNNING ON: NODEJS')
      const fs = require('fs');
      const path = require('path');

      const fs_read_handler = (err, data) => {
        if (err) { throw err; }
        data = JSON.parse(data)
        on_destinations_loaded(data);
      }

      const load_path = '../assets/destinations_flat.json'
      const abs_load_path = path.resolve(__dirname, load_path)
      fs.readFile(abs_load_path, 'utf8', fs_read_handler)

    } else {
      /*
      load destinations.js using dynamic webpack imports
      if we're actually running the website
      */
      // console.log('RUNNING ON: BROWSER')
      const loader = import('../assets/destinations_flat.json')
      loader.then(on_destinations_loaded);
      loader.catch(err => {
        console.log("LOAD ERR", err)
      })
    }

    (async () => {
      // continually set current date
      // and check if the selected dates in the datepicker
      // are still valid, and remove the date selection
      // if they are no longer valid
      while (true) {
        await sleep(5 * 1000);
        const date_now = new Date()
        if (date_now > self.current_date) {
          // im only putting it in a if condition
          // so that this doesn't interfere with the testing
          // code to inject arbitary dates in the future
          self.current_date = date_now
        }

        if (!self.dates_are_valid) {
          // clear the UI date selection if it doens't
          // meet our requirements
          self.dates = []
        }

        // get timezone offset in minutes from UTC+0
        const utc_offset = READ_UTC_OFFSET()
        if (utc_offset !== UTC_OFFSET) {
          // refresh the page if local timezone has changed
          // https://stackoverflow.com/questions/50849770
          window.location.reload()
        }
      }
    })();

    const cards_holder = $(self.$refs.cards_holder)
    self.card_holder_width = cards_holder.width()
    // console.log('HOLER WIDTH', self.card_holder_width)
    self.preload_cards()

    $(window).resize(() => {
      self.card_holder_width = cards_holder.width()
    });

    (async () => {
      /*
      this while loop will wait for hotel cards to render
      so that we can reocrd their width
      */
      while (true) {
        await sleep(100);
        if (self.$refs.cards === undefined) {
          continue;
        } else if (self.$refs.cards.length === 0) {
          continue;
        }

        // console.log('CARDS', self.$refs.cards)
        const card = self.$refs.cards[0].$el
        // get width (+horizontal margin) taken by card
        self.card_width = $(card).outerWidth(true)
        // console.log('WIDTH', self.card_width)
        self.preload_cards()
        break
      }
    })();

    (async () => {
      /*
      this while loop will wait for hotel cards to render
      so that we can reocrd their width
      */
      while (true) {
        await sleep(100);
        const document_height = $(document).height()
        const window_height = $(window).height()
        const end_bar_height = $(self.$refs.end_bar).height()
        const content_height = document_height - end_bar_height

        // console.log('DOC HEIGHT', document_height)
        // console.log('WINDOW HEIGHT', window_height)
        // console.log('BAR HEIGHT', end_bar_height)

        if (content_height > window_height) {
          self.scrollable = true
        } else {
          self.scrollable = false
        }
      }
    })();

    // console.log("mount complete")
  },

  computed: {
    guests_validation_error() {
      if (!this.num_guests_has_error) { return '' }
      if (!Number.isInteger(this.num_guests)) {
        return 'Please enter a whole number'
      }

      const search_range = `1 and ${this.max_num_guests}`
      return `Guests must be a number between ${search_range}`
    },

    num_guests_has_error() {
      return !this.is_valid_guests(this.num_guests)
    },

    search_success() {
      return (
        (this.load_error === false) &&
        (this.is_loading === false) &&
        (this.searched_num_guests !== 0) &&
        (this.searched_num_rooms !== 0) &&
        (this.searched_dates.length === 2)
      )
    },

    search_params_info() {
      let dates = [new Date(), new Date()]
      if (this.dates_are_valid) {
        dates = this.dates
      }

      const [start_date, end_date] = this.searched_dates
      const start_date_str = moment(start_date).format('DD-MM-YYYY');
      const end_date_str = moment(end_date).format('DD-MM-YYYY');
      const date_info = `${start_date_str} to ${end_date_str}`
      
      const rooms = this.searched_num_rooms
      const guests = this.searched_num_guests * rooms
      let rooms_text, guests_text;

      if (rooms > 1) { rooms_text = `${rooms} rooms` }
      else { rooms_text = `${rooms} room` }
      if (guests > 1) { guests_text = `${guests} guests` }
      else { guests_text = `${guests} guest` }

      const guests_info = `${rooms_text}, ${guests_text}`
      const status = `${date_info}\n${guests_info}`
      return status
    },
    date_info() {
      let dates = [new Date(), new Date()]
      if (this.dates_are_valid) {
        dates = this.dates
      }

      const [start_date, end_date] = this.searched_dates
      const start_date_str = moment(start_date).format('DD/MM/YYYY');
      const end_date_str = moment(end_date).format('DD/MM/YYYY');
      const date_info = `${start_date_str} – ${end_date_str}`
      return date_info
    },
    guests_info() {
      const rooms = this.searched_num_rooms
      const guests = this.searched_num_guests * rooms
      let rooms_text, guests_text;

      if (rooms > 1) { rooms_text = `${rooms} rooms` }
      else { rooms_text = `${rooms} room` }
      if (guests > 1) { guests_text = `${guests} guests` }
      else { guests_text = `${guests} guest` }

      const guests_info = `${rooms_text}, ${guests_text}`
      return guests_info
    },

    rooms_valid() {
      return this.allowed_room_choices.includes(this.num_rooms)
    },
    allowed_room_choices() {
      return Array.from(
        {length: this.max_num_rooms}, (_, i) => i + 1
      )
    },

    authenticated() {
      return this.$store.getters.authenticated
    },

    dates_are_valid() {
      if (this.dates.length !== 2) { return false }
      const start_date = this.dates[0]
      if (this.should_exclude_date(start_date)) { return false }
      return true
    },

    allow_search() {
      if (!this.is_valid_guests(this.num_guests)) {
        // console.log('BAD-GEUSTS', this.num_guests)
        return false
      }

      // console.log('BAD-F', this.rooms_valid, this.dates_are_valid)

      if (!this.rooms_valid) { return false }
      if (!this.dates_are_valid) { return false }
      const mappings = this.destination_mappings;
      if (!mappings.hasOwnProperty(this.destination_input)) {
        // console.log('MAP-FAIL', mappings, this.destination_input)
        return false;
      }

      const dest_id = mappings[this.destination_input]
      const params_match = this.search_params_match(
        dest_id, this.dates, this.num_guests, this.num_rooms,
        this.destination_input
      )
      if (params_match && (this.load_error === false)) {
        // skip search if we already searched
        // the same destination previously already
        // successfully (i.e. no errors) and in the same
        // booking date range and same number of guests 
        // and same number of rooms as previously as well
        return false;
      }

      return true;
    },

    show_load_status() {
      return (
        this.load_error || this.is_loading ||
        (this.last_dest_id !== null)
      )
    },

    status_text() {
      if (this.load_error) {
        return LOAD_FAIL_MSG
      } else if (this.is_loading) {
        return "loading hotels"
      }
    
      const dest_name = this.destination
      // console.log('DESTNAME', dest_name)
      return dest_name
    },

    full_bleed() {
      return (
        (this.hotels.length === 0) &&
        (this.hotels_loaded.length === 0) &&
        !this.hotels_searched_before
      )
    },

    all_hotels_loaded() {
      console.log(
        'H_LOADED', this.hotels.length, this.hotels_loaded.length
      );
      return (
        this.hotels.length ===
        this.hotels_loaded.length
      )
    },

    search_empty_message() {
      if (this.destinations_loaded) {
        return 'No results found'
      } else {
        return 'Loading avaliable desinations...'
      }
    },

    filtered_search_matches() {
      return this.fuzzy_search(
        this.destination_input, this.destination_names,
        this.num_suggestions
      );
    },

    is_destination_valid() {
      return this.destination_mappings.hasOwnProperty(
        this.destination_input
      )
    }
  },

  components: {
    HotelCard
  }
}
</script>

<style lang="scss">
input {
  font-family: 'Open Sans', sans-serif !important;
}
</style>

<style lang="scss" scoped>
* {
  font-family: 'Open Sans', sans-serif;
}

.homepage.full-bleed {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

@keyframes fadeInScaleUp {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

div#status-bar-wrapper {
  /* Apply transition to transform property */
  animation: fadeInScaleUp 0.2s ease-in forwards;
}

div#end-bar {
  margin-bottom: 3rem;
  display: flex;

  & > a {
    width: auto;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Babas Neue';
    font-size: 2rem;
    color: #e5d390;

    &:hover {
      color: #7a7561;
    }
  }
}

div.label-header {
  display: flex;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  
  & > p {
    font-family: 'Babas Neue';
    color: #555;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 1.2rem;
  }

  & > div.line {
    background-color: #555;
    height: 0.1rem;
    flex-grow: 1;
    margin-top: auto;
    margin-bottom: auto;
  }
}

hr {
  background-color: #EEE;
  margin: 0px;
}

div#front-wrapper {
  background-image: url(
    "../assets/alena-aenami-serenity-1k.jpg"
  );

  background-size: cover;
  background-repeat: no-repeat;

  & div.blur-background {
    width: 100%;
    backdrop-filter: sepia(0.8);
    /* z-index: 100; */
    opacity: 0.9;
    height: 100%;
  }

  &.full-bleed {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-grow: 1;
  }
}

div#front-cover {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding-top: 4rem;
  padding-bottom: 4rem;
  padding-left: 14%;
  padding-right: 14%;
  width: 100%;

  @media screen and (max-width: 1024px) {
    padding-top: 2.5rem;
    flex-direction: column;
    padding-left: 7%;
    padding-right: 7%;
  }

  & > div.description-wrapper {
    flex-grow: 1;
    display: flex;

    & > div.description {
      margin-bottom: auto;
      margin-top: auto;

      & button#signup {
        margin-left: 0.5rem;
      }

      & button#login {
        margin-left: 0.1rem;
      }

      & > p#short-info {
        text-align: left;
        margin-bottom: 0rem;
        $highlight: rgba(233,246,244, 0.8);

        @media screen and (max-width: 1024px) {
          text-align: center;
        }

        & > span {
          // website description text passive highlight
          background-color: $highlight;
          line-height: 0px;
          box-shadow: 10px 0 0 $highlight, -10px 0 0 $highlight;
          backdrop-filter: blur(5px);
          padding-top: 0.2rem;
          padding-bottom: 0.2rem;

          -webkit-box-decoration-break: clone;
          -moz-box-decoration-break: clone; 
          box-decoration-break: clone;
        }
      }

      & > h1 {
        font-family: "Babas Neue";
        text-align: left;
        line-height: 5rem;
        font-size: 5rem;
        margin-bottom: 1rem;
        max-width: 40rem;

        @media screen and (max-width: 1024px) {
          max-width: none;
          text-align: center;
          font-size: 4rem;
          line-height: 4rem;
        }
      }

      & > div.buttons {
        margin-top: 2rem;
        @media screen and (max-width: 1024px) {
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  & > div.search-options {
    width: 28rem;
    border-radius: 4px;
    z-index: 10;
    flex-shrink: 0;
    flex-grow: 1;

    height: fit-content;
    margin-top: auto;
    margin-bottom: auto;    
    margin-left: 11%;
    margin-right: 0px;

    @media screen and (max-width: 1024px) {
      // width: 16rem;
      // flex-shrink: 1;
      max-width: 20rem;
      padding: 0.5rem;

      margin-left: auto;
      margin-right: auto;
      background-color: rgba(255, 255, 255, 0.9);
      margin-top: 2rem;
    }
    
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    border: #DDD solid 0.1rem;
    padding: 2rem;
    flex-grow: 0.2;

    * .searchbox {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    & div.mid-buffer {
      margin-left: 0.5rem !important;
    }

    & #rooms-field {
      width: 80%;
    }

    & #guests-field {
      width: 100%;
    }
  }
}

div#hotel-cards {
  padding-left: 5rem;
  padding-right: 5rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  background-color: white;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media screen and (max-width: 1024px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  & > .card {
    margin: 1rem;
    cursor: pointer;

    & img.card-image {
      // preserve aspect ratio for card images
      object-fit: cover;
    }

    & > .card-content > div.content {
      text-overflow: ellipsis;
      max-height: 19rem;
      overflow-y: scroll;
      padding-right: 0.5rem;
    }
  }
}

div#hotel-load-status {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  /* backdrop-filter: sepia(0.8); */
  backdrop-filter: grayscale(0.5);

  & div.blur-background {
    background-color: #f3eee0;
    grid-row: 1;
    grid-column: 1;
  }

  justify-content: center;
  flex-wrap: wrap;

  & > div#status {
    grid-row: 1;
    grid-column: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
    z-index: 1;

    & > p#status-text {
      font-family: 'Babas Neue';
      font-size: 2rem;
      white-space: pre-wrap;
      word-break: break-all;
      text-align: center;

      &:empty::before {
        // allow paragraph elemenet to have height
        // even when it has no content
        content:"";
        display:inline-block;
      }
    }

    & > p#search-params {
      white-space: pre-wrap;
      word-break: break-all;
      text-align: center;
      display: flex;
      justify-content: center;

      & > .search-taglist {
        display: flex;
        justify-content: center;
      }

      & > .search-tag {
        margin: auto;
      }
    }

    & > #spinner {
      margin-top: 0.5rem;
      margin-left: auto;
      margin-right: auto;
      width: fit-content;
    }
  }

  &.bland {
    & div.blur-background {
      background-color: #e7e6d5;
    }
  }
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

p.address {
  margin-bottom: 0.2rem;
}

a {
  color: #42b983;
}
</style>