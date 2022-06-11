<template>
  <div id="app">
    <b-navbar id="main-navbar">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/wdssvw2kkzjjiagwckjf"
            alt="Lightweight UI components for Vue.js based on Bulma"
          >
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <b-navbar-item href="#">
            Home
          </b-navbar-item>
          <b-navbar-item href="#">
            About Us
          </b-navbar-item>
          <b-navbar-item href="#">
            Features
          </b-navbar-item>
          <b-navbar-item href="#">
            Contact
          </b-navbar-item>
        </b-navbar-item>
      </template>
    </b-navbar>

    <router-view/>
    <router-link to="/about"><p>About</p></router-link>
    <router-link to="/"><p>Home</p></router-link>

    <section>
      <b-field label="Search for a Destination" id="searchbox">
        <b-autocomplete
          v-model="destination"
          :data="filteredDataArray"
          placeholder="e.g. tioman island"
          clearable
          @select="option => selected = option">
          <template #empty>No results found</template>
        </b-autocomplete>
      </b-field>
    </section>

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
import destinations from './assets/destinations.json'
import fuzzysort from 'fuzzysort'
import sleep from 'await-sleep'
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      destinationNames: [], // array of destination names
      destinationMappings: {}, // map destination name to ID
      hotels: {},
      selected: null,
      destination: ''
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
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Open Sans', sans-serif;
}

#searchbox {
  width: 50rem;
  margin-left: auto;
  margin-right: auto;
}

div#hotel-cards {
  padding: 5rem;
  background-color: red;
}

@font-face {
  font-family: "Open Sans";
  src:
    url("./assets/fonts/open_sans.ttf") format("truetype");
    /* Add other formats as you see fit */
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;

  & > nav#main-navbar.navbar {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    padding: 1rem;
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

a {
  color: #42b983;
}
</style>