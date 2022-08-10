<template>
  <div id="hotel-info">
    <h2 id="name"><b>{{hotelName}}</b></h2>
    <div id="figures">
      <b-carousel id="carousel" v-if="check_carousel" :indicator=true indicator-custom indicator-inside=false pause-text="paused" indicator-custom-size="is-medium">
      <b-carousel-item id="carouselimg" v-for="(img, i) in this.hotelImages.count" v-bind:key="i">
        <b-image class="image" :src="build_carousel(i)" @error="replace_default_image"></b-image>
      </b-carousel-item>
      <template #indicators="props" v-if="check_carousel">
          <figure :draggable="false">
              <img id="gallery" :draggable="false" :src="build_carousel(props.i)" :title="props.i">
          </figure>
      </template>
    </b-carousel>
    <a target="_blank" :href="`https://maps.google.com/?q=${this.latitude},${this.longitude}`"> <img id="map" :src="build_map(this.latitude, this.longitude)"> </a>
    </div>
    
    <div id="descbox">
      <div id="description" v-html="hotelDetails"></div>
      <div id="amenities" v-if="check_amenities">
        <p><font size="4rem"><b>Amenities</b></font></p>
        <ul v-for="(am, key) in this.hotelAmenities" v-bind:key="key">
          <font-awesome-icon v-show="formatAmenities(key)!=null" icon="fa-solid fa-check" color="green"/><li v-show="formatAmenities(key)!=null">{{formatAmenities(key)}}</li>
        </ul>
        <!-- <p>{{hotelAmenities}}</p> -->
      </div>
    </div>
    
    <div id="room-cards">
      <!-- <p v-if="!check_avail"><font size="+2"><b>No rooms available. Try changing specifications.</b></font></p> -->
      <square id="spinner" v-show="is_loading"></square>
      <p>{{status}}</p>
      <div
        class="card" 
        v-for="(room, key) in roomList.rooms" v-bind:key="key"
        @click="select_room(room)" style="cursor:pointer;"
      >
        <div class="card-image">
          <img :src="build_image(room)"
          class="card-image" 
          @error="replace_default_image"
          alt="Room image not found">
        </div>
        <div id="room-details">
          
          
          <p id="roomname" class="title is-4">{{ room.roomNormalizedDescription }}</p>
          <p id="breakfast"><b>{{ check_breakfast(room) }}</b></p>
          <div class="card-content">
            <ul v-for="(am, key) in room.amenities" v-bind:key="key">
              <li>{{am}}</li>
            </ul>
          </div>
          <div class="price" style="font-size:1.8em">SGD <b>{{ room.price }}</b></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BLANK_IMAGE from "@/assets/cityscape.jpg"
import router from '../router'

