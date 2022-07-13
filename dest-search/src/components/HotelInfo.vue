<template>
  <div id="hotel-info">
    <p id="test">
    destination ID: {{dest_id}} <br>hotel ID: {{hotel_id}}<br>guests: {{guests}}<br>dates: {{checkin}} to {{checkout}}
    </p>
    <p>{{specHotel}}</p>
    <p>{{hotelList[2]}}</p>
    <p id="description">DESC</p>
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
      url: "proxy/hotels/"+ this.hotel_id + "/price"
    }
  },
  methods: {
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

    const hotel_request = axios.get("proxy/hotels", {
      params: {
        destination_id: this.dest_id
      }
    }).then((getResponse) => {
      this.hotelList = getResponse.data.proxy_json;
    })

    // console.log("help", hotelList[2]);
    // for (let i=0; i<this.hotelList.length; i++){
    //   console.log(this.hotelList[i]['id']);
    //   if (this.hotelList[i]['id'] == this.hotel_id){
    //     console.log("loaded hotel", hotelList[i]['id']);
    //     this.specHotel = hotelList[i];
    //   }
    // }
  }
  
}
</script>

<style lang="scss" scoped>

p#test {
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
