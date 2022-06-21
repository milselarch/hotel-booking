<template>
  <div class="about">
    <h1>Testing room details</h1>
    <div id="room-cards">
      <div
        class="card" style="width: 20rem" 
        v-for="(room, key) in rooms.rooms" v-bind:key="key"
      >
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="build_image(room)"
            class="card-image" 
            @error="replace_default_image"
            alt="Room image not found">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ room.roomNormalizedDescription }}</p>
              <!-- <ul>
                <li v-for="(amenity, key) in room.amenities" v-bind:key="key">{{amenity}}</li>
              </ul> -->
              <p>{{ check_breakfast(room) }}</p>
              <p style="font-size:1.5em">SGD <b>{{ room.price }}</b></p>
            </div>
          </div>

          <!-- <p class="address subtitle is-6">
            {{ hotel['address'] }}
          </p> -->

          <!-- <div class="content clipped" v-html="hotel['description']">
          </div> -->
        </div>
      </div>
    </div>
  </div>

  
</template>
<script>
import Roomlist from '../../json-samples/fullertonean.json';
import BLANK_IMAGE from "@/assets/image_not_found.png"

export default {
  name: 'About',
  data(){
    return{
      rooms: Roomlist,
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
      if (e.target.src == BLANK_IMAGE) { return; }
      e.target.src = BLANK_IMAGE;
    },
    build_image(room){
      const images = room.images;
      if (images.length > 0){
        const url = images[0];
        // console.log(Object.values(url)[0]);
        return Object.values(url)[0];
      }
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
  mounted(){
    this.check_breakfast()
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

    & img.card-image {
      // preserve aspect ratio for card images
      object-fit: cover;
    }

    & > .card-content > div.content {
      text-overflow: ellipsis;
      max-height: 19rem;
      overflow-y: scroll;
      padding-right: 0.5rem;
    }
  }
}
</style>