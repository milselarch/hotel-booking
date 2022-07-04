<template>
  <div class="about">
    <h1>Testing room details</h1>
    <div id="room-cards">
      <div
        class="card" 
        v-for="(room, key) in rooms.rooms" v-bind:key="key"
      >
        <div class="card-image">
          <!-- <figure class="image is-4by3"> -->
            <img :src="build_image(room)"
            class="card-image" 
            @error="replace_default_image"
            alt="Room image not found">
          <!-- </figure> -->
        </div>
        <div class="card-content">
          <p class="title is-4">{{ room.roomNormalizedDescription }}</p>
          <!-- <ul>
            <li v-for="(amenity, key) in room.amenities" v-bind:key="key">{{amenity}}</li>
          </ul> -->
          <p>{{ check_breakfast(room) }}</p>
          <p style="font-size:1.5em">SGD <b>{{ check_price(room) }}</b></p>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import Roomlistean from '../../json-samples/fullertonean.json';
import Roomlistbeds from '../../json-samples/fullertonbedscom.json';
import Roomlistwgl from '../../json-samples/fullertonwgl.json';
import BLANK_IMAGE from "@/assets/image_not_found.png"

export default {
  name: 'About',
  data() {
    return{
      rooms: Roomlistean,
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
    },
    check_price(room){
      let cheaper = room.price;
      for (let other in Roomlistbeds.rooms){
        if (Roomlistbeds.rooms[other].key == room.key){
          cheaper = Math.min(Roomlistbeds.rooms[other].price, cheaper)
        }
      }
      for (let another in Roomlistwgl.rooms){
        if (Roomlistwgl.rooms[another].key == room.key){
          cheaper = Math.min(Roomlistwgl.rooms[another].price, cheaper)
        }
      }
      return cheaper
    }
  }
}
</script>

<style lang="scss" scoped>
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
    // width: 16rem;
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