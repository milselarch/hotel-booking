<template>
  <div class="tile is-ancestor details">

    <div class="tile is-parent is-vertical">
      <article class="tile is-child box">
        <div class="content">
          <p class="title">Profile Info</p>
          <p class="subtitle"></p>
          <div class="content">
            <div id="load-status">
              <div id="status" v-show="!load_success">
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
            <p>
              Email: <b-tag id="email-info">{{ email }}</b-tag>
            </p>
            <p>
              Name: <b-tag id="name-info">
                {{user_title}} {{ first_name }} {{ last_name }}
              </b-tag>
            </p>
            <p>
              Phone number: <b-tag>{{ user_phone_country }} {{ user_phone }}</b-tag>
            </p>
            <p>
              User creation date: <b-tag>{{ user_datetime_created }}</b-tag>
            </p>

          </div>

        </div>
      </article>
      <article class="tile is-child box">
        <p class="title">Payment Information</p>
        <p class="subtitle">List of payment methods saved under your account</p>
      </article>
    </div>
    
    <div class="tile is-8">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child box">
            <p class="title">Booking Details</p>
            <p class="subtitle">The most recent booking will be shown</p>
            <div class="content">
              <p>
                Booking ID: <b-tag>{{ booking_id }}</b-tag>
              </p>
              <p>
                Booking creation date: <b-tag>{{ datetime_created }}</b-tag> 
              </p>
              <p>
                Destination ID: <b-tag>{{ destination_id }}</b-tag>
              </p>
              <p> 
                Hotel ID: <b-tag>{{ hotel_id }}</b-tag> 
              </p>
              <p>
                Room Type ID: <b-tag>{{ room_type_id }}</b-tag>  
              </p>
              <p>
                Check In Date: <b-tag>{{ check_in_date }}</b-tag> 
              </p>
              <p>
                Checkout Date: <b-tag>{{ check_out_date }}</b-tag> 
              </p>
              <p>
                Number of rooms: <b-tag>{{ number_of_rooms }}</b-tag>
              </p>
              <p>
                Number of guests per room: <b-tag>{{ number_of_guests_per_rooms }}</b-tag>
              </p>
              <p>
                Special request: <b-tag>{{ special_request }}</b-tag> 
              </p>
              <p>
                Primary Guest: <b-tag>{{ primary_guest_title }} {{ primary_guest_first_name }} {{ primary_guest_last_name }}</b-tag>
              </p>
              <p>
                Primary guest email: <b-tag>{{ primary_guest_email }}</b-tag> 
              </p>
              <p>
                Primary guest phone: <b-tag>{{primary_guest_phone_country}} {{ primary_guest_phone }}</b-tag>
              </p>
              <p>
                Cost of booking (SGD): <b-tag>{{ cost_in_sgd }}</b-tag> 
              </p>
              <p>
                Booking terms and condition: <b-tag>{{ booking_tnc }}</b-tag> 
              </p>
              <p>
                Hotel terms and condition: <b-tag>{{ hotel_tnc }}</b-tag>
              </p>
            </div>
          </article>
          <article class="tile is-child box">
            <p class="title">Edit Account</p>
            <b-button
              label="Delete account"
              type="is-danger"
              size="is-medium"
              id = "delete_account_button"
              @click="isDeleteAccountModalActive = true" 
            />
            
            <p class="title is-4"><br>Warning</p>
            <p class="subtitle">Account deletion is a non-reversible process. All information associated with the account will be deleted from the database.</p>
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

      uid: null,
      email: null,
      first_name: null,
      last_name: null,
      user_phone: null,
      user_title: null,
      user_phone_country: null,
      user_datetime_created: null,

      isDeleteAccountModalActive: false,

      booking_id: null,
      destination_id: null,
      hotel_id: null,
      room_type_id: null,
      booking_id: null,
      check_in_date: null,
      check_out_date: null,
      number_of_rooms: null,
      number_of_guests_per_rooms: null,
      special_request: null,
      primary_guest_title: null,
      primary_guest_first_name: null,
      primary_guest_last_name: null,
      primary_guest_email: null,
      primary_guest_phone: null,
      primary_guest_phone_country: null,
      cost_in_sgd: null,
      datetime_created: null,
      booking_tnc: null,
      hotel_tnc: null,
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
      let responseBooking;
      
      (async () => {
        console.log('LOAD REQ START')

        try {
          response = await requester.get('auth/users/me/')
          responseBooking = await requester.get("booking/")
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

        // console.log('RESPONSE', response);
        // console.log('Booking Response', responseBooking);
        self.status_text = 'profile info'
        self.user_title = response.title
        self.first_name = response.data.first_name
        self.last_name = response.data.last_name
        self.email = response.data.email
        self.user_phone = response.data.phone
        self.user_phone_country = response.data.phone_country
        self.user_datetime_created = response.data.datetime_created.split("T")[0]

        let last = responseBooking.data.length-1
        if (last === -1) { return false }

        self.booking_id = responseBooking.data[last].uid
        self.destination_id = responseBooking.data[last].destination_id
        self.hotel_id = responseBooking.data[last].hotel_id
        self.room_type_id = responseBooking.data[last].room_type_id
        // self.booking_id = responseBooking.data[last].booking_id
        self.check_in_date = responseBooking.data[last].check_in_date
        self.check_out_date = responseBooking.data[last].check_out_date
        self.number_of_rooms = responseBooking.data[last].number_of_rooms
        self.number_of_guests_per_rooms = responseBooking.data[last].number_of_guests_per_rooms
        self.special_request = responseBooking.data[last].special_request
        self.primary_guest_title = responseBooking.data[last].primary_guest_title
        self.primary_guest_first_name = responseBooking.data[last].primary_guest_first_name
        self.primary_guest_last_name = responseBooking.data[last].primary_guest_last_name
        self.primary_guest_email = responseBooking.data[last].primary_guest_email
        self.primary_guest_phone = responseBooking.data[last].primary_guest_phone
        self.primary_guest_phone_country = responseBooking.data[last].primary_guest_phone_country
        self.cost_in_sgd = responseBooking.data[last].cost_in_sgd
        self.datetime_created = responseBooking.data[last].datetime_created.split("T")[0]
        self.booking_tnc = responseBooking.data[last].booking_tnc
        self.hotel_tnc = responseBooking.data[last].hotel_tnc
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

.details{
  padding-top: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 70%;
  margin: auto;
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