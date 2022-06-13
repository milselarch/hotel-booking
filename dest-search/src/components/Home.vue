<template>
  <div id="home">
    <b-modal v-model="loginModalActive" :width="640" scroll="keep">
      <Login/>
    </b-modal>

    <b-modal v-model="signupModalActive" :width="640" scroll="keep">
      <SignUp/>
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
              @click="loginModalActive = true"
            >
              Login
            </b-button>
            <b-button 
              type="is-primary" id="signup" outlined
              @click="signupModalActive = true"
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
              <template #empty>No results found</template>
            </b-autocomplete>
          </b-field>

          <b-field class="searchbox" label="Name">
            <b-input value="Kevin Garvey"></b-input>
          </b-field>
        </section>
      </div>

    </div>

    {{ isDestinationValid }}

    <div id="hotel-cards">
      <div
        class="card" style="width: 20rem" 
        v-for="(hotel, key) in hotels" v-bind:key="key"
      >
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="hotel['image_url']" alt="Placeholder image">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ hotel['name'] }}</p>
            </div>
          </div>

          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus nec iaculis mauris.
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import destinations from '@/assets/destinations.json'
import fuzzysort from 'fuzzysort'
import sleep from 'await-sleep'
import axios from 'axios'

import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'

export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      destinationNames: [], // array of destination names
      destinationMappings: {}, // map destination name to ID
      hotels: {},
      selected: null,
      destination: '',

      loginModalActive: false,
      signupModalActive: false
    }
  },
  methods: {
    async loadHotels() {
      const baseUrl = "https://hotelapi.loyalty.dev/api/hotels"
      const destinationID = this.destinationMappings[
        this.destination
      ]

      try {
        const response = await axios.get(baseUrl, {
          params: {destination_id: destinationID}
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted: function () {
    for (let destination of destinations) {
      // console.log(destination)
      const destinationID = destination["uid"]
      const destinationName = destination["term"]
      this.destinationNames.push(destinationName)
      this.destinationMappings[destinationName] = destinationID
    };

    const baseSearchURL = "https://hotelapi.loyalty.dev/api/hotels";
    const self = this;

    (async () => {
      let lastDestID = null;

      while (true) {
        await sleep(100);
        if (!self.isDestinationValid) {
          continue
        } else if (self.destinationID === lastDestID) {
          continue
        }

        lastDestID = self.destinationID;
        
        try {
          const response = await axios.get(baseSearchURL, {
            params: {destination_id: self.destinationID}
          })
        } catch (error) {
          console.error(error)
        }
      }
    })();

    console.log("mount complete")
  },
  computed: {
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

div#front-cover {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin-top: 3rem;
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
  background-color: red;
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

a {
  color: #42b983;
}
</style>