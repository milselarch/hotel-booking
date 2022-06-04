<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>

    <br/>
    <section>
      <b-field label="Find a name" id="searchbox">
        <b-autocomplete
          v-model="name"
          :data="filteredDataArray"
          placeholder="e.g. jQuery"
          icon="magnify"
          clearable
          @select="option => selected = option">
          <template #empty>No results found</template>
        </b-autocomplete>
      </b-field>
    </section>
  </div>
</template>

<script>
import destinations from './assets/destinations.json'
import fuzzysort from 'fuzzysort'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      destinationNames: [],
      name: '',
      selected: null
    }
  }, 
  mounted: function () {
    const destinationNames = []
    for (let destination of destinations) {
      // console.log(destination)
      this.destinationNames.push(destination["term"])
    }
  },
  computed: {
    filteredDataArray() {
      const results = fuzzysort.go(this.name, this.destinationNames)
      if ((results.length) === 0) { return [] }
      
      const names = []
      const length = Math.min(results.length, 100)
      for (let k=0; k<length; k++) {
        console.log(k, results[k])
        names.push(results[k]['target'])
      }
      return names
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Open Sans', sans-serif;
}

#searchbox {
  width: 20rem;
  margin-left: auto;
  margin-right: auto;
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
  margin-top: 60px;
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
