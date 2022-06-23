<template>
  <p id="test">
    {{ hotel_id }}
  </p>
</template>

<script>

export default {
  name: 'HotelInfo',
  props: {
    hotel_id: {
      type: String,
      default: "TEST"
    }
  }
}
</script>

<style lang="scss" scoped>

p#test {
  margin: 4rem; 
}

</style>
