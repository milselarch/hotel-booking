import Vue from 'vue';
import {shallowMount, mount} from '@vue/test-utils'
import Home from '../../src/components/Home.vue'
import Buefy from 'buefy'
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

describe('Home.vue Test', () => {
  it('check message when component is created', () => {
    // render the component
    const wrapper = shallowMount(Home, {
      propsData: {
        msg: 'Welcome to Your Vue.js App'
      },
      stubs: {
        transition: false,
        'b-button': true,
        'b-modal': true,
        'b-field': true,
        'b-autocomplete': true,
        'square': true,
      }
    })

    // check the msg of the component
    expect(wrapper.vm.msg).toMatch('Welcome to Your Vue.js App')

    // check that the title is rendered
    expect(wrapper.vm.$options.name).toMatch('Home')
  })
})
