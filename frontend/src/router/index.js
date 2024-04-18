import Vue from 'vue'
import VueRouter from 'vue-router'
import BookingHistory from '../components/BookingHistory.vue'
import Booking from '../components/Booking.vue'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Profile from '../components/Profile.vue'
import HotelInfo from '../components/HotelInfo.vue'
import PageNotFound from '../components/PageNotFound.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }, {
    path: '/about',
    name: 'About',
    component: About
  }, {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }, {
    path: '/hotels/:country_code/:dest_id/:hotel_id/:guests/:checkin/:checkout',
    name: 'HotelInfo',
    component: HotelInfo,
    props: true
  }, {
    path: '/booking',
    name: 'Booking',
    component: Booking,
  }, {
    path: '/bookinghistory',
    name: 'BookingHistory',
    component: BookingHistory,
  }
]

const router = new VueRouter({
  routes
})

export default router
