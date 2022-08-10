<template>
  <div id="wrapper">
    <div id="login-form">
      <section>
        <h3 id="login-title">SIGN UP</h3>
        <hr id="breakline"/>

        <b-field label="Email" class="input-field"
          :type="{ 'is-danger': has_error }"
          :message="email_error">
          <b-input
            type="email" value=""
            maxlength="30" placeholder="nobody@nowhere.com"
            v-model="email"
          ></b-input>
        </b-field>

        <b-field class="drop-side-title" horizontal grouped label="">

          <b-field label="First Name" class="input-field"
            :type="{ 'is-danger': has_error }"
            :message="first_name_error">
            <b-input
              value="" maxlength="30" placeholder="John"
              v-model="first_name"
            ></b-input>
          </b-field>

          <b-field label="Last Name" class="input-field"
            :type="{ 'is-danger': has_error }"
            :message="last_name_error">
            <b-input
              value="" maxlength="30" placeholder="Doe"
              v-model="last_name"
            ></b-input>
          </b-field>

        </b-field>

        <b-field label="Password" class="input-field"
          :type="{ 'is-danger': has_error }"
          :message="password_error">
          <b-input 
            value="" type="password" maxlength="30"
            placeholder="password123" v-model="password"
            password-reveal
          ></b-input>
        </b-field>

        <b-field label="Confirm Password" class="input-field"
          :type="{ 'is-danger': has_error }"
          :message="re_password_error">
          <b-input 
            value="" type="password" maxlength="30"
            placeholder="password123" v-model="re_password"
            password-reveal
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
            @click="signup()" :disabled="pending || !allow_signup"
          >
            Sign Up
          </b-button>
          <a href="#" id="signup" @click="open_login_modal()">
            Login
          </a>
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
        last_name: '',
        email: '',
        password: '',
        re_password: '',

        first_name_error: {},
        last_name_error: {},
        email_error: {},
        password_error: {},
        re_password_error: {},
        other_errors: '',

        has_error: false,
        // used to check if form is being processed
        pending: false 
      }
    },
    methods: {
      open_login_modal() {
        this.$emit('open-login', true)
      },
      signup() {
        const self = this;
        // disallow signup if current signup
        // request is still pending
        if (self.pending) { return false }
        self.pending = true

        const formdata = {
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name,
          password: this.password,
          re_password: this.re_password,
        }

        // console.log('FORMDATA', formdata)

        self.has_error = false;
        self.first_name_error = {};
        self.last_name_error = {};
        self.email_error = {};
        self.password_error = {};
        self.re_password_error = {};
        self.other_errors = ''

        axios.post(
          'auth/users/', formdata
        ).then(response => {
          this.$emit('open-login', formdata)
  
        }).catch(err_resp => {
          console.log('ERR-RESP', err_resp)
          console.log('ERR-RESP.response', err_resp.response)
          console.log('ERR-RESP.response.data', err_resp.response.data)
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
          } if (errors.hasOwnProperty('last_name')) {
            self.last_name_error = errors['last_name']
          } if (errors.hasOwnProperty('password')) {
            self.password_error = errors['password']
          } if (errors.hasOwnProperty('re_password')) {
            self.re_password_error = errors['re_password']
          }

          if(isHTML(errors)){
            // temp workaround to check if email has error
            self.email_error = "The email address format is invalid."
            errors = []
            errors['email'] = "The email address format is invalid."
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
          self.has_error = true;

        }).finally(() => {
          // simulate a delay for loading a response
          // setTimeout(() => { self.pending = false }, 1000)
          self.pending = false;
        })
      }
    },

    computed: {
      allow_signup() {
        return (
          (this.first_name.trim() !== '') &&
          (this.last_name.trim() !== '') &&
          (this.email.trim() !== '') &&
          (this.password.trim() !== '') &&
          (this.re_password.trim() !== '')
        )
      }
    }
  };

function isHTML(str) {
  var a = document.createElement('div');
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true; 
  }

  return false;
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