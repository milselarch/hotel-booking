<template>
  <div
    class="card" style="width: 20rem" 
    ref="cards"
  >
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="build_image_url(hotel)"
        class="card-image" 
        @error="replace_default_image"
        alt="Hotel image not found">
      </figure>
    </div>

    <b-progress class="flat-progress-bar"></b-progress>

    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ hotel['name'] }}</p>
        </div>
      </div>

      <p class="address subtitle is-6">
        {{ hotel['address'] }}
      </p>

      <b-rate 
        v-model="hotel['rating']" :disabled="true"
        :spaced="true"
      />

      <p id="price" v-show="show_price">
        SGD <b>{{ hotel['price'] }}</b>
      </p>
    </div>
  </div>

</template>

<script>
import BLANK_IMAGE from "@/assets/image_not_found.png"

export default {
  name: 'HotelCard',
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
    build_image_url(hotel_data) {
      const image_details = hotel_data.image_details;
      const prefix = image_details.prefix;
      const image_no = hotel_data.default_image_index;
      const suffix = image_details.suffix;

      const image_count = hotel_data.imageCount;
      if (image_count === 0) {
        return BLANK_IMAGE;
      }

      return `${prefix}${image_no}${suffix}`
    },
  },
  computed: {
    show_price() {
      return this.hotel['price'] !== undefined
    }
  },
  props: ['hotel']
}
</script>

<style lang="scss" scoped>
p.address {
  margin-bottom: 0.2rem;
}

p#price {
  font-size: 1.5rem;
}

.card {
  margin: 1rem;
  cursor: pointer;

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
</style>