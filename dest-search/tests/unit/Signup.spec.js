import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import SignUp from '../../src/components/SignUp.vue'
import Login from '../../src/components/Login.vue'
import VuexAttach from '../../src/store/VuexAttach.js'
import Buefy from 'buefy'

// import store from '../../src/store' 
// you could also mock this out.
import User from './User.js'
import axios from 'axios'
import Vuex from 'vuex'
import sleep from 'await-sleep'
import stubs from './stubs.js'
import { assert, time } from 'console'
import { wrap } from 'lodash'
import { start } from 'repl'
import Persistent from '../../src/store/modules/Persistent'
import { type } from 'jquery'

const segfault_handler = require('segfault-handler');
const fs = require('fs');
const mock = require('./mock.js');

segfault_handler.registerHandler('crash.log');
// console.error("DIRNAME", __dirname);
console.log("DIR PARSE DONE", __dirname);

const test_folder = 'src/store/modules';
fs.readdirSync(test_folder).forEach(file => {
  console.log(file);
});

const crypto = require("crypto");
const infiniteScroll =  require('vue-infinite-scroll');
const localVue = createLocalVue();
localVue.use(infiniteScroll)
localVue.use(Vuex)
localVue.use(Buefy)

describe('Signup Test', () => {
  const user = new User()
  let signed_up = false;
  let store;

  beforeEach(() => {
    // trick axios into thinking its running on the browser
    // otherwise all requests will report with NetworkError
    axios.defaults.adapter = require('axios/lib/adapters/http');
    axios.defaults.baseURL = "http://127.0.0.1:8000/"

    const attacher = new VuexAttach(localVue);
    store = attacher.create_store(mock.modules);
    store.commit('initialize_store');
  })

  it('signup password mismatch test', async () => {
    const wrapper = mount(SignUp, {
      store, localVue,
      //specify custom components
      stubs: stubs
    })

    const signup_button = wrapper.find('#signup');
    expect(signup_button.exists()).toBe(true);
    expect(signup_button.attributes().disabled).toBe('true');

    let false_password = user.password
    while (false_password === user.password) {
      // keep generating random differing passwords
      // the while loop makes sure the regenerated password
      // does not end up marching the original password
      // I know this is unbelievably improbable, but whatever
      false_password = crypto.randomBytes(6).toString('hex');
    }

    assert(false_password !== user.password)
    wrapper.vm.email = user.email
    wrapper.vm.first_name = user.first_name
    wrapper.vm.last_name = user.last_name
    wrapper.vm.password = user.password
    wrapper.vm.re_password = false_password
    
    // wait for vuejs component to update
    await wrapper.vm.$nextTick()
  
    expect(wrapper.vm.allow_signup).toBe(true);
    console.log("SIGNUP-ATTR", signup_button)
    // make sure the sign up button is not disabled now
    expect(signup_button.attributes().disabled).toBe(undefined);
    expect(wrapper.vm.pending).toBe(false)

    await signup_button.vm.$listeners.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pending).toBe(true)
    // wait for the sign up axios request to complete
    while (wrapper.vm.pending) { await sleep(100); }
    await wrapper.vm.$nextTick()

    const error_message = "The two password fields didn't match."
    // console.log("ERR-MSG", [wrapper.vm.other_errors])
    expect(wrapper.vm.other_errors).toBe(error_message)
  })

  it('signup success test', async () => {
    const wrapper = mount(SignUp, {
      store, localVue,
      //specify custom components
      stubs: stubs
    })

    const signup_button = wrapper.find('#signup');
    expect(signup_button.exists()).toBe(true);
    expect(signup_button.attributes().disabled).toBe('true');
    expect(store.getters.authenticated).toBe(false)

    wrapper.vm.email = user.email
    wrapper.vm.first_name = user.first_name
    wrapper.vm.last_name = user.last_name
    wrapper.vm.password = user.password
    wrapper.vm.re_password = user.password
    
    // wait for vuejs component to update
    await wrapper.vm.$nextTick()
  
    expect(wrapper.vm.allow_signup).toBe(true);
    console.log("SIGNUP-ATTR", signup_button)
    // make sure the sign up button is not disabled now
    expect(signup_button.attributes().disabled).toBe(undefined);
    expect(wrapper.vm.pending).toBe(false)

    await signup_button.vm.$listeners.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pending).toBe(true)
    // wait for the sign up axios request to complete
    while (wrapper.vm.pending) { await sleep(100); }
    await wrapper.vm.$nextTick()

    const formdata = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
      re_password: user.password,
    }

    const event_data = wrapper.emitted('open-login')
    // console.log('EVENT', event_data)
    expect(event_data).toStrictEqual([[formdata]])
    console.log('SIGNUP COMPLETE', formdata)
    signed_up = true;

    expect(store.getters.authenticated).toBe(false)
  })

  it('login success test', async () => {
    /*
    test that login is successfull if we enter the correct
    email and correct password
    */

    expect(store.getters.authenticated).toBe(false)
    const start_stamp = (new Date()).getTime() / 1000
    while (!signed_up) {
      // wait for the signup test to complete
      // and ensure there exists a user account in the backend
      // from which we can login into
      await sleep(100);
    }

    const end_stamp = (new Date()).getTime() / 1000
    const duration = end_stamp - start_stamp
    console.log('WAIT DURATION', duration)

    const wrapper = mount(Login, {
      store, localVue,
      //specify custom components
      stubs: stubs
    })

    const login_button = wrapper.find('#login');
    expect(login_button.exists()).toBe(true);
    // const email_field = wrapper.find('#email-field')
    // const password_field = wrapper.find('#password-field')
    wrapper.vm.email = user.email
    wrapper.vm.password = user.password
    await wrapper.vm.$nextTick()
    const formdata = {
      email: user.email,
      password: user.password
    }

    expect(wrapper.vm.pending).toBe(false)
    await login_button.vm.$listeners.click()
    expect(wrapper.vm.pending).toBe(true)
    // wait for the sign up axios request to complete
    while (wrapper.vm.pending) { await sleep(100); }

    // ensure login-done event is emitted
    const event_data = wrapper.emitted('login-done')
    expect(event_data).toStrictEqual([[formdata]])

    // ensure that login JWT token is saved to localstorage
    const persistent_key = 'Persistent'
    const saved_storage = JSON.parse(localStorage.getItem('store'))
    expect(saved_storage.hasOwnProperty(persistent_key)).toBe(true)

    // ensure that localstorage contains newly created
    // auth token and refresh token
    const persistent = saved_storage[persistent_key]
    console.log('STORE PERSISTEN', persistent)
    console.log(
      'SAVE STORE', saved_storage, 
      localStorage.getItem('store'),
      typeof localStorage.getItem('store')
    )
    
    expect(persistent.hasOwnProperty('auth_token')).toBe(true)
    expect(persistent.hasOwnProperty('refresh_token')).toBe(true)
    const auth_token = persistent['auth_token']
    const refresh_token = persistent['refresh_token']
    
    expect(typeof auth_token === 'string').toBe(true)
    expect(typeof refresh_token === 'string').toBe(true)
    console.log('TEST AUTH TOKEN', auth_token)
    console.log('TEST REFRESH TOKEN', refresh_token)
    
    expect(auth_token.trim().length > 10).toBe(true)
    expect(refresh_token.trim().length > 10).toBe(true)
    expect(store.getters.authenticated).toBe(true)
  })

  it('login password failure test', async () => {
    /*
    test that login fails if we enter the correct
    email but wrong password
    */
    const start_stamp = (new Date()).getTime() / 1000
    while (!signed_up) {
      // wait for the signup test to complete
      // and ensure there exists a user account in the backend
      // from which we can login into
      await sleep(100);
    }

    const end_stamp = (new Date()).getTime() / 1000
    const duration = end_stamp - start_stamp
    console.log('WAIT DURATION', duration)

    const wrapper = mount(Login, {
      store, localVue,
      //specify custom components
      stubs: stubs
    })

    const login_button = wrapper.find('#login');
    const errors_box = wrapper.find('#errors_box')
    expect(login_button.exists()).toBe(true);
    expect(wrapper.vm.has_error).toBe(false);
    // const email_field = wrapper.find('#email-field')
    // const password_field = wrapper.find('#password-field')

    let false_password = user.password
    while (false_password === user.password) {
      // keep generating random differing passwords
      // the while loop makes sure the regenerated password
      // does not end up marching the original password
      // I know this is unbelievably improbable, but whatever
      false_password = crypto.randomBytes(6).toString('hex');
    }

    wrapper.vm.email = user.email
    wrapper.vm.password = false_password
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.pending).toBe(false)
    await login_button.vm.$listeners.click()
    expect(wrapper.vm.pending).toBe(true)
    // wait for the sign up axios request to complete
    while (wrapper.vm.pending) { await sleep(100); }

    expect(wrapper.vm.has_error).toBe(true);
    const errors = wrapper.vm.other_errors;
    const err_msg = 'No active account found with the given credentials'
    expect(errors).toBe(err_msg)
    // console.log('LOGIN ERRORS', errors)
  })
})