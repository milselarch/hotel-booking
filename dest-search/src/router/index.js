import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import HotelInfo from '../components/HotelInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/hotels/:hotel_id',
    name: 'HotelInfo',
    component: HotelInfo,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
