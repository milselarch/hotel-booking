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
            <router-link to="/">Home</router-link>
          </b-navbar-item>
          <b-navbar-item href="#">
            <router-link to="/about">About Us</router-link>
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
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Open Sans', sans-serif;
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

@font-face {
  font-family: "Babas Neue";
  src:
    url("./assets/fonts/babas_neue.ttf") format("truetype");
    /* Add other formats as you see fit */
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  font-size: 5rem;
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