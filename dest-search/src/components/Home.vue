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
          <b-field label="Destination & Hotel Booking Details"
            class="searchbox"
          >
            <b-autocomplete
              v-model="destinationInput"
              :data="filteredDataArray"
              placeholder="Search Destination e.g. tioman island"
              clearable icon="search-location"
              :disabled="isLoading"
              @select="option => selected = option">
              <template #empty>{{ searchEmptyMessage }}</template>
            </b-autocomplete>
          </b-field>

          <b-field>
            <b-input placeholder="Number of guests"
              type="number" icon="user" 
              v-model.number="num_guests"
              min="1" :max="max_num_guests" default="1"
              pattern="[0-9]+" required
              :disabled="isLoading"
            >
            </b-input>
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
              :icon-right="dates_are_valid ? 'check': ''"
              :unselectable-dates="should_exclude_date"
              :disabled="isLoading"
              range>
            </b-datepicker>
          </b-field>

          <b-button
            type="is-dark" expanded outlined
            @click="begin_search"
            :disabled="!allow_search || isLoading"
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
      v-bind:class="{ bland: isDestinationValid }"
      id="hotel-load-status"
    >
      <div id="status" v-show="true">
        <p id="status-text">{{ statusText }}</p>
        <square id="spinner" v-show="isLoading"></square>
      </div>
    </div>

    <div
      id="hotel-cards" ref="cards_holder"
      v-infinite-scroll="render_more_hotels" 
      infinite-scroll-disabled="allHotelsLoaded"
      infinite-scroll-distance="100"
    >
      <HotelCard
        class="card" style="width: 20rem" 
        v-for="(hotel, key) in hotelsLoaded" v-bind:key="key"
        @click.native="selectHotel(hotel)"
        ref="cards" :hotel="hotel"
      />
    </div>

    <div
      id="end-bar" v-show="allHotelsLoaded && scrollable"
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


