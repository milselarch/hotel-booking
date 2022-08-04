<template>
  <div class="about">
    <h1>About Page</h1>
  </div>  
</template>

<script>
import router from '../router'

export default {
  name: 'PageNotFound',
  mounted() {
    router.push({path: '/'})
  }
} 
</script>