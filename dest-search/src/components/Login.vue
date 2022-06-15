<template>
  <div id="wrapper">
    <div id="login-form">
      <section>
        <h3 id="login-title">LOGIN</h3>
        <hr id="breakline"/>

        <b-field label="Email" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="{ 'Email is not available': hasError }">
          <b-input
            type="email" value="" v-model="email"
            maxlength="30" placeholder="nobody@nowhere.com"
          ></b-input>
        </b-field>

        <b-field label="Password" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="[
            { 'Password is too short': hasError },
            { 'Password must have at least 8 characters': hasError }
          ]">
          <b-input 
            value="" type="password" maxlength="30"
            placeholder="password123" v-model="password"
          ></b-input>
        </b-field>

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
        hasError: false
      }
    },

    methods: {
      openSignupModal() {
        this.$emit('open-signup', true)
      },

      login() {
        console.log("button clicked")
        const formdata = {
          email: this.email,
          password: this.password,
        }
        
        axios.post(
          'auth/jwt/create/', formdata
        ).then(response=>{
          this.$router.push("/about") // TODO: redirect to profile page
          console.log(response.data);
          const access_token = response.data.access
          const refresh_token = response.data.refresh
          // axios.defaults.headers.common["Authorization"] = 'Bearer ' + access_token
        }).catch(error =>{
          console.log(error)
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
  background-color: white;
}
</style>