<template>
  <div id="hotel-info">
    <h2 id="name"><b>{{hotelName}}</b></h2>
    <!-- <p id="test">
    destination ID: {{dest_id}} <br>hotel ID: {{hotel_id}}<br>guests: {{guests}}<br>dates: {{checkin}} to {{checkout}}
    </p> -->
    <!-- TODO: maybe load hotel images? -->
    <div id="descbox">
      <div id="description" v-html="hotelDetails"></div>
      <div id="amenities">
        <p><font size="4rem"><b>Amenities</b></font></p>
        <ul v-for="(am, key) in this.hotelAmenities" v-bind:key="key">
          <li><font-awesome-icon icon="fa-solid fa-check" color="green"/>        {{key}}</li>
        </ul>
      </div>
    </div>
    
    <div id="room-cards">
      <div
        class="card" 
        v-for="(room, key) in roomList.rooms" v-bind:key="key"
      >
        <div class="card-image">
            <img :src="build_image(room)"
            class="card-image" 
            @error="replace_default_image"
            alt="Room image not found">
        </div>
        <div class="card-content">
          <p class="title is-4">{{ room.roomNormalizedDescription }}</p>
          <!-- <ul>
            <li v-for="(amenity, key) in room.amenities" v-bind:key="key">{{amenity}}</li>
          </ul> -->
          <p>{{ check_breakfast(room) }}</p>
          <p style="font-size:1.5em">SGD <b>{{ room.price }}</b></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BLANK_IMAGE from "@/assets/image_not_found.png"

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
      hotelList: 'def',
      specHotel: 'spec',
      hotelName: 'name',
      hotelDetails: 'details',
      hotelAmenities: 'amenities',
      url: "proxy/hotels/"+ this.hotel_id + "/price"
    }
  },
  methods: {
    //TODO: make slideshow image display
    replace_default_image(e) {
      /*
      load the image not found image if the original
      hotel image fails to load. We need this because
      theres a lot of hotels where the image provided
      actually does not exist in the server
      */
      // https://stackoverflow.com/questions/39009538
      if (e.target.src === BLANK_IMAGE) { return; }
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
    check_breakfast(room){
      if (room.roomAdditionalInfo.breakfastInfo == "hotel_detail_breakfast_included"){
        return "Breakfast included"
      }
      else {
        return "Breakfast not included"
      }
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

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
    })
    if (room_request.data === undefined){
      this.roomList = "undefined";
    }

    this.hotelName = this.$store.state.Store.hotelName;
    this.hotelDetails = this.$store.state.Store.hotelDetails;
    this.hotelAmenities = this.$store.state.Store.hotelAmenities;
    for (let i=0; i<this.hotelAmenities.length; i++){

    }
  },
  
}
</script>

<style lang="scss" scoped>

h2#name{
  text-align: center;
  font-size: 4rem;
}
div#descbox {
  display: inline-block;
  width: 80%;
  border: solid;
  justify-content: center;
}
div#description {
  width: 60%;
  margin: 4rem; 
  float: left;
  text-align: justify;
}
div#amenities {
  margin: 4rem;
}
div#room-cards {
  padding: 5rem;
  background-color: beige;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > .card {
    margin: 1rem;
    width: 55%;
    height: fit-content;

  & img.card-image {
    // preserve aspect ratio for card images
    object-fit: cover;
    height: 14rem;
    max-width: 18rem;
    float: left;
  }

  & > .card-content{
    text-overflow: ellipsis;
    max-height: 19rem;
    overflow-y: scroll;
  }
  }
}

</style>
