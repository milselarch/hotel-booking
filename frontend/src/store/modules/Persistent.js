export default {
  modules: {},
  persistent: true,
  state: () => { 
    return {
      persistent_count: 0,
      auth_token: null,
      refresh_token: null,

      hotelName: null,
      hotelDetails: null,
      hotelAmenities: null,
      hotelImages: null,
      hotelId: null,
      destination: null,
      roomName: null,
      roomprice: null,
      checkindate: null,
      checkoutdate: null,
      numrooms: null,
      numguests: null,
      destid: null,
      latitude: null,
      longitude: null,
    }
  },
  mutations: {
    presist_increment(state) {
      state.persistent_count++;
    },

    save_auth_token(state, auth_token) {
      state.auth_token = auth_token
    },

    clear_credentials(state) {
      state.auth_token = null
      state.refresh_token = null
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
    },

    getDetails(state, hotelinfo){
      state.hotelDetails = hotelinfo.desc;
      state.destination = hotelinfo.dest;
      state.hotelName = hotelinfo.name;
      state.hotelImages = hotelinfo.images;
      state.checkindate = hotelinfo.checkin;
      state.checkoutdate = hotelinfo.checkout;
      state.numrooms = hotelinfo.numrooms;
      state.numguests = hotelinfo.numguests;
      state.destid = hotelinfo.destid;
      state.hotelId = hotelinfo.hotelid;
      state.latitude= hotelinfo.lat;
      state.longitude= hotelinfo.long;
    },
    getAmenities(state, amenities){
      state.hotelAmenities = amenities;
    },
    getRoomDetails(state, roominfo) {
      state.roomName = roominfo.name;
      state.roomprice = roominfo.price;
      state.roomTypeId = roominfo.type_id;
      state.roomBreakfastInfo = roominfo.breakfast_info;
      
    }
  },

  getters: {
    authenticated(state) {
      const authenticated = state.auth_token !== null
      // console.log('STATEAUTH', state.auth_token, authenticated)
      return authenticated
    },

    refresh_token(state) {
      const refresh_token = state.refresh_token
      if (refresh_token === null) { return -1 }
      return refresh_token
    }
  }
};