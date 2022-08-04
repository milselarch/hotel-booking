<template>
    <form>
        <div class="modal-card" style="width: auto">

            <header class="modal-card-head">
                <p class="modal-card-title">All user data will be deleted, <br/> this is irreversible</p>
            </header>

            <section class="modal-card-body">
                <b-field label="Confirm password to delete account">
                    class = "input-field"
                    :type="{ 'is-danger': hasError }"
                    :message="password_error">
                    <b-input
                        type="password"
                        password-reveal
                        v-model = "password"
                        placeholder="Please confirm your password"
                        required
                        id = "delete_account_password_field">
                    </b-input>
                </b-field>
            </section>

            <footer class="modal-card-foot">
                <b-button
                    label="Back"
                    id = "close_delete_account_modal"
                    @click="$emit('close_delete_modal')" />
                <b-button
                    label="Confirm"
                    type="is-danger"
                    id = "confirm_delete_account_button"
                    @click.native="delete_account()" />
            </footer>

        </div>
    </form>
</template>

<script>
  import AuthRequester from '@/AuthRequester';

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
        logout(toast=false) {
            const self = this

            if (toast) {
                self.$buefy.toast.open({
                duration: 5000,
                message: `User not logged in`,
                type: 'is-danger',
                pauseOnHover: true
                });
            }

            self.status_text = 'login required'
            self.load_success = false
            self.first_name = null
            self.last_name = null
            self.email = null
            router.push('/')
        },

        delete_account() {
            console.log("deleting account")

            this.password_error = ""
            this.hasError = false

            const formdata = {
                current_password: this.password
            }

            this.deleted = false;
            const requester = new AuthRequester(this)
            let response;
            
            (async () => {
                console.log('LOAD REQ START')
                let data = {
                    "data": formdata
                }
                try {
                    response = await requester.delete('auth/users/me/', {}, data)
                    const status_code = response.status;
                    if (status_code !== 204){
                        console.warn("Deletion Failed")
                        return
                    }
                    this.deleted = true
                    this.$emit("deleted")
                    

                } catch (error) {
                    console.log(error)
                    const status_code = error.response.status;
                    if (status_code === 401) {
                        this.logout(true)
                    } else {
                        this.status_text = 'profile load failed'
                        response = error.response;
                        console.log('LOAD ERR', error);
                        this.hasError = true
                        this.password_error = error.response.data["current_password"]
                    }
                }

                if (!this.deleted) {
                    return false;
                }
            })();

            return true;
            
        }
    }
}
</script>