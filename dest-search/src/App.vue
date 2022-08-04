<template>
  <div id="app">
    <b-modal v-model="modal_active" :width="640" scroll="keep">
      <Login 
        v-show="login_modal_active" ref="login_modal"
        @open-signup="open_signup"
        @login-done="on_login_complete"
      />
      <SignUp 
        v-show="signup_modal_active" @open-login="post_signup"
      />
    </b-modal>

    <b-navbar
      id="main-navbar" ref="main_navbar" fixed-top
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
          <!-- <b-navbar-item href="#">
            <router-link to="/about">About Us</router-link>
          </b-navbar-item>
          <b-navbar-item href="#">
            Features
          </b-navbar-item> -->
          
          <b-navbar-item
            tag="div" id="profile-icon"
          >
            <section>
              <b-dropdown
                aria-role="list" position="is-bottom-left"
              >
                <template #trigger>
                  <b-button
                    type="is-dark" icon-pack="far" 
                    v-bind:class="{ off: !authenticated} "
                    :icon-right="authenticated ? 'user' : 'address-card'" 
                    outlined
                  />
                </template>
                
                <b-dropdown-item
                  aria-role="listitem" v-show="!authenticated"
                  @click="open_login()"
                >
                  Login
                </b-dropdown-item>
                <b-dropdown-item
                  aria-role="listitem" v-show="!authenticated"
                  @click="open_signup()"
                >
                  Register
                </b-dropdown-item>

                <b-dropdown-item
                  aria-role="listitem"
                  v-show="authenticated"
                  @click="goto_profile_page"
                >
                  Profile
                </b-dropdown-item>
                <!-- 
                needs to be click.native for jest unittests
                to register click event properly
                -->
                <b-dropdown-item 
                  v-show="authenticated"
                  @click="gotto_booking_order_history"
                  aria-role="listitem"
                >
                  Booking Order History
                </b-dropdown-item>
                <b-dropdown-item 
                  v-show="authenticated" @click.native="logout"
                  aria-role="listitem" id="logout-button"
                >
                  Logout
                </b-dropdown-item>

                <!--
                <b-dropdown-item 
                  aria-role="listitem"
                  @click="auth_test"
                >
                  auth test
                </b-dropdown-item>
                -->
              </b-dropdown>

            </section>
          </b-navbar-item>
          
        </b-navbar-item>
      </template>
    </b-navbar>

    <div id="content-wrapper">
      <keep-alive include="Home">
        <router-view 
          id="router-view"
          @open-login="open_login()"
          @open-signup="open_signup()"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import AuthRequester from './AuthRequester'
import router from './router'
import $ from 'jquery'

import 'jquery.cookie'
import sleep from 'await-sleep'
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'
import axios from 'axios'
// import router from './router'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      modal_active: false,
      login_modal_active: false,
      signup_modal_active: false,
      // track logout requests (for jest testing)
      logout_requests: []
    }
  },

  mounted () {
    const self = this
    const navbar = self.get_navbar()
    
    // ensure that the navbar's height is being used
    // to offset the rest of the page's content
    // (ensure content and navbar don't overlap)
    navbar.ready(() => {
      const height = navbar.height()
      console.log('NAVBAR PAD HEIGHT', height)
      $('body').css("padding-top", height);
    });

    /*
    continuously poll for CSRF token from
    the backend servers
    */
    (async () => {
      let response = null
      let sleep_delay = 0

      while (response === null) {
        await sleep(sleep_delay);
        sleep_delay = 1000;

        try {
          response = await axios.post('load-csrf')
        } catch (error) {
          console.error('FAILED CSRF REQ', response)
          continue
        }

        const csrf_token = response.data.token
        // $.cookie('csrftoken', csrf_token)
        // https://stackoverflow.com/questions/71109384
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
        axios.defaults.xsrfCookieName = 'csrftoken'
        axios.defaults.xsrfHeaderName = "X-CSRFToken"
        axios.defaults.withCredentials = true;
        break
      }
    })();
  },

  methods: {
    get_navbar() {
      // I refactor this into its own method so that
      // we can mock in jest later when $refs dont work
      return $(this.$refs.main_navbar.$el)
    },

    on_login_complete() {
      // this.$router.push("/about") // TODO: redirect to profile page
      // this.$buefy.toast.open({
      //   duration: 5000,
      //   message: `Login Succesful! Welcome back!`,
      //   type: 'is-success',
      //   pauseOnHover: true
      // });
      
      this.login_modal_active = false;
      this.signup_modal_active = false;
      this.modal_active = false;
    },

    open_login() {
      this.login_modal_active = true;
      this.signup_modal_active = false;
      this.modal_active = true;
    },

    open_signup() {
      this.login_modal_active = false;
      this.signup_modal_active = true;
      this.modal_active = true;
    },

    post_signup(form_data) {
      const first_name = form_data.first_name
      const last_name = form_data.last_name
      const email = form_data.email
      const name = `${first_name} ${last_name}`
      const escaped_name = _.escape(name)

      if (!escaped_name) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Welcome  to Ascenda, ${escaped_name}!`,
          type: 'is-success',
          pauseOnHover: true
        });
      }

      this.$refs.login_modal.set_email(email)
      this.open_login();
    },

    goto_profile_page() {
      router.push({ path: '/profile' })
    },

    gotto_booking_order_history() {
      router.push({ path: '/bookinghistory' })
    },

    logout() {
      console.log('LOGOUT-AUTH', this.authenticated)
      if (!this.authenticated) { return false }

      const refresh_token = this.$store.getters.refresh_token
      const auth_token = this.$store.getters.auth_token
      this.$store.commit('clear_credentials')

      const requester = new AuthRequester(this)
      requester.set_refresh_token(refresh_token)
      requester.set_auth_token(auth_token)
      requester.disable_save_auth()

      // send logout request to blacklist auth crednentials

      const csrf_token = $.cookie('csrftoken');
      console.log('CSRF-TOKLEN', csrf_token)
      const logout_request = requester.post(
        'token-logout', {
          refresh_token: refresh_token
        }, {
          withCredentials: true, 
          headers: {
            'X-CSRF-TOKEN': csrf_token,
            "X-CSRFTOKEN": csrf_token
          }
        }
      ).catch(error => {
        console.error('LOGOUT REQUEST FAILED', error)
      })

      this.logout_requests.push(logout_request)
      console.log('LOGOUT-REQUESTS', this.logout_requests)
      this.$buefy.toast.open({
        duration: 5000,
        message: `Signed out`,
        type: 'is-dark',
        pauseOnHover: true
      })

      return logout_request
    },

    async auth_test() {
      const requester = new AuthRequester(this)
      let success = false
      let response;

      try {
        response = await requester.get('auth_test')
        success = true
      } catch (error) {
        response = error.response
        console.log('ERR', error)
      }

      console.log(response)
      let toast_type, message;
      const status_code = response.status

      if (success) {
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
  },

  components: {
    Login, SignUp
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Open Sans', sans-serif;
}

body {
  padding: 0px;
  // display: flex;
  margin: 0px;
  width: 100%;
  // height: 100%;
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

/*
button.off {
  background-color: white !important;
  color: white;

  &:hover {
    background-color: #42b983 !important;
    color: white;
  }
}
*/

div.field.custom-label {
  & div.field {
    display: flex;
    flex-direction: column;
  }
}

.flat-progress-bar {
  & > progress {
    border-radius: 0px !important;
    height: 0.5rem !important;
  }
}

div.drop-side-title {
  margin: 0px !important;
  width: 100%;

  & div.field-label {
    display: none;
  }
}

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