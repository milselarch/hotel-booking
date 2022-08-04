import Booking from "../../src/components/Booking.vue"
import { createLocalVue, mount, flushPromises, shallowMount } from '@vue/test-utils'
import SignUp from '../../src/components/SignUp.vue'
import Login from '../../src/components/Login.vue'
import Profile from '../../src/components/Profile.vue'
import DeleteAccount from "../../src/components/DeleteAccount.vue"
import VuexAttach from '../../src/store/VuexAttach.js'
import AuthRequester from '../../src/AuthRequester.js'
import router from '../../src/router'
import App from '../../src/App.vue'
import Buefy from 'buefy'
import User from './User.js'
import axios from 'axios'
import Vuex from 'vuex'
import sleep from 'await-sleep'
import stubs from './stubs.js'
import { assert, time } from 'console'
import VueCardFormat from 'vue-credit-card-validation';
import { data } from "jquery"

const segfault_handler = require('segfault-handler');
const fs = require('fs');
const mock = require('./mock.js');

segfault_handler.registerHandler('crash.log');
segfault_handler.registerHandler('crash.log');
// console.error("DIRNAME", __dirname);
// console.log("DIR PARSE DONE", __dirname);

const test_folder = 'src/store/modules';
fs.readdirSync(test_folder).forEach(file => {
    // console.log(file);
});

const crypto = require("crypto");
const infiniteScroll = require('vue-infinite-scroll');
const localVue = createLocalVue();

localVue.config.silent = true;
localVue.use(infiniteScroll)
localVue.use(Vuex)
localVue.use(Buefy)
localVue.use(VueCardFormat)
// localVue.use(ElementUI)

