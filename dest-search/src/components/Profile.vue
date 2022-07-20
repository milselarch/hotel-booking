<template>
  <div class="tile is-ancestor">

    <div class="tile is-parent">
      <article class="tile is-child notification is-primary">
        <div class="content">
          <p class="title">Profile Info</p>
          <p class="subtitle"></p>
          <div class="content">
            <div id="load-status">
              <div id="status" v-show="is_loading">
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
          </div>
          <div id="account_data">
            <p> {{ email }} </p>
            <p> {{ first_name }} {{ last_name }} </p>
          </div>

        </div>
      </article>
    </div>
    
    <div class="tile is-vertical is-8">
      <div class="tile">

        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification is-success">

          </article>
          <article class="tile is-child notification is-warning">
            <b-button
              label="Delete account"
              type="is-danger"
              size="is-medium"
              @click="isDeleteAccountModalActive = true" />

            <b-modal
              v-model="isDeleteAccountModalActive"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-label="Example Modal"
              close-button-aria-label="Close"
              aria-modal>
              <DeleteAccount 
                v-show="isDeleteAccountModalActive"
                @deleted="account_deleted"
                @close_delete_modal = "isDeleteAccountModalActive = false"
              />
            </b-modal>
          </article>
        </div>

        <div class="tile is-parent">
          <article class="tile is-child notification is-info">
            <p class="title">Middle tile</p>
            <p class="subtitle">With an image</p>
            <figure class="image is-4by3">
              <img src="https://bulma.io/images/placeholders/640x480.png">
            </figure>
          </article>
        </div>

      </div>

      <div class="tile is-parent">
        <article class="tile is-child notification is-danger">
          <p class="title">Warning</p>
          <p class="subtitle">Account deletion is a non-reversible process. All information associated with the account will be deleted from the database.</p>
          <div class="content">
            <!-- Content -->
          </div>
        </article>
      </div>

    </div>

    

    <!-- <div class="container is-fluid">
      <div class="notification is-primary">
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
      </div>
    </div> -->

    <!-- <div id="account_delete_button">
      <b-button
            label="Delete account"
            type="is-danger"
            size="is-medium"
            @click="isDeleteAccountModalActive = true" />

      <b-modal
            v-model="isDeleteAccountModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            close-button-aria-label="Close"
            aria-modal>
            <DeleteAccount 
              v-show="isDeleteAccountModalActive"
              @deleted="account_deleted"
              @close_delete_modal = "isDeleteAccountModalActive = false"
            />
        </b-modal>
    </div> -->

  </div>
</template>

<script>
import AuthRequester from '@/AuthRequester'
import sleep from 'await-sleep'
import router from '../router'
import DeleteAccount from '@/components/DeleteAccount.vue'

export default {
  name: 'Profile',

  components: {
    DeleteAccount
  },

  data () {
    return {
      status_text: 'loading profile',
      is_loading: false,
      is_mounted: false,

      load_success: false,
      first_name: null,
      last_name: null,
      email: null,

      isDeleteAccountModalActive: false,
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
            console.log('LOAD ERR', error);
          }
        } finally {
          console.log('LOAD END');
          self.is_loading = false;
        }

        if (!self.load_success) {
          return false;
        }

        console.log('RESPONSE', response);
        self.status_text = 'profile info'
        self.first_name = response.data.first_name
        self.last_name = response.data.last_name
        self.email = response.data.email
      })();

      return true;
    },

    account_deleted(){
      // redirect to home page after deleting account
      this.$router.push("/")
      // clear authentication tokens
      this.$store.commit('clear_credentials')
      this.$buefy.toast.open({
                    duration: 5000,
                    message: `Sad to see you go :( Your account has been deleted`,
                    type: 'is-link',
                    pauseOnHover: true
                })

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
    justify-content: center;
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