export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      destinationsLoaded: false,
      destinationNames: [], // array of destination names
      destinationMappings: {}, // map destination name to ID
      
      hotels: [],
      hotelsLoaded: [],
      selected: null,
      destination: '',
      destinationInput: '',
      cardWidth: null,
      cardHolderWidth: null,
      cardsPreloaded: false,

      num_guests: 1,
      searched_num_guests: null,
      max_num_guests: 20,
      current_date: new Date(),
      searched_dates: [],
      dates: [],

      isLoading: false,
      loadError: false,
      lastDestID: null,
      beginSearch: false, 
      // whether or not we should send a request 
      // to the backend to search for hotels

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
      console.log('STORE', self.$store);
      console.log(self.x, self.y)
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
      if (!this.allow_search) {
        return false;
      }
      
      this.destination = this.destinationInput;
      this.beginSearch = true;
      return true;
    },

    selectHotel(hotel) {
      console.log('SELECTED', hotel, hotel['id'])
      router.push({
        path: `/hotels/${hotel['id']}`
      })
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    preloadCards() {
      if (
        (self.cardWidth === null) ||
        (self.cardHolderWidth === null) ||
        (self.cardsPreloaded === true)
      ) {
        return false;
      }

      this.render_more_hotels()
      this.cardsPreloaded = true
      return true
    },

    render_more_hotels() {
      /*
      loads hotel cards such the entirety
      of the last row is filled. 
      */
      const self = this;
      let smartLoading = true;
      let numToLoad = 9;
      
      if (
        (self.cardWidth === null) ||
        (self.cardHolderWidth === null)
      ) {
        smartLoading = false;
      }

      /*
      console.log(
        'LOAD', self.cardHolderWidth, self.cardWidth, smartLoading
      )
      */

      if (smartLoading) {
        const numHotelsLoaded = self.hotelsLoaded.length;
        const cardsPerRow = Math.max(1, Math.floor(
          self.cardHolderWidth / self.cardWidth
        ))

        // console.log('LOADP', numHotelsLoaded, numToLoad)

        // round off the number of hotel cards to load
        // so that it fills up the entirety of the last row
        numToLoad += cardsPerRow - (
          (numHotelsLoaded + numToLoad) % cardsPerRow
        )
        // console.log('NEWLOAD', numToLoad, cardsPerRow)
        // console.log('LOADH', numHotelsLoaded, numToLoad)
      }

      // let numToLoad = 10;
      // numToLoad = 10

      for (let k=0; k<numToLoad; k++) {
        const hotelIndex = this.hotelsLoaded.length;
        if (hotelIndex >= this.hotels.length) {
          return false;
        }

        this.hotelsLoaded.push(this.hotels[hotelIndex])
      }
    },

    make_price_request(dest_id, dates, num_guests) {
      const [start_date, end_date] = dates
      const start_date_str = moment(start_date).format('YYYY-MM-DD');
      const end_date_str = moment(end_date).format('YYYY-MM-DD');
      console.log('START DATE STR', start_date_str)
      console.log('END DATE STR', end_date_str)

      const price_endpoint = "proxy/hotels/prices"
      // pricing api has missing destinations (e.g. TXQ5)
      // [Aswan Dam, Aswan, Egypt] - TXQ5 fails for example
      const get_params = {
          destination_id: dest_id, partner_id: 1,
          checkin: start_date_str, checkout: end_date_str,
          lang: "en_US", currency: "SGD",
          country_code: "SG", guests: num_guests
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
      }
      
      self.isLoading = true;
      self.hotelsLoaded = [];
      self.loadError = false;
      self.hotels = []

      self.searched_num_guests = self.num_guests
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
        dest_id, dates, self.num_guests
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

        self.hotelsLoaded = []
        self.render_more_hotels();
      } catch (error) {
        self.loadError = true;
        console.error(error);
      }

      self.isLoading = false;
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

    const loader = import('@/assets/destinations.json')
    loader.then(async (destinations) => {
      // await sleep(10000); // simulate json load delay
      // console.log('DESINATIONS JSON LOADED')

      for (let destination of destinations) {
        // console.log(destination)
        const destinationID = destination["uid"]
        const destinationName = destination["term"]
        self.destinationNames.push(destinationName)
        self.destinationMappings[destinationName] = destinationID
      };

      self.destinationsLoaded = true;
    })

    const baseSearchURL = "https://hotelapi.loyalty.dev/api/hotels";

    (async () => {
      /*
      this async loop will load in hotel data from the 
      backend once a valid desination is entered into the
      autocomplete search box
      */

      while (true) {
        await sleep(100);
        if (!self.isDestinationValid) {
          continue
        } 

        const mappings = self.destinationMappings;
        if (!mappings.hasOwnProperty(self.destination)) {
          continue
        } else if (this.beginSearch === false) {
          continue
        }
        
        const dest_id = self.destinationMappings[self.destination]

        self.lastDestID = dest_id;
        console.log('DESTID', dest_id)
        await self.load_hotels(dest_id)
        self.beginSearch = false;
      }
    })();

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
          self.dates = []
        }
      }
    })();

    const cardsHolder = $(self.$refs.cards_holder)
    self.cardHolderWidth = cardsHolder.width()
    console.log('HOLER WIDTH', self.cardHolderWidth)
    self.preloadCards()

    $(window).resize(() => {
      self.cardHolderWidth = cardsHolder.width()
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

        console.log('CARDS', self.$refs.cards)
        
        const card = self.$refs.cards[0].$el
        // get width (+horizontal margin) taken by card
        self.cardWidth = $(card).outerWidth(true)
        console.log('WIDTH', self.cardWidth)
        self.preloadCards()
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
        const documentHeight = $(document).height()
        const windowHeight = $(window).height()
        const endBarHeight = $(self.$refs.end_bar).height()
        const contentHeight = documentHeight - endBarHeight

        // console.log('DOC HEIGHT', documentHeight)
        // console.log('WINDOW HEIGHT', windowHeight)
        // console.log('BAR HEIGHT', endBarHeight)

        if (contentHeight > windowHeight) {
          self.scrollable = true
        } else {
          self.scrollable = false
        }
      }
    })();

    console.log("mount complete")
  },

  computed: {
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
        return false
      }

      if (!this.dates_are_valid) { return false }
      const mappings = this.destinationMappings;
      if (!mappings.hasOwnProperty(this.destinationInput)) {
        return false;
      }

      const dest_id = this.destinationMappings[this.destinationInput]

      if (
        (this.lastDestID === dest_id) &&
        (_.isEqual(this.searched_dates, this.dates)) &&
        (this.searched_num_guests === this.num_guests) &&
        (this.loadError === false)
      ) {
        // skip search if we already searched
        // the same destination previously already
        // successfully (i.e. no errors) and in the same
        // booking date range and same number of guests 
        // as previously as well
        return false;
      }

      return true;
    },

    show_load_status() {
      return (
        this.loadError || this.isLoading ||
        (this.lastDestID !== null)
      )
    },

    statusText () {
      if (this.loadError) {
        return "failed to load hotels\n●︿●"
      } else if (this.isLoading) {
        return "loading hotels"
      }
    
      const dest_name = this.destination
      // console.log('DESTNAME', dest_name)
      return dest_name
    },

    allHotelsLoaded() {
      return (
        this.hotels.length ===
        this.hotelsLoaded.length
      )
    },

    searchEmptyMessage() {
      if (this.destinationsLoaded) {
        return 'No results found'
      } else {
        return 'Loading avaliable desinations...'
      }
    },

    filteredDataArray() {
      const matches = fuzzysort.go(
        this.destinationInput, this.destinationNames
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

    isDestinationValid() {
      return this.destinationMappings.hasOwnProperty(
        this.destinationInput
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
  width: 100%;

  & > div.description-wrapper {
    flex-grow: 1;

    & > div.description {
      margin-left: 20%;
      margin-right: 20%;

      & button#signup {
        margin-left: 0.5rem;
      }

      & button#login {
        margin-left: 0.1rem;
      }

      & > p#short-info {
        text-align: left !important;
        margin-bottom: 2rem;
      }

      & > h1 {
        font-family: "Babas Neue";
        text-align: left !important;
        line-height: 5rem;
        margin-bottom: 1rem;
      }
    }
  }

  & > div.search-options {
    width: 40rem;
    margin-left: 0rem;
    margin-right: 10%;
    background: white;
    border: #DDD solid 0.1rem;
    padding: 2rem;
    flex-grow: 0.2;

    * .searchbox {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
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