describe('Booking Test', () => {
    let store;
    let wrapper_booking;
    let bookingForm;
    let title_select_field;
    let first_name_field;
    let last_name_field;
    let country_phone_select_field;
    let phone_num_field;
    let email_field;
    let special_requests_field;
    let cc_num_field;
    let cc_name_field;
    let cc_expiry_date_field;
    let cvc_field;
    let country_select_field;
    let city_field;
    let address_field;
    let postal_field;
    let checkbox_field;
    let booking_button;

    const mockRouter = {
        push: jest.fn()
      }

    beforeEach(() => {
        // trick axios into thinking its running on the browser
        // otherwise all requests will report with NetworkError
        axios.defaults.adapter = require('axios/lib/adapters/http');
        axios.defaults.baseURL = "http://127.0.0.1:8000/"

        const attacher = new VuexAttach(localVue);
        store = attacher.create_store(mock.modules);
        store.commit('initialize_store');

        const state_key = 'state'
        const persistent_key = 'Persistent'
        let store_arr = []
        store_arr[state_key] = []
        store_arr[state_key][persistent_key] = []
        const saved_storage = store_arr[state_key]
        const persistent = saved_storage[persistent_key]

        const hotel_name_key = 'hotelName'
        const room_type_key = 'roomName'
        const room_type_id_key = 'roomTypeId'
        const room_breakfast_info_key = 'roomBreakfastInfo'
        const destination_region_key = 'destination'
        const check_in_date_key = 'checkindate'
        const check_out_date_key = 'checkoutdate'
        const number_of_rooms_key = 'numrooms'
        const number_of_guests_key = 'numguests'
        const roomprice_key = 'roomprice'
        const destination_id_key = 'destid'
        const hotel_id_key = 'hotelId'

        persistent[hotel_name_key] = "my_hotel_name"
        persistent[room_type_key] = "my_room_type_key"
        persistent[room_type_id_key] = "my_room_type_id_key"
        persistent[room_breakfast_info_key] = "my_room_breakfast_info_key"
        persistent[destination_region_key] = "my_destination_region_key"
        persistent[check_in_date_key] = "my_check_in_date_key"
        persistent[check_out_date_key] = "my_check_out_date_key"
        persistent[number_of_rooms_key] = 2
        persistent[number_of_guests_key] = 3
        persistent[destination_id_key] = "my_destination_id_key"
        persistent[hotel_id_key] = "my_hotel_id_key"
        persistent[roomprice_key] = 100
        console.log(store_arr)
        store.hotUpdate(JSON.stringify(store_arr))

        Booking.primaryGuestRadioButton = "Nope";
        Booking.countryCodeSelect = "Singapore +65";
        Booking.title = "MR";
        Booking.ba_country = "Singapore";
        Booking.all_key_info_exists = false;
        Booking.display_no_data_error = false;
        Booking.destination_id = "my_dest_id";
        Booking.destination_region = "my_destination_region";
        Booking.hotel_id = "hotel_id";
        Booking.hotel_name = "my_hotel_name";
        Booking.room_type_id = "my_room_type_id";
        Booking.room_type = "my_room_type";
        Booking.room_breakfast_info = "my_room_breakfast_info";
        Booking.booking_id = "";
        Booking.check_in_date = "2022-01-01";
        Booking.check_out_date = "2022-01-31";
        Booking.number_of_rooms = 0;
        Booking.number_of_guests = 0;
        Booking.total_cost = 0;
        Booking.special_requests = "";
        Booking.first_name = "";
        Booking.last_name = "";
        Booking.phone = "";
        Booking.email = "";
        Booking.cc_name = "";
        Booking.cc_number = "";
        Booking.cc_expiry_date = "";
        Booking.cc_cvc = "";
        Booking.ba_address = "";
        Booking.ba_city = null;
        Booking.ba_postal_code = "";
        Booking.termsCheckBoxGroup = "";
        Booking.temp_expiry_date_str = "";
        Booking.first_name_error = {};
        Booking.last_name_error = {};
        Booking.email_error = {};
        Booking.phone_error = {};
        Booking.title_error = {};
        Booking.countryCodeSelect_error = {};
        Booking.special_requests_error = {};
        Booking.cc_number_error = "";
        Booking.cc_expiry_date_error = {};
        Booking.cc_cvc_error = {};
        Booking.cc_name_error = {};
        Booking.ba_country_error = {};
        Booking.ba_city_error = {};
        Booking.ba_address_error = {};
        Booking.ba_postal_code_error = {};
        Booking.termsCheckBoxGroup_error = {};
        Booking.other_errors = "";
        Booking.hasError = false;
        Booking.pending = false;
        Booking.status = "";

        Booking.primary_guest_phone = "";

        console.log(store)

        wrapper_booking = mount(Booking, {
            shallow: true,
            store,
            localVue,
            global: {
                mocks: {
                    $router: mockRouter
                }
            }
        })
        wrapper_booking.$store = store

        //has form fields
        bookingForm = wrapper_booking.find('#bookingForm')
        title_select_field = wrapper_booking.find('#title_select_field')
        first_name_field = wrapper_booking.find('#first_name_field')
        last_name_field = wrapper_booking.find('#last_name_field')
        country_phone_select_field = wrapper_booking.find('#country_phone_select_field')
        phone_num_field = wrapper_booking.find('#phone_num_field')
        email_field = wrapper_booking.find('#email_field')
        special_requests_field = wrapper_booking.find('#special_requests_field')
        cc_num_field = wrapper_booking.find('#cc_num_field')
        cc_name_field = wrapper_booking.find('#cc_name_field')
        cc_expiry_date_field = wrapper_booking.find('#cc_expiry_date_field')
        cvc_field = wrapper_booking.find('#cvc_field')
        country_select_field = wrapper_booking.find('#country_select_field')
        city_field = wrapper_booking.find('#city_field')
        address_field = wrapper_booking.find('#address_field')
        postal_field = wrapper_booking.find('#postal_field')
        checkbox_field = wrapper_booking.find('#checkbox_field input[type="checkbox"]')
        booking_button = wrapper_booking.find('#booking_button')


    })


    it('booking form initalizes all key fields and button is disabled', async () => {

        expect(bookingForm.exists()).toBeTruthy()
        expect(title_select_field.exists()).toBeTruthy()
        expect(first_name_field.exists()).toBeTruthy()
        expect(last_name_field.exists()).toBeTruthy()
        expect(country_phone_select_field.exists()).toBeTruthy()
        expect(phone_num_field.exists()).toBeTruthy()
        expect(email_field.exists()).toBeTruthy()
        expect(special_requests_field.exists()).toBeTruthy()
        expect(cc_num_field.exists()).toBeTruthy()
        expect(cc_name_field.exists()).toBeTruthy()
        expect(cc_expiry_date_field.exists()).toBeTruthy()
        expect(cvc_field.exists()).toBeTruthy()
        expect(country_select_field.exists()).toBeTruthy()
        expect(city_field.exists()).toBeTruthy()
        expect(address_field.exists()).toBeTruthy()
        expect(postal_field.exists()).toBeTruthy()
        expect(checkbox_field.exists()).toBeTruthy()
        expect(booking_button.exists()).toBeTruthy()

        await wrapper_booking.vm.$nextTick()
        // check if button is disabled
        expect(booking_button.attributes().disabled).toBeDefined()
        // await wrapper_booking.vm.$nextTick()

    });

    it('booking form set fields, button is enabled, click button', async () => {

        //fill in key details and data should be editable
        first_name_field.setValue("John")
        last_name_field.setValue("Doe")
        email_field.setValue("John@email.com")
        phone_num_field.setValue("91111111")
        cc_name_field.setValue("John Doe")
        cc_num_field.setValue("4263982640269299")
        cc_expiry_date_field.setValue("02/2028")
        cvc_field.setValue("111")
        address_field.setValue("Hougang ave 3 blk 333 #09-101")
        city_field.setValue("Singapore")
        postal_field.setValue("533979")
        checkbox_field.setChecked(true)

        await wrapper_booking.vm.$nextTick()

        expect(booking_button.attributes().disabled).toBe(undefined);

        // await wrapper_booking.vm.$nextTick()

        // let auth_resp = {"refresh":123456789}
        // jest.spyOn(axios, 'post').mockResolvedValue(auth_resp)
        // await booking_button.trigger('click')
        // // expect(mockRouter.push).toHaveBeenCalledWith('/auth/users/')
        // await wrapper_booking.vm.$nextTick()
        // expect(mockRouter.push).toHaveBeenCalledTimes(1)

        // await wrapper_booking.vm.$nextTick()

    });
})