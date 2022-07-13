<template>
  <div id="home">
    <div id="front-cover">
      <div class="description-wrapper">
        <div class="description">
          <h1>The Bestest Hotels in the Multiverse</h1>
          <p id="short-info">
            Kaligo co-founders Kyle Armstrong and Sebastian Grobys, 
            both veterans of the lifestyle and loyalty space, have 
            found a way to credit customers up to ten times the volume 
            of miles that can be earned elsewhere. That is for booking 
            the same hotel at the same or similar rates.
          </p>

          <div class="buttons" v-show="!authenticated">
            <b-button 
              type="is-dark" id="login" outlined
              @click="open_login()"
            >
              Login
            </b-button>
            <b-button 
              type="is-dark" id="signup" outlined
              @click="open_signup()"
            >
              Sign Up
            </b-button>
          </div>
        </div>
      </div>

      <div class="search-options">
        <section>
          <b-field label="Destination"
            class="searchbox"
          >
            <b-field>
              <b-autocomplete
                v-model="destination_input"
                :data="filtered_search_matches"
                placeholder="Search Destination e.g. tioman island"
                clearable icon="search-location"
                :disabled="is_loading"
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
              id="guests-field" expanded label="Guests (per room)"
            >
              <b-input placeholder="Guests"
                label="test" ref="guests_input"
                type="number" icon="user" 
                v-model.number="num_guests"

                min="1" :max="max_num_guests" default="1"
                pattern="[0-9]+" required
                :disabled="is_loading"
              >
              </b-input>
            </b-field>

            <div class="mid-buffer"></div>

            <b-field 
              id="rooms-field" expanded label="Rooms"
              :disabled="is_loading"
            >
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

          </b-field>


          <!--
          <b-field class="searchbox" label="Name">
            <b-input value="Kevin Garvey"></b-input>
          </b-field>
          -->

          <b-field label="Check in, Check out dates">
            <b-datepicker
              placeholder="Select check in and checkout dates"
              v-model="dates" 
              icon="calendar"
              :icon-right="dates_are_valid ? 'check': ''"
              :unselectable-dates="should_exclude_date"
              :disabled="is_loading"
              range>
            </b-datepicker>
          </b-field>

          <b-button
            type="is-dark" expanded outlined
            @click="begin_search"
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
      v-bind:class="{ bland: is_destination_valid }"
      id="hotel-load-status"
    >
      <div id="status" v-show="true">
        <p id="status-text">{{ status_text }}</p>
        <square id="spinner" v-show="is_loading"></square>
        <p id="search-params" v-show="search_success"
        >{{ search_params_info }}</p>
      </div>
    </div>

    <div
      id="hotel-cards" ref="cards_holder"
      v-infinite-scroll="render_more_hotels" 
      infinite-scroll-disabled="all_hotels_loaded"
      infinite-scroll-distance="100"
    >
      <HotelCard
        class="card" style="width: 20rem" 
        v-for="(hotel, key) in hotels_loaded" v-bind:key="key"
        @click.native="selectHotel(hotel)"
        ref="cards" :hotel="hotel"
      />
    </div>

    <div
      id="end-bar" v-show="all_hotels_loaded && scrollable"
      ref="end_bar"
    >
      <a v-on:click="scrollToTop()">— Go back to top —</a>
    </div>

  </div>
</template>

<script>
// v-html="hotel['description']"
import fuzzysort from 'fuzzysort'
import moment from 'moment'
import sleep from 'await-sleep'
import assert from 'assert'
import axios from 'axios'
import $ from 'jquery'
import _ from 'lodash'

import HotelCard from '@/components/HotelCard.vue'
import { faL } from '@fortawesome/free-solid-svg-icons'
import router from '../router'

const LOAD_FAIL_MSG = "failed to load hotels\n●︿●";

