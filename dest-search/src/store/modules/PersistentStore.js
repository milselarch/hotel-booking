export default {
  modules: {},
  state: {
    persistent_count: 0
  },
  mutations: {
    initialiseStore(state) {
			// Check if the ID exists
			if(localStorage.getItem('store')) {
				// Replace the state object with the stored item
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store')))
				);
			}
		},
    increment(state) {
      state.persistent_count++;
    }
  }
};