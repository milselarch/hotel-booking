<template>
  <div id="wrapper">
    <div id="login-form">
      <section>
        <h3 id="login-title">SIGN UP</h3>
        <hr id="breakline"/>

        <b-field label="Email" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="{ 'Email is not available': hasError }">
          <b-input
            type="email" value=""
            maxlength="30" placeholder="nobody@nowhere.com"
            v-model="email"
          ></b-input>
        </b-field>

        <b-field label="Name" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="{ 'Please check your name': hasError }">
          <b-input
            value="" maxlength="30" placeholder="John Doe"
            v-model="name"
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

        <b-field label="Confirm Password" class="input-field"
          :type="{ 'is-danger': hasError }"
          :message="[
            { 'Password is too short': hasError },
            { 'Password must have at least 8 characters': hasError }
          ]">
          <b-input 
            value="" type="password" maxlength="30"
            placeholder="password123" v-model="re_password"
          ></b-input>
        </b-field>


        <div class="button-controls">
          <b-button 
            type="is-dark" id="signup" class="fat-button" @click="signup()"
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
        hasError: false
      }
    },
    methods: {
      signup() {
        const formdata = {
          email: this.email,
          name: this.name,
          password: this.password,
          re_password: this.re_password,
        }
        
        axios
          .post('auth/users/', formdata)
          .then(response=>{
            this.$router.push("/about") // TODO: change to open login modal
          })
          .catch(error =>{
            console.log(error)
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
  background-color: white;
}
</style>