export default {
  name: 'Home',
  LOAD_FAIL_MSG: LOAD_FAIL_MSG,

  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      destinations_loaded: false,
      destination_names: [], // array of destination names
      destination_mappings: {}, // map destination name to ID
      
      hotels: [],
      hotels_loaded: [],
      selected: null,
      destination: '',
      destination_input: '',
      card_width: null,
      card_holder_width: null,
      cards_preloaded: false,

      search_stamp: 0,
      price_mapping: {},
      pending_search_stamps: [],

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

      scrollable: false,

      x: 0,
      y: 0
    }
  },

  methods: {
    open_login() {
      this.$emit('open-login')  
    },

    open_signup() {
      this.$emit('open-signup')
    },

    load_store() {
      const self = this;
      self.x = self.$store.state.Store.count;
      self.y = self.$store.state.Persistent.persistent_count;
      // console.log('STORE', self.$store);
      // console.log(self.x, self.y)
    },

    fast_forward_date() {
      const date_now = moment(this.current_date)
      const cutoff_date = date_now.add(24, 'h').toDate();
      this.current_date = cutoff_date
    },

    should_exclude_date(date) {
      // prevent days that start less than 12 hours
      // away from the current timestamp
      const date_now = moment(this.current_date)
      const cutoff_date = date_now.add(12, 'h').toDate();
      // console.log('START DATE CMP', cutoff_date, date)
      return cutoff_date > date
    },

    add_x() {
      this.$store.commit('increment')
      this.load_store()
    },

    add_y() {
      this.$store.commit('presist_increment')
      this.load_store()
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
      
      const dest_id = this.destination_mappings[this.destination];
      this.last_dest_id = dest_id;
      // load_hotels is an async method
      this.load_hotels(dest_id)
      assert(this.is_loading)
      return true;
    },

    selectHotel(hotel) {
      console.log('SELECTED', hotel, hotel['id'])
      router.push({
        path: `/hotels/${this.last_dest_id}/${hotel['id']}`
      })
    },

    scrollToTop() {
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

    render_more_hotels() {
      /*
      loads hotel cards such the entirety
      of the last row is filled. 
      */
      const self = this;
      let smart_loading = true;
      let num_to_load = 9;
      
      if (
        (self.card_width === null) ||
        (self.card_holder_width === null)
      ) {
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
    },

    search_params_match(
      dest_id, dates, num_guests, num_rooms
    ) {
      if (
        (this.last_dest_id === dest_id) &&
        (_.isEqual(this.searched_dates, dates)) &&
        (this.searched_num_guests === num_guests) &&
        (this.searched_num_rooms === num_rooms)
      ) {
        // skip price map update if we already searched
        // the same destination previously already
        // successfully (i.e. no errors) and in the same
        // booking date range and same number of guests 
        // and same number of rooms as previously as well
        return true;
      }

      return false
    },

    async load_prices({
      dest_id, dates, num_guests, num_rooms,
      search_stamp
    }) {
      assert(typeof search_stamp === 'number')
      assert(!this.pending_search_stamps.includes(search_stamp))
      this.pending_search_stamps.push(search_stamp)
      let price_resp = {}

      try {
        price_resp = await this.make_price_request(
          dest_id, dates, num_guests, num_rooms
        )
      } catch (e) {
        console.log('PRICING FAIL', search_stamp)
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
        console.log('HOTEL_PRICES', hotel_prices)
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

      const index = this.pending_search_stamps.indexOf(search_stamp);
      if (index !== -1) {
        this.pending_search_stamps.splice(index, 1);
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

    async load_hotels(dest_id) {
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
      
      const price_request = self.make_price_request(
        dest_id, dates, self.num_guests, self.num_rooms
      )
      const hotel_request = axios.get("proxy/hotels", {
        params: {destination_id: dest_id}
      });

      try {
        // wait for both requests to complete
        const [price_resp, hotel_resp] = await Promise.all([
          price_request, hotel_request
        ])
        let response = await hotel_resp;
        console.warn('RESPONSE', price_resp, response)
        console.log('CODE', response.data.status_code)
        if (response.status !== 200) {
          throw response.status_text;
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
        const hotel_mapping = {}
        for (let k=0; k<self.hotels.length; k++) {
          const hotel = self.hotels[k];
          hotel_mapping[hotel.id] = k
        }
        console.log('PRICE_RESP', price_resp)
        const price_data = price_resp.data;
        
        // const price_data = price_resp.data;
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
          console.log('HOTEL_PRICES', hotel_prices)
          console.log('MAPPING', hotel_mapping)
          for (let k=0; k<hotel_prices.length; k++) {
            const hotel_pricing = hotel_prices[k]
            const hotel_id = hotel_pricing.id
            const hotel_index = hotel_mapping[hotel_id]
            if (hotel_index === undefined) {
              // hotel was not found in original hotels response
              continue
            }
            console.log('HOTEL_ID', hotel_id)
            console.log('HOTEL_INDEX', hotel_index)
            self.hotels[hotel_index]['price'] = hotel_pricing.price
            console.log('HOTEL', k, self.hotels[hotel_id])
          }
        }
        self.hotels_loaded = []
        self.render_more_hotels();

      } catch (error) {
        self.load_error = true;
        console.error(error);
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
    }
  },

  mounted: function () {
    const self = this;
    self.load_store();

    self.current_date = new Date()
    const date_now = moment(self.current_date)
    const checkin_date = date_now.add(48, 'h').toDate();
    const checkout_date = date_now.add(96 , 'h').toDate();
    self.dates = [checkin_date, checkout_date]

    const on_destinations_loaded = async (destinations) => {
      // await sleep(10000); // simulate json load delay
      // console.log('DESINATIONS JSON LOADED')
      // console.log('DATA LENGTH', destinations.length)

      for (let destination of destinations) {
        const destinationID = destination["uid"]
        const destinationName = destination["term"]
        self.destination_names.push(destinationName)
        // console.log(destinationName, destinationID)
        self.destination_mappings[destinationName] = destinationID
      };

      // const length = Object.keys(self.destination_mappings).length
      // console.log('LENGTH', length)
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

      const load_path = '../assets/destinations.json'
      const abs_load_path = path.resolve(__dirname, load_path)
      fs.readFile(abs_load_path, 'utf8',fs_read_handler)

    } else {
      /*
      load destinations.js using dynamic webpack imports
      if we're actually running the website
      */
      // console.log('RUNNING ON: BROWSER')
      const loader = import('@/assets/destinations.json')
      loader.then(on_destinations_loaded);
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
        dest_id, this.dates, this.num_guests, this.num_rooms
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

    all_hotels_loaded() {
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
      const matches = fuzzysort.go(
        this.destination_input, this.destination_names
      )
      
      if ((matches.length) === 0) { return [] }
      
      const names = []
      const length = Math.min(matches.length, 50)
      for (let k=0; k<length; k++) {
        // console.log(k, matches[k])
        const destinationName = matches[k]['target'];
        names.push(destinationName)
      }
      return names
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

<style lang="scss" scoped>
* {
  font-family: 'Open Sans', sans-serif;
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

div#front-cover {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin-top: 4rem;
  margin-bottom: 4rem;
  padding-left: 14%;
  padding-right: 14%;
  width: 100%;

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
        text-align: left !important;
        margin-bottom: 0rem;
      }

      & > h1 {
        font-family: "Babas Neue";
        text-align: left !important;
        line-height: 5rem;
        margin-bottom: 1rem;
        max-width: 40rem;
      }

      & > div.buttons {
        margin-top: 2rem;
      }
    }
  }

  & > div.search-options {
    width: 28rem;
    flex-shrink: 0;
    flex-grow: 1;

    height: fit-content;
    margin-top: auto;
    margin-bottom: auto;    
    margin-left: 11%;
    margin-right: 0px;
    
    background: white;
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
      width: 100%;
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
  padding: 2rem;
  background-color: #f3eee0;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > div#status {
    display: flex;
    flex-direction: column;
    justify-content: center;

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
    }

    & > #spinner {
      margin-top: 0.5rem;
      margin-left: auto;
      margin-right: auto;
      width: fit-content;
    }
  }

  &.bland {
    background-color: #e7e6d5;
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