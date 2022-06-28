export default {
  modules: {},
  persistent: true,
  state: {
    persistent_count: 0,
    auth_token: null,
    refresh_token: null
  },
  mutations: {
    initialiseStore(state) {
			// Check if the ID exists
			if (localStorage.getItem('store')) {
				// Replace the state object with the stored item
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store')))
				);
			}
		},
    presist_increment(state) {
      state.persistent_count++;
    },
    
    set_credentials(state, credentials) {
      // https://stackoverflow.com/questions/8511281
      if (
        (typeof credentials !== "object") ||
        (credentials === null)
      ) { 
        console.error('BAD CREDENTIALS', credentials)
        return
      }

      const auth_token = credentials.access
      const refresh_token = credentials.refresh
      if (
        (typeof auth_token !== "string") ||
        (typeof refresh_token !== "string")
      ) {
        console.error('BAD CREDENTIALS', credentials)
        return
      }

      state.auth_token = auth_token
      state.refresh_token = refresh_token
    }
  },

  getters: {
    authenticated (state) {
      const authenticated = state.auth_token !== null
      console.log('STATEAUTH', state.auth_token, authenticated)
      return authenticated
    }
  }
};