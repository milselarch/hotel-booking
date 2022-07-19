<template>
    <form>
        <div class="modal-card" style="width: auto">

            <header class="modal-card-head">
                <p class="modal-card-title">All user data will be deleted, <br/> this is irreversible</p>
            </header>

            <section class="modal-card-body">
                <b-field label="Confirm password to delete account"
                    class = "input-field"
                    :type="{ 'is-danger': hasError }"
                    :message="password_error">
                    <b-input
                        type="password"
                        password-reveal
                        v-model = "password"
                        placeholder="Please confirm your password"
                        required>
                    </b-input>
                </b-field>
            </section>

            <footer class="modal-card-foot">
                <b-button
                    label="Back"
                    @click="$emit('close_delete_modal')" />
                <b-button
                    label="Confirm"
                    type="is-danger"
                    @click="delete_account()" />
            </footer>

        </div>
    </form>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'DeleteAccount',

    data() {
      return {
        password: '',
        password_error: "",
        hasError: false,
      }
    }, 

    methods: {
      delete_account() {
        console.log("deletion test")

        this.password_error = ""
        this.hasError = false
        
        const formdata = {
          current_password: this.password,
        }

        axios.delete(
            'auth/users/me/', 
            formdata

        ).then(response => {
            console.log('Account deleted')
            // console.log(response.data);
            this.$emit("deleted")
        
        }).catch(err =>{
            console.log(err.response.data)
            this.password_error = "Wrong password provided"
            this.hasError = true
        })
      }
    }
  }
</script>