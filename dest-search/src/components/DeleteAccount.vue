<template>
    <form>
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">All user data will be deleted, <br/> this is irreversible</p>
            </header>
            <section class="modal-card-body">
                <b-button
                    label="Back"
                    @click="$emit('close')" />
                <b-button
                    label="Confirm"
                    type="is-danger"
                    @click="delete_account()" />
            </section>
        </div>
    </form>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'DeleteAccount',

    data() {
      return
    }, 

    methods: {
      delete_account() {
        console.log("deletion test")
        // const self = this;
        // self.pending = true;

        // console.log("button clicked")
        // const formdata = {
        //   email: this.email,
        //   password: this.password,
        // }

        // self.hasError = false;
        // self.email_error = {};
        // self.password_error = {};
        // self.other_errors = ''

        // axios.post(
        //   'auth/jwt/create/', formdata
        // ).then(response => {
        //   console.log('JWT CREATE SUCCESS')
          
        //   const credentials = response.data
        //   this.$store.commit('set_credentials', credentials)
        //   this.$emit('login-done', formdata)

        //   // console.log(response.data);
        //   // const access_token = response.data.access
        //   // const refresh_token = response.data.refresh
        //   // axios.defaults.headers.common["Authorization"] = 'Bearer ' + access_token
        
        // }).catch(err_resp =>{
        //   // console.log('ERR_RESP', err_resp)
        //   let errors = err_resp.response.data
        //   const other_errors = []

        //   if (errors === undefined) {
        //     other_errors.push(err_resp.message)
        //     errors = []
        //   }

        //   if (errors.hasOwnProperty('email')) {
        //     self.email_error = errors['email']
        //   } if (errors.hasOwnProperty('password')) {
        //     self.password_error = errors['password']
        //   }

        //   console.error('ERRORS', errors)

        //   for (let cause in errors) {
        //     // only go through errors not covered already
        //     if (formdata.hasOwnProperty(cause)) { continue; }
        //     const reasons = errors[cause];
        //     if (reasons instanceof Array) {
        //       other_errors.push(...errors[cause])
        //     } else {
        //       other_errors.push(errors[cause])
        //     }
        //   }

        //   console.log('OERRROS-LKOGIN', other_errors)
        //   self.other_errors = other_errors.join('\n');
        //   this.hasError = true;
        
        // }).finally(() => {
        //   // simulate a delay for loading a response
        //   // setTimeout(() => { self.pending = false }, 1000)
        //   self.pending = false;
        // })
      }
    }
  }
</script>