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

    <b-progress 
      class="flat-progress-bar"
      v-bind:class="{invisible: !is_loading}"
    ></b-progress>
    
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
        SGD <b>{{ hotel_price }}</b>
      </p>
    </div>
  </div>

</template>

<script>
import BLANK_IMAGE from "@/assets/cityscape.jpg"
import assert from 'assert'

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
      const hotel_id = this.hotel.id;
      assert(typeof hotel_id === 'string')
      if (!this.price_map.hasOwnProperty(this.search_stamp)) {
        return false
      }

      const prices = this.price_map[this.search_stamp]
      // console.log('PRICES', this.price_map, this.search_stamp)
      return prices.hasOwnProperty(hotel_id)
    },

    hotel_price() {
      const hotel_id = this.hotel.id;
      assert(typeof hotel_id === 'string')
      if (!this.show_price) { return -1 }

      const price_cache = this.price_map[this.search_stamp]
      const hotel_price = price_cache[hotel_id].price
      return hotel_price
    }
  },

  props: {
    'hotel': Object,
    'price_map': Object,
    'search_stamp': {
      type: Number,
      default: -1
    }, 'is_loading': {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
p.address {
  margin-bottom: 0.2rem;
}

p#price {
  font-size: 1.5rem;
}

.flat-progress-bar {
  margin: 0px;
}

.invisible {
  opacity: 0;
}

.card {
  margin: 1rem;
  cursor: pointer;

  & img.card-image {
    // preserve aspect ratio for card images
    object-fit: cover;
  }

  & > .card-content {
    padding: 1.5rem;
    padding-top: 1rem;
  }

  & > .card-content > div.content {
    text-overflow: ellipsis;
    max-height: 19rem;
    overflow-y: scroll;
    padding-right: 0.5rem;
  }
}
</style>