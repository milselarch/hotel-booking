<template>
  <div class="bookinghistory container is-max-widescreen">
    <div class="columns is-mobile">
      <div class="column is-two-third" id="booking">
        <div id="load-status">
          <div id="status" v-show="true">
            <p id="status-text">{{ status_text }}</p>
            <square id="spinner" v-show="pending"></square>
            <b-button
              type="is-dark"
              id="login"
              outlined
              @click="load()"
              icon-right="sync"
              v-show="!(pending || load_success)"
            >
              try again
            </b-button>
          </div>
        </div>

        <!-- ONLY SHOW IF empty DATA in bookinghistorydata-->
        <div
          v-show="bookinghistorydata != null && bookinghistorydata.length == 0"
        >
          <div class="card">
            <div class="card-content">
              <div class="content">No booking have been made yet!</div>
            </div>
          </div>
        </div>

        <!-- ONLY SHOW IF HAVE DATA -->
        <div
          class="card"
          v-for="(booking, index) in this.bookinghistorydata"
          :key="index"
          :class="{ striped: isEven(index) }"
        >
          <div class="card-header">
            <div class="card-header-title">
              Booking Order ID: {{ booking.uid }}
            </div>
          </div>

          <div class="card-content">
            <div class="content">
              <h4>Booking Details</h4>
              <div class="columns is-mobile">
                <div class="column is-one-third">
                  <b>Order Date</b><br />{{ booking.datetime_created }}
                </div>
                <div class="column is-one-third">
                  <b>Total Price</b><br />SGD ${{ booking.cost_in_sgd }}
                </div>
                <div class="column is-one-third">
                  <b>Booking Dates</b><br />{{ booking.check_in_date }} to
                  {{ booking.check_out_date }}
                </div>
              </div>
              <div class="columns is-mobile">
                <div class="column is-one-third">
                  <b>Hotel</b><br />{{ booking.hotel_name }}
                </div>
                <div class="column is-one-third">
                  <b>Destination</b><br />{{ booking.destination_region }}
                </div>
                <div class="column is-one-third">
                  <b>Room Type</b><br />{{ booking.room_type }} {{ check_breakfast(booking.room_breakfast_info) }}
                </div>
              </div>
              <div class="columns is-mobile">
                <div class="column is-one-third">
                  <b>Number of Rooms</b><br />{{ booking.number_of_rooms }}
                </div>
                <div class="column is-one-third">
                  <b>Number of Guests Per Room</b><br />{{
                    booking.number_of_guests_per_rooms
                  }}
                </div>
                <div class="column is-two-third">
                  <b>Special Request</b><br />{{ booking.special_request }}
                </div>
              </div>

              <br />
              <h4>Primary Guest Details</h4>
              <div class="columns is-mobile">
                <div class="column is-one-third">
                  <b>Primary Guest Name</b><br />
                  {{ booking.primary_guest_title }}
                  {{ booking.primary_guest_first_name }}
                  {{ booking.primary_guest_last_name }}
                </div>
                <div class="column is-one-third">
                  <b>Primary Guest Email</b><br />
                  {{ booking.primary_guest_email }}
                </div>
                <div class="column is-two-third">
                  <b>Primary Guest Phone Number</b><br />
                  {{ booking.primary_guest_phone_country }}
                  {{ booking.primary_guest_phone }}
                </div>
              </div>

              <br />
              <h4>Payment Details</h4>
              <div class="columns is-mobile">
                <div class="column is-one-third">
                  <b>Name on Card</b><br />
                  {{ booking.payment_id.name_on_card }}
                </div>
                <div class="column is-one-third">
                  <b>Credit Card Details</b><br />
                  XXXX-XXXX-XXXX-{{ booking.payment_id.card_number }}
                </div>
                <div class="column is-two-third">
                  <b>Billing Address Details</b><br />
                  {{ booking.payment_id.billing_address_address }} <br />
                  Postal Code:
                  {{ booking.payment_id.billing_address_post_code }} <br />
                  {{ booking.payment_id.billing_address_country }},
                  {{ booking.payment_id.billing_address_city }}
                </div>
              </div>
            </div>
          </div>
          <!-- </b-collapse> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthRequester from "@/AuthRequester";
import sleep from "await-sleep";
import router from "../router";
import axios from "axios";
import HotelInfo from "./HotelInfo.vue"

export default {
  name: "BookingHistory",
  mixins: [HotelInfo],
  data() {
    return {
      status_text: "loading booking history",
      pending: false,
      is_mounted: false,

      load_success: false,
      bookinghistorydata: null,
    };
  },
  methods: {
    check_breakfast(breakfastInfo){
      return "(" + HotelInfo.methods.check_breakfast_func(breakfastInfo) + ")"
    },
    isEven(index) {
      if (index % 2 !== 0) {
        return true;
      }
    },
    logout(toast = false) {
      const self = this;

      if (toast) {
        self.$buefy.toast.open({
          duration: 5000,
          message: `User not logged in`,
          type: "is-danger",
          pauseOnHover: true,
        });
      }

      self.status_text = "login required";
      self.load_success = false;
      self.first_name = null;
      self.last_name = null;
      self.email = null;
      router.push("/");
    },

    load() {
      const self = this;
      console.log("LOAD START");
      self.pending = true;
      self.other_errors = "";
      self.load_success = false;
      self.bookinghistorydata = null;

      const requester = new AuthRequester(self);
      try {
        requester.refresh().then(
          (refresh_success) => {
            if (!refresh_success) {
              throw access_error;
            }
            requester.load_credentials();
            self.getBookingHistory(requester);
          },
          (requester_error) => {
            self.status_text = "Booking History failed to load";

            let errors = requester_error.response.data;
            const other_errors = [];
            if (errors === undefined) {
              other_errors.push(requester_error.message);
              errors = [];
            }
            console.error("ERRORS", errors);

            for (let cause in errors) {
              // only go through errors not covered already
              if (formdata.hasOwnProperty(cause)) {
                continue;
              }
              const reasons = errors[cause];
              if (reasons instanceof Array) {
                other_errors.push(...errors[cause]);
              } else {
                other_errors.push(errors[cause]);
              }
            }

            self.other_errors = other_errors.join("\n");
            self.hasError = true;
            self.pending = false;
          }
        );
      } catch (refresh_error) {
        console.error("REFRESH FAILED", refresh_error);
        self.pending = false;
        self.hasError = true;
      }

      //return true;
    },

    getBookingHistory(requester) {
      const self = this;
      self.load_success = false;
      self.pending = true;
      let responseBooking;

      (async () => {
        console.log('BOOKING REQ START')
        try {
          responseBooking = await requester.get("booking/")
          self.load_success = true
        } catch (error) {
          self.status_text = "Booking History failed to load";
          self.load_success = false
          console.log("bookinghistory error!");
          console.log("error", error);
        }
        finally {
          self.pending = false;
        }

        if (!self.load_success) {
          self.load_success = false
          return false;
        }
        console.log('Booking Response', responseBooking);
        console.log("bookinghistory success!");
        self.status_text = "Booking History";
        self.load_success = true;
        self.pending = false;
        self.bookinghistorydata = responseBooking.data;
      })();

    },
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
  },
};
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
      font-family: "Babas Neue";
      font-size: 2rem;
      white-space: pre-wrap;
      word-break: break-all;
      text-align: center;

      &:empty::before {
        // allow paragraph elemenet to have height
        // even when it has no content
        content: "";
        display: inline-block;
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

.striped{
  background-color: #f3f3f3
}
</style>