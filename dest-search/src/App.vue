<template>
  <div id="app">
    <b-navbar
      id="main-navbar" fixed-top
    >
      <template #brand>
        <b-navbar-item 
          tag="router-link" :to="{ path: '/' }"
          class="nav-group"
        >
          <img
            src="./assets/ascenda_logo.svg"
            alt="Ascenda hotels"
            class="inverted"
          >
        </b-navbar-item>
      </template>

      <template #start>
        <div class="nav-group"></div>
      </template>

      <template #end>
        <b-navbar-item tag="div" class="nav-group">
          <b-navbar-item href="#">
            <router-link to="/">Home</router-link>
          </b-navbar-item>
          <b-navbar-item href="#">
            <router-link to="/about">About Us</router-link>
          </b-navbar-item>
          <b-navbar-item href="#">
            Features
          </b-navbar-item>
          
          <b-navbar-item
            tag="div" id="profile-icon"
          >
            <section>
              <b-dropdown aria-role="list" position="is-bottom-left">
                <template #trigger>
                  <b-button
                    type="is-dark" icon-pack="far" 
                    :disabled="!authenticated"
                    icon-right="user" outlined
                  />
                </template>
                
                <b-dropdown-item
                  aria-role="listitem"
                  v-show="!authenticated"
                >
                  Login
                </b-dropdown-item>
                <b-dropdown-item
                  aria-role="listitem"
                  v-show="!authenticated"
                >
                  Register
                </b-dropdown-item>

                <b-dropdown-item
                  aria-role="listitem"
                  v-show="authenticated"
                >
                  Profile
                </b-dropdown-item>
                <b-dropdown-item 
                  v-show="authenticated"
                  aria-role="listitem"
                >
                  Logout
                </b-dropdown-item>
                <b-dropdown-item 
                  aria-role="listitem"
                  @click="auth_test"
                >
                  auth test
                </b-dropdown-item>
              </b-dropdown>

            </section>
          </b-navbar-item>
          
        </b-navbar-item>
      </template>
    </b-navbar>

    <keep-alive include="Home">
      <router-view id="router-view"/>
    </keep-alive>
  </div>
</template>

<script>
import axios from 'axios'
import AuthRequester from './AuthRequester'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },

  methods: {
    async auth_test() {
      const auth_token = this.$store.state.Persistent.auth_token
      const requester = new AuthRequester(this)
      let authenticated = false
      let response

      try {
        response = await requester.get('auth_test')
        authenticated = true
      } catch (error) {
        response = error.response
        console.log('ERR', error)
      }

      console.log(response)
      let toast_type, message;
      const status_code = response.status

      if (authenticated) {
        toast_type = 'is-dark'
        message = 'auth endpoint success'
      } else {
        toast_type = 'is-danger'
        message = `auth endpoint failed - ${status_code}`
      }

      this.$buefy.toast.open({
        duration: 5000,
        message: message,
        type: toast_type,
        pauseOnHover: true
      });
    }
  },

  computed: {
    authenticated() {
      return this.$store.getters.authenticated
    },
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Open Sans', sans-serif;
}

body {
  padding: 0px;
  display: flex;
  margin: 0px;
}

body > div#app > #router-view {
  padding: 0px;
  float: top;
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

a.dropdown-item {
  font-size: 1rem;
}

.hidden {
  visibility: hidden;
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

* {
  box-sizing: border-box;
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

    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-bottom: 0.1rem solid #333;
    box-sizing: border-box !important;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    /*
    backdrop-filter: blur(20px) saturate(160%) contrast(45%) brightness(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%) contrast(45%) brightness(160%);
    */

    /*
    & div.navbar-menu, & div.navbar-brand {
      border-bottom: 10.1rem solid #333;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
    }
    */

    & .nav-group {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;

      /*
      border-bottom: 10.1rem solid #333;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      */
    }

    & #profile-icon {
      margin-left: 0rem;
    }
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