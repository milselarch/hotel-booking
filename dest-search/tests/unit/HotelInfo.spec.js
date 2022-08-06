// http://localhost:8080/#/hotels/SG/3W9U/fPfV/2/2022-08-30/2022-08-31
// shangrila hotel

import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import HotelInfo from '../../src/components/HotelInfo.vue'
import axios from 'axios'
import small_stubs from './small_stubs';
import Vuex from 'vuex'
import Buefy from 'buefy'
import VuexAttach from '../../src/store/VuexAttach.js'
import VueRouter from 'vue-router'
import {routes} from '../../src/router'


const mock = require('./mock.js');
const localVue = createLocalVue();
localVue.config.silent = true;
localVue.use(Vuex);
localVue.use(Buefy);
localVue.use(VueRouter);
// const $route = {
//     path: "/hotels/SG/3W9U/fPfV/2/2022-08-30/2022-08-31"
// }

const router = new VueRouter({
    routes: routes
})
// console.log("ROUTES", router);

describe('HotelInfo.vue testing', () => {
    let wrapper, store;
    beforeEach(() => {
        axios.defaults.adapter = require('axios/lib/adapters/http');
        axios.defaults.baseURL = "http://127.0.0.1:8080/"

        const attacher = new VuexAttach(localVue);
        store = attacher.create_store(mock.modules);

        // router.push("/hotels/SG/3W9U/fPfV/2/2022-08-30/2022-08-31")

        // wrapper = mount(HotelInfo, {
        //     stubs: small_stubs,
        //     store, localVue,
        // })
    })

    test('routing', async () => {
        router.push("/hotels/SG/3W9U/fPfV/2/2022-08-30/2022-08-31")

        const wrapper = shallowMount(HotelInfo, {
            stubs: small_stubs,
            store, localVue, router,
        })
        // wrapper.vm.$route.path
        console.log("HTML",wrapper.html());
        expect(wrapper.vm.$route.path).toContain('hotels')

    })

    // it('check hotel url', () => {
    //     let hotelName = wrapper.find('h2#name')
    //     expect(wrapper.html()).toContain('hotels')
    //     // expect(hotelName.text()).toMatch("Shangri-La's Rasa Sentosa Resort & Spa")
    // })

    afterEach(() => {
        wrapper.destroy();
    })
})