export default {
  name: 'HotelInfo',
  props: {
    country_code: {
      type: String
    },
    hotel_id: {
      type: String,
      default: "TEST"
    },
    dest_id: {
      type: String,
      default: "testing"
    },
    guests: {
      type: String,
      default: "guests"
    },
    checkin: {
      type: String
    },
    checkout: {
      type: String
    }
  },
  data(){
    return {
      roomList: 'a',
      hotelName: 'name',
      hotelDetails: 'details',
      hotelAmenities: 'amenities',
      hotelImages: 'images',
      url: "proxy/hotels/"+ this.hotel_id + "/price",

      is_loading: true,
      status: "",

      latitude: 'lat',
      longitude: 'long',

      noimage: false
    }
  },
  methods: {
    //TODO: make slideshow image display
    build_carousel(img) {
      var prefix = this.hotelImages.prefix
      var suffix = this.hotelImages.suffix
      return `${prefix}${img}${suffix}`
    },
    replace_default_image(e) {
      /*
      load the image not found image if the original
      hotel image fails to load. We need this because
      theres a lot of hotels where the image provided
      actually does not exist in the server
      */
      // https://stackoverflow.com/questions/39009538
      this.noimage = true
      if (e.target.src === BLANK_IMAGE) { 
        return; 
      }
      e.target.src = BLANK_IMAGE;
    },
    build_image(room){
      const images = room.images;
      if (images.length === 0) {
        return BLANK_IMAGE;
      }
      const url = images[0];
      // console.log(Object.values(url)[0]);
      return Object.values(url)[0];
    },
    build_map(lat, long) {
      // console.log('PROCESS_ENV', process.env)
      // console.log('MAPS-KEY', process.env.VUE_APP_GOOGLE_API_KEY)
      return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}
      &size=500x400
      &markers=${lat},${long}
      &key=${process.env.VUE_APP_GOOGLE_API_KEY}`
    },
    
    check_breakfast_func(breakfastInfo) {
      if (breakfastInfo == "hotel_detail_breakfast_included"){
        return "Breakfast included"
      }
      else if (breakfastInfo == "hotel_detail_room_only"){
        return "Breakfast not included"
      }
      else {
        breakfastInfo = breakfastInfo.replace("hotel_detail_","").replaceAll("_"," ")
        breakfastInfo = breakfastInfo.charAt(0).toUpperCase() + breakfastInfo.slice(1).toLowerCase()
        let temp_breakfastInfo = breakfastInfo
        if(!temp_breakfastInfo.toLowerCase().includes('breakfast'.toLowerCase())) {
          breakfastInfo = "Breakfast: " + breakfastInfo
        }
        
        return breakfastInfo
      }
    },
    check_breakfast(room){
      if(room && room.roomAdditionalInfo && room.roomAdditionalInfo.breakfastInfo){
        return " (" + this.check_breakfast_func(room.roomAdditionalInfo.breakfastInfo) + ")"
      }
      else{
        return ""
      }      
    },
    formatAmenities(am){
      //amenities are read as exampleAmenityTV
      if (am === ""){
        return null
      }
      else {
        var str = am
        str = str[0].toUpperCase() + str.slice(1)
        str = str.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g).join(" ")
        return str
      }
    },
    select_room(room){
      console.log("room:", room);
      console.log("room select:", room.roomNormalizedDescription);
      var roominfo = {
        name: room.roomNormalizedDescription,
        type_id: room.type,
        breakfast_info: room.roomAdditionalInfo.breakfastInfo,
        price: room.price
      }
      
      //if user logged in 
      if (this.$store.getters.authenticated) {
        this.$store.commit("getRoomDetails", roominfo)
        router.push("/booking");
      }
      
      //if not logged in 
      if (!this.$store.getters.authenticated) {
        // toast
        this.$buefy.toast.open({
          duration: 5000,
          message: `Please sign up or login to proceed with booking!`,
          type: 'is-danger',
          pauseOnHover: true
        });
        this.$emit('open-signup', true)
      }
      
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const room_request = axios.get(this.url, {
      params: {
        destination_id: this.dest_id,
        checkin: this.checkin,
        checkout: this.checkout,
        lang: 'en_US',
        currency: 'SGD',
        partner_id: '16',
        country_code: 'SG',
        guests: this.guests
      }
    }).then((getResponse) => {
      console.log("GET Response");
      console.log(getResponse.data);
      this.roomList = getResponse.data.proxy_json;
      this.is_loading = false;
      if (getResponse.data.proxy_json.completed == true && Object.keys(this.roomList.rooms).length == 0){
        console.log("NO ROOMS");
        this.status= "No rooms available."
      }
    })

    this.hotelName = this.$store.state.Persistent.hotelName;
    this.hotelDetails = this.$store.state.Persistent.hotelDetails;
    this.hotelAmenities = this.$store.state.Persistent.hotelAmenities;
    this.hotelImages = this.$store.state.Persistent.hotelImages;
    this.latitude = this.$store.state.Persistent.latitude;
    this.longitude = this.$store.state.Persistent.longitude;
  },
  computed: {
    check_amenities(){  
      if (Object.keys(this.hotelAmenities).length != 0){
        console.log(Object.keys(this.hotelAmenities));
        return true
      }
      else {
        return false
      }
    },
    check_carousel(){
      if (this.noimage == true){
        return false;
      }
      else {return true;}
    }
  }
}
</script>

<style lang="scss" scoped>

h2#name{
  padding: 1.5rem;
  text-align: center;
  font-size: 4rem;
  // margin-bottom: 1rem;
}
#figures{
  display: flex;
  width: 80%;
  margin: auto;
  justify-content: space-around;
}
#carousel {
  // margin: auto;
  margin-bottom: 3rem;
  // margin-left: 10%;
  display: flex; //grid for columns
  // grid-template-columns: auto 25%;
  // justify-content: center;
  // align-items: center;
  width: 30rem;
  height: 30rem;
  // border: solid;
}
#carouselimg {
  margin: auto;
  margin-top: 0;
  max-width: 30rem;
  max-height: 20rem;
  object-fit: cover;
  vertical-align: middle;
}
#gallery {
  flex-direction: column;
  vertical-align: bottom;
  // border: solid;
}
#map{
  // float: right;
  margin: auto;
  margin-bottom: 3rem;
}

div#descbox {
  display: flex;
  width: 80%;
  justify-content: center;
  margin: auto;
  border-top: solid;
}
div#description {
  width: 70%;
  margin-top: 3rem;
  text-align: justify;
  padding-left: 2rem;
}
div#amenities {
  padding: 1.5rem;
  padding-left: 2.5rem;
  margin-top: 3rem;
  margin-left: 5rem;
  width: 24rem;
  min-width: max-content;
  background-color: rgb(255, 248, 233);
  height: max-content;
  line-height: 2rem;
}
#roomname {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
}
#breakfast {
  margin-left: 1rem;
}
div#room-cards {
  padding: 5rem;
  margin-top: 5rem;
  background-color: rgb(255, 248, 233);

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > .card {
    margin: 1rem;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  & img.card-image {
    // preserve aspect ratio for card images
    object-fit: cover;
    height: 17rem;
    max-width: 18rem;
    // float: left;
  }
}
#room-details {
  display: flex;
  flex-direction: column;
  max-height: 17rem;
  width: 33rem;
}
.card-content{
  text-overflow: ellipsis;
  height: 11rem;
  overflow-y: scroll;
  padding: 0;
  padding-left: 1rem;
}
.price{
  float: right;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  align-self: flex-end;
}

a {
  text-align: center;
  margin: 0;
  height: fit-content;
}
</style>
