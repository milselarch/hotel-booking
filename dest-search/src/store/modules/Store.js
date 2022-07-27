export default {
  modules: {},
  persistent: false,
  state: () => {
    return {
      count: 0,
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
    increment(state) {
      state.count++;
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
  }
};

