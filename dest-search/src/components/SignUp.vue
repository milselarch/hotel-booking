<template>
  <div id="wrapper">
    <div id="login-form">
      <section>
        <h3 id="login-title">SIGN UP</h3>
        <hr id="breakline"/>

        <b-field label="Email" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="email_error">
          <b-input
            type="email" value=""
            maxlength="30" placeholder="nobody@nowhere.com"
            v-model="email"
          ></b-input>
        </b-field>

        <b-field label="First Name" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="first_name_error">
          <b-input
            value="" maxlength="30" placeholder="John Doe"
            v-model="first_name"
          ></b-input>
        </b-field>

        <b-field label="Password" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="password_error">
          <b-input 
            value="" type="password" maxlength="30"
            placeholder="password123" v-model="password"
          ></b-input>
        </b-field>

        <b-field label="Confirm Password" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="re_password_error">
          <b-input 
            value="" type="password" maxlength="30"
            placeholder="password123" v-model="re_password"
          ></b-input>
        </b-field>

        <b-message 
          type="is-danger" has-icon
          style="white-space: pre-line"
          v-show="other_errors !== ''"
        >{{ other_errors }}</b-message>

        <div class="button-controls">
          <b-button 
            type="is-dark" id="signup" class="fat-button"
            @click="signup()" :disabled="pending"
          >
            Sign Up
          </b-button>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'SignUp',

    data() {
      return {
        first_name: '',
        email: '',
        password: '',
        re_password: '',

        first_name_error: {},
        email_error: {},
        password_error: {},
        re_password_error: {},
        other_errors: '',

        hasError: false,
        // used to check if form is being processed
        pending: false 
      }
    },
    methods: {

      signup() {
        const self = this;
        self.pending = true

        const formdata = {
          email: this.email,
          first_name: this.first_name,
          password: this.password,
          re_password: this.re_password,
        }

        self.hasError = false;
        self.first_name_error = {};
        self.email_error = {};
        self.password_error = {};
        self.re_password_error = {};
        self.other_errors = ''

        axios.post(
          'auth/users/', formdata
        ).then(response => {
          this.$emit('open-login')
  
        }).catch(err_resp => {
          let errors = err_resp.response.data
          const other_errors = []

          if (errors === undefined) {
            other_errors.push(err_resp.message)
            errors = []
          }

          if (errors.hasOwnProperty('email')) {
            self.email_error = errors['email']
          } if (errors.hasOwnProperty('first_name')) {
            self.first_name_error = errors['first_name']
          } if (errors.hasOwnProperty('password')) {
            self.password_error = errors['password']
          } if (errors.hasOwnProperty('re_password')) {
            self.re_password_error = errors['re_password']
          }

          console.error('ERRORS', errors)

          for (let cause in errors) {
            // only go through errors not covered already
            if (formdata.hasOwnProperty(cause)) { continue; }
            const reasons = errors[cause];
            if (reasons instanceof Array) {
              other_errors.push(...errors[cause])
            } else {
              other_errors.push(errors[cause])
            }
          }

          self.other_errors = other_errors.join('\n');
          self.hasError = true;

        }).finally(() => {
          // simulate a delay for loading a response
          // setTimeout(() => { self.pending = false }, 1000)
          self.pending = false;
        })
      }
    }
  };

  

</script>

<style lang="scss" scoped>

div#login-form {
  width: 20rem;
  margin: auto;

  & hr#breakline {
    margin-top: 0px;
  }

  & h3#login-title {
    text-align: center;
    font-family: 'Babas Neue';
    font-size: 3rem;
  }

  & div.button-controls {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0px;
    margin-top: 3rem;
    width: 100%;
  }

  & button#signup {
    width: 10rem;
    margin-bottom: 1rem;
    height: 3rem;
  }

  & a#signup {
    margin-bottom: 0.1rem;
  }
}

div#wrapper {
  padding: 2rem;
  width: 25rem;
  margin: auto;
  background-color: white;
}
</style>