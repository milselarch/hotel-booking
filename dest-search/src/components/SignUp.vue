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
            placeholder="password123"
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
            placeholder="password123"
          ></b-input>
        </b-field>


        <div class="button-controls">
          <b-button 
            type="is-dark" id="signup" class="fat-button"
          >
            Sign Up
          </b-button>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'SignUp',

    data() {
      return {
        hasError: false
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