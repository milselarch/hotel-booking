<template>

<div class="container is-max-widescreen">
  
  <div class="columns is-mobile ">
    <!-- Primary Guest & Payment Info -->
    <div class="column is-two-third " id="booking">
      <form>  
        <!-- Primary Guest -->
        <div class="box">

        <div class="columns is-mobile ">
          <div class="column is-three-fifth ">
            <h3 class="title is-3">Primary Guest</h3>
          </div>
          <div class="column is-two-fifth ">
            <div class="block">
              
              <b-field>
                <div style="align-self: center">Are you the primary guest?&nbsp;</div>
                <b-radio-button v-model="primaryGuestRadioButton"
                    native-value="Nope"
                    type="is-danger is-light is-outlined"
                    disabled
                    >
                    <span>No</span>
                </b-radio-button>

                <b-radio-button v-model="primaryGuestRadioButton"
                    native-value="Yes"
                    type="is-success is-light is-outlined"
                    disabled
                    >
                    <b-icon icon="check"></b-icon>
                    <span>Yes</span>
                </b-radio-button>


              </b-field>
            </div>
          </div>
        </div>
        

        <div class="columns is-mobile ">
          <div class="column is-one-third ">
            <b-field label="Title">
              <b-select v-model="title" placeholder="Title" expanded>
                  <option value="mr">Mr.</option>
                  <option value="ms">Ms.</option>
                  <option value="mrs">Mrs.</option>
              </b-select>
          </b-field>

          </div>

          <div class="column is-one-third ">
            <b-field label="First name" class="input-field"
              :type="{ 'is-danger': hasError }"
              :message="first_name_error">
              <b-input
                value="" maxlength="30" placeholder="John"
                v-model="first_name"
              ></b-input>
            </b-field>
          </div>

          <div class="column is-one-third ">
            <b-field label="Last name" class="input-field"
              :type="{ 'is-danger': hasError }"
              :message="last_name_error">
              <b-input
                value="" maxlength="30" placeholder="Doe"
                v-model="last_name"
              ></b-input>
            </b-field>
          </div>
        </div>

        <div class="columns is-mobile ">
          <div class="column is-one-third ">
            <b-field label="Country code">
              <b-select v-model="countryCodeSelect" placeholder="Country code" expanded>
                  <option value="Singapore +65" selected>Singapore +65</option>
                  <option value="Malaysia +60">Malaysia +60</option>
              </b-select>
          </b-field>

          </div>
          <div class="column is-one-third ">
            <b-field label="Phone">
                <b-input v-model="phone"
                type="number"
                placeholder="912345678"
                pattern="[0-9]*"
                validation-message="Enter valid 8 to 12 digits phone number"
                minlength="8" 
                maxlength="12" 
                :type="{ 'is-danger': hasError }"
                :message="phone_error"
                v-cardformat:restrictNumeric
                ></b-input>
            </b-field>
          </div>
          <div class="column is-one-third ">
            <b-field label="Email" class="input-field"

              >
              <b-input
                type="email" value=""
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                validation-message="Enter valid email address"
                maxlength="30" placeholder="nobody@nowhere.com"
                v-model="email"
                :type="{ 'is-danger': hasError }"
                :message="email_error"
              ></b-input>
            </b-field>
          </div>
        </div>


          <div class="field">
              <b-field label="Special requests">
                  <b-input maxlength="500" type="textarea"
                  placeholder="We will pass on the requests to the hotel. Please note that all requests are at the hotel's discretion and not guaranteed.">
                  </b-input>
              </b-field>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="box">
            <h3 class="title is-3">Payment</h3>
            

            <div class="columns mobile">
              <div class="column is-three-fifth">
              <b-field label="Credit Card Number" class="input-field"
              >
                <b-input
                  value="" placeholder="5555-5555-5555-5555"
                  v-model="cc_number"
                  :type="{ 'is-danger': hasError }"
                  :message="cc_number_error"
                  maxlength="16"
                  minlength="16"
                  validation-message="Enter valid credit card"
                  v-cardformat:formatCardNumber                 
                ></b-input>
              </b-field>
                  

              </div>
              <div class="column is-two-fifth">

                <b-field label="Name on Card" class="input-field"
                :type="{ 'is-danger': hasError }"
                :message="cc_name_error">
                  <b-input
                    value="" maxlength="30" placeholder="John Doe"
                    v-model="cc_name"
                  ></b-input>
                </b-field>

              </div>


            </div>
            
            <div class="columns mobile">
              <div class="column is-one-third">
                <b-field label="Expiry date (MM/YY)">
                    <b-input id="cc_expiry_date" v-model="cc_expiry_date" placeholder="06/26"
                      v-cardformat:formatCardExpiry
                      minlength="4" 
                      maxlength="4" 
                      validation-message="Enter credit card expiry date in MM/YY format"
                      ></b-input>
                </b-field>

              </div>
              <div class="column is-one-third">
                <b-field label="CVV/CVC">
                    <b-input v-model="cc_cvc" placeholder="000"
                      minlength="3" 
                      maxlength="3" 
                      validation-message="Enter valid 3 digits CVV/CCVC number"
                      v-cardformat:restrictNumeric
                    ></b-input>
                </b-field>
              </div>
            </div>
          
        </div>

        <div class="box">
          <h3 class="title is-3">Billing Address</h3>

            <div class="columns mobile">
              <div class="column is-two-fifth">
                <b-field label="Country">
                    <b-select v-model="ba_country" placeholder="Singapore" expanded>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                    </b-select>
                </b-field>
              </div>

              <div class="column is-two-fifth">
                <b-field label="City" class="input-field"
                :type="{ 'is-danger': hasError }"
                :message="cc_name_error">
                    <b-input
                      value="" maxlength="30" placeholder="Singapore"
                      v-model="cc_name"
                    ></b-input>
                </b-field>

              </div>
            </div>

            <div class="columns mobile">
              <div class="column is-two-third">
                <b-field label="Billing Address">
                    <b-input v-model="ba_address" placeholder="Blk 100 Hougang Ave 3 #10-10"></b-input>
                </b-field>
              </div>

              <div class="column is-one-third">
                <b-field label="Postal code">
                    <b-input v-model.number="cc_cvc" placeholder="111111"
                    minlength="5" 
                    maxlength="6" 
                    :type="{ 'is-danger': hasError }"
                    :message="cc_cvc_error"
                    validation-message="Enter valid 6 digits postal code or valid 5 digits zip code (US)"
                    v-cardformat:restrictNumeric></b-input>
                </b-field>
              </div>
            </div>
        </div>

        <!-- Checkbox-->
        <div class="">
          <b-checkbox v-model="termsCheckBoxGroup"
                  native-value="agreed">
                  I've read the terms and condition
          </b-checkbox>
        </div>

        <b-message 
          type="is-danger" has-icon
          style="white-space: pre-line"
          v-show="other_errors !== ''"
        >{{ other_errors }}</b-message>

        <div class="center">
              <button class="button is-primary bigbutton">Confirm Booking</button>
        </div>



      </form>

    </div>
    
    <!-- Summary of selected hotel & room -->
    <div class="column is-one-third">

        <div class="box">
          <h3 class="title is-4">Summary</h3>
          <p>Hotel: </p>
          <p>Country: </p>
          <p>City: </p>
          <p>Room Type: </p>
          <p>Number of Rooms: </p>
          <p>Number of Guests: </p>
          <p>Check In Date: </p>
          <p>Check Out Date: </p>
          <p>Total Cost: </p>

        </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
name: 'Booking',
  data () {

    const cc_expiry_date = document.getElementById('cc_expiry_date');
    
    cc_expiry_date.addEventListener('change', () => {
        // Write your logic here
        console.log('change event');
    });
    
    return {
      other_errors: '',
      primaryGuestRadioButton:'Nope',
      countryCodeSelect:'Singapore +65',
      title:'mr',
      ba_country:'Singapore',

        first_name_error: {},
        last_name_error: {},
        email_error: {},
        phone_error: {},
        other_errors: '',

        hasError: false,
        // used to check if form is being processed
        pending: false 


        
    }
  },
  methods: {
  }
}
</script>


<style lang="scss" scoped>
.bigbutton {
  align-self: center;
  padding: 20px 32px;
  text-align: center;
  font-size: 25px;
  margin-top: 10px;
  margin-bottom: 60px;
}

.center{
  align-self: center;
  text-align: center;
}

</style>
