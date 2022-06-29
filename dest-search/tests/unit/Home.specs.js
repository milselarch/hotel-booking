import Vue from 'vue';
import {shallowMount, mount} from '@vue/test-utils'
import Home from '../../src/components/Home.vue'
// import axios from 'axios'

// jest.mock('axios');

// describe('Test for Home.vue successful http get', () => {
//     let wrapper = null
//     beforeEach(() => {
//         const responseGet = {data: {
//             destinationsLoaded: false,
//             destinationNames: [],
//             destinationMappings: {},
//         }}
//     })
// })

test('test search button', () => {
    let wrapper = mount(Home);

    it('triggers event when search button is pressed', () => {
        wrapper.findAll('b-button').at(0).trigger('click')

        // expect(wrapper.emitted('begin_search')).toBeTruthy()
        // expect(wrapper.emitted('begin_search').length).toBe(1)
        expect(wrapper.vm.begin_search).toBeTruthy()
    })
})
