<template>
  <div id="home">
    <b-modal v-model="modalActive" :width="640" scroll="keep">
      <Login 
        v-show="loginModalActive" @open-signup="openSignup()"
      />
      <SignUp 
        v-show="signupModalActive" @open-login="postSignup"
      />
    </b-modal>

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
          <div class="buttons">
            <b-button 
              type="is-primary" id="login" outlined
              @click="openLogin()"
            >
              Login
            </b-button>
            <b-button 
              type="is-primary" id="signup" outlined
              @click="openSignup()"
            >
              Sign Up
            </b-button>
          </div>
        </div>
      </div>

      <div class="search-options">
        <section>
          <b-field label="Search for a Destination" class="searchbox">
            <b-autocomplete
              v-model="destination"
              :data="filteredDataArray"
              placeholder="e.g. tioman island"
              clearable
              @select="option => selected = option">
              <template #empty>{{ searchEmptyMessage }}</template>
            </b-autocomplete>
          </b-field>

          <b-field class="searchbox" label="Name">
            <b-input value="Kevin Garvey"></b-input>
          </b-field>
        </section>
      </div>

    </div>

    <div 
      v-infinite-scroll="render_more_hotels" 
      infinite-scroll-disabled="allHotelsLoaded"
      infinite-scroll-distance="10"
      id="hotel-cards" ref="cards_holder"
      v-bind:class="{ bland: isDestinationValid }"
    >
      <div id="status" v-show="show_load_status">
        <p id="status-text">{{ statusText }}</p>
        <square id="spinner" v-show="isLoading"></square>
      </div>

      <div
        class="card" style="width: 20rem" 
        v-for="(hotel, key) in hotelsLoaded" v-bind:key="key"
        ref="cards" @click="selectHotel(hotel)"
      >
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="build_image_url(hotel)"
            class="card-image" 
            @error="replace_default_image"
            alt="Hotel image not found">
          </figure>
        </div>

        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ hotel['name'] }}</p>
            </div>
          </div>

          <p class="address subtitle is-6">
            {{ hotel['address'] }}
          </p>

          <b-rate 
            v-model="hotel['rating']" :disabled="true"
            :spaced="true"
          />

          <div class="content clipped" >
          </div>
        </div>
      </div>
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
import sleep from 'await-sleep'
import axios from 'axios'
import $ from 'jquery'
import _ from 'lodash'

import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'
import BLANK_IMAGE from "@/assets/image_not_found.png"
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
      cardWidth: null,
      cardHolderWidth: null,
      cardsPreloaded: false,

      isLoading: false,
      loadError: false,

      modalActive: false,
      loginModalActive: false,
      signupModalActive: false,
      scrollable: false
    }
  },
  methods: {
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

      console.log(self.cardHolderWidth, self.cardWidth, smartLoading)

      if (smartLoading) {
        const numHotelsLoaded = self.hotelsLoaded.length;
        const cardsPerRow = Math.max(1, Math.floor(
          self.cardHolderWidth / self.cardWidth
        ))

        numToLoad += cardsPerRow - (
          (numHotelsLoaded + numToLoad) % cardsPerRow
        )
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

    replace_default_image(e) {
      /*
      load the image not found image if the original
      hotel image fails to load. We need this because
      theres a lot of hotels where the image provided
      actually does not exist in the server
      */
      // https://stackoverflow.com/questions/39009538
      if (e.target.src === BLANK_IMAGE) { return; }
      e.target.src = BLANK_IMAGE;
    },
    build_image_url(hotel_data) {
      const image_details = hotel_data.image_details;
      const prefix = image_details.prefix;
      const image_no = hotel_data.default_image_index;
      const suffix = image_details.suffix;

      const image_count = hotel_data.imageCount;
      if (image_count === 0) {
        return BLANK_IMAGE;
      }

      return `${prefix}${image_no}${suffix}`
    },

    async load_hotels(dest_id) {
      const self = this;
      self.isLoading = true;
      self.hotelsLoaded = [];
      self.loadError = false;
      self.hotels = []

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

      const price_endpoint = `mocklabs/destinations/${dest_id}/prices`
      // pricing api has missing destinations (e.g. TXQ5)
      // [Aswan Dam, Aswan, Egypt] - TXQ5 fails for example
      const price_request = axios.get(price_endpoint)
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
          return -(hotel1['rating'] - hotel2['rating'])
        })

        self.hotelsLoaded = []
        self.render_more_hotels();
      } catch (error) {
        self.loadError = true;
        console.error(error);
      }

      self.isLoading = false;
    },

    openSignup() {
      this.loginModalActive = false;
      this.signupModalActive = true;
      this.modalActive = true;
    },

    postSignup(name) {
      const escaped_name = _.escape(name)
      this.$buefy.toast.open({
        duration: 5000,
        message: `Welcome  to Ascenda, ${escaped_name}!`,
        type: 'is-success',
        pauseOnHover: true
      });

      this.openLogin();
    },

    openLogin() {
      this.loginModalActive = true;
      this.signupModalActive = false;
      this.modalActive = true;
    }
  },
  mounted: function () {
    const self = this;

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
      let last_dest_id = null;

      while (true) {
        await sleep(100);
        if (!self.isDestinationValid) {
          continue
        } 
        
        const dest_id = self.destinationMappings[self.destination]
        if (last_dest_id === dest_id) {
          continue
        }

        last_dest_id = dest_id;
        console.log('DESTID', dest_id)
        await self.load_hotels(dest_id)
      }
    })();

    const cardsHolder = $(self.$refs.cards_holder)
    self.cardHolderWidth = cardsHolder.width()
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
        
        const card = self.$refs.cards[0]
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
    show_load_status() {
      return this.loadError || this.isLoading
    },

    statusText () {
      if (this.loadError) {
        return "failed to load hotels\n●︿●"
      } else if (this.isLoading) {
        return "loading hotels"
      }

      return ""
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
        this.destination, this.destinationNames
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
        this.destination
      )
    }
  },

  components: {
    Login, SignUp
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: 'Open Sans', sans-serif;
}

div#end-bar {
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: flex;

  & > a {
    width: auto;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Babas Neue';
    font-size: 2rem;
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
    width: 30rem;
    margin-left: 0rem;
    margin-right: 10%;
    background: #EEE;
    padding: 2rem;
    flex-grow: 0.2;

    * .searchbox {
      width: 20rem;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

div#hotel-cards {
  padding: 5rem;
  background-color: beige;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  &.bland {
    background-color: #e7e6d5;
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

  & > div#status {
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > p#status-text {
      font-family: 'Babas Neue';
      font-size: 2rem;
      white-space: pre-wrap;
      text-align: center;
    }

    & > #spinner {
      margin-top: 0.5rem;
      margin-left: auto;
      margin-right: auto;
      width: fit-content;
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