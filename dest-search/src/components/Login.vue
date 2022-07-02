<template>
  <div id="wrapper">
    <div id="login-form">
      <section>
        <h3 id="login-title">LOGIN</h3>
        <hr id="breakline"/>

        <b-field label="Email" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="email_error">
          <b-input
            type="email" value="" v-model="email"
            maxlength="30" placeholder="nobody@nowhere.com"
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

        <b-message 
          type="is-danger" has-icon
          style="white-space: pre-line"
          v-show="other_errors !== ''"
        >{{ other_errors }}</b-message>

        <div class="button-controls">
          <b-button 
            type="is-dark" id="login" class="fat-button" @click="login()"
          >
            Login
          </b-button>
          <a href="#" id="signup" @click="openSignupModal()">Sign Up</a>
          <a target="_blank" href="https://youtu.be/dQw4w9WgXcQ">Forgot Password</a>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Login',

    data() {
      return {
        email: '',
        password: '',

        email_error: {},
        password_error: {},
        other_errors: '',

        hasError: false,
        pending: false
      }
    },

    methods: {
      openSignupModal() {
        this.$emit('open-signup', this.name)
      },

      set_email(email) {
        this.email = email
      },

      login() {
        const self = this;
        self.pending = true;

        console.log("button clicked")
        const formdata = {
          email: this.email,
          password: this.password,
        }

        self.hasError = false;
        self.email_error = {};
        self.password_error = {};
        self.other_errors = ''

        axios.post(
          'auth/jwt/create/', formdata
        ).then(response => {
          console.log('JWT CREATE SUCCESS')
          
          const credentials = response.data
          this.$store.commit('set_credentials', credentials)
          this.$emit('login-done', formdata)

          // console.log(response.data);
          // const access_token = response.data.access
          // const refresh_token = response.data.refresh
          // axios.defaults.headers.common["Authorization"] = 'Bearer ' + access_token
        
        }).catch(err_resp =>{
          // console.log('ERR_RESP', err_resp)
          let errors = err_resp.response.data
          const other_errors = []

          if (errors === undefined) {
            other_errors.push(err_resp.message)
            errors = []
          }

          if (errors.hasOwnProperty('email')) {
            self.email_error = errors['email']
          } if (errors.hasOwnProperty('password')) {
            self.password_error = errors['password']
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

          console.log('OERRROS-LKOGIN', other_errors)
          self.other_errors = other_errors.join('\n');
          this.hasError = true;
        
        }).finally(() => {
          // simulate a delay for loading a response
          // setTimeout(() => { self.pending = false }, 1000)
          self.pending = false;
        })
      }
    }
  }
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