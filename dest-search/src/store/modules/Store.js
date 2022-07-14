export default {
  modules: {},
  persistent: false,
  state: {
    count: 0,
    hotelName: null,
    hotelDetails: null,
    hotelAmenities: null,
    hotelImages: null,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    getName(state, name){
      state.hotelName = name;
    },
    getDetails(state, details){
      state.hotelDetails = details;
    },
    getAmenities(state, amenities){
      state.hotelAmenities = amenities;
    },
    getImages(state, images) {
      state.hotelImages = images;
    }
  }
};

