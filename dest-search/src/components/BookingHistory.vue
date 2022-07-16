<template>
  <div class="profile">
    <div id="load-status">
      <div id="status" v-show="true">
        <p id="status-text">{{ status_text }}</p>
        <square id="spinner" v-show="is_loading"></square>
        <b-button 
          type="is-dark" id="login" outlined
          @click="load()" icon-right="sync"
          v-show="!(is_loading || load_success)"
        >
          try again
        </b-button>
      </div>
    </div>

    <div id="profile-info">
      <h1>BOOKING history</h1>
      <p> {{ email }} </p>
      <p> {{ first_name }} {{ last_name }} </p>
    </div>
  </div>
</template>

<script>
import AuthRequester from '@/AuthRequester'
import sleep from 'await-sleep'
import router from '../router'

export default {
  name: 'BookingHistory',
  data () {
    return {
      status_text: 'loading profile',
      is_loading: false,
      is_mounted: false,

      load_success: false,
      first_name: null,
      last_name: null,
      email: null
    }
  },

  methods: {
    logout(toast=false) {
      const self = this

      if (toast) {
        self.$buefy.toast.open({
          duration: 5000,
          message: `User not logged in`,
          type: 'is-danger',
          pauseOnHover: true
        });
      }

      self.status_text = 'login required'
      self.load_success = false
      self.first_name = null
      self.last_name = null
      self.email = null
      router.push('/')
    },

    load() {
      const self = this;
      console.log('LOAD START')

      if (self.is_loading) {
        return false;
      };

      self.is_loading = true;
      self.load_success = false;
      const requester = new AuthRequester(self)
      let response;
      
      (async () => {
        console.log('LOAD REQ START')

        try {
          response = await requester.get('profile')
          self.load_success = true
        } catch (error) {
          const status_code = error.response.status;

          if (status_code === 401) {
            self.logout(true)
          } else {
            self.status_text = 'profile load failed'
            response = error.response;
            console.log('LAOD ERR', error);
          }
        } finally {
          console.log('LOAD END');
          self.is_loading = false;
        }

        if (!self.load_success) {
          return false;
        }

        console.log('RESPIBSE', response);
        self.status_text = 'profile info'
        self.first_name = response.data.first_name
        self.last_name = response.data.last_name
        self.email = response.data.email
      })();

      return true;
    }
  },

  mounted: function () {
    const self = this;
    self.is_mounted = true;
    self.load();

    (async () => {
      while (self.is_mounted) {
        await sleep(1000);
        if (!self.$store.getters.authenticated) {
          // if login credentials are removed from store
          // logout the user from profile page
          self.logout();
          break;
        }
      }
    })();
  },

  unmounted() {
    self.is_mounted = false;
  }
}

</script>

<style lang='scss' scoped>
div#load-status {
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

div.profile {
  display: flex;
  flex-direction: column;

  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  margin-top: 2rem;

  & div#profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }
}

p {
  width: fit-content;
}

h1 {
  width: fit-content;
  display: inline;
  margin: 0px;
}
</style>