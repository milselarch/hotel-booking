export default {
  modules: {},
  persistent: false,
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
};

