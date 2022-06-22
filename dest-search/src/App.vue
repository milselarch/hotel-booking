<template>
  <div id="app">
    <b-navbar
      id="main-navbar" fixed-top
    >
      <template #brand>
        <b-navbar-item 
          tag="router-link" :to="{ path: '/' }"
        >
          <img
            src="./assets/ascenda_logo.svg"
            alt="Ascenda hotels"
            class="inverted"
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

::-webkit-scrollbar {
  width: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8bbbf;
}

/*
div.card-content > div.content.clipped p {
  background-color: beige;
  text-overflow:ellipsis;
  overflow:hidden;
  // Addition lines for 2 line or multiline ellipsis
  display: -webkit-box !important;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  white-space: normal;
}
*/

br {
  clear: both;
}

img.inverted {
  filter: invert(100%);
}

hr {
  background-color: #AAA;
}

p.help {
  // error message font size for login / signup forms
  font-size: 0.9rem;
}

div.spinner {
  margin: 0px !important;
}

button.title-button > span {
  font-family: 'Babas Neue';
  font-size: 5rem;
}

button.fat-button {
  padding-left: 3rem;
  padding-right: 3rem;
  padding-top: 1.4rem;
  padding-bottom: 1.4rem;
  margin-bottom: 2rem;
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

    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    /*
    backdrop-filter: blur(20px) saturate(160%) contrast(45%) brightness(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%) contrast(45%) brightness(160%);
    */
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