import {createLocalVue, mount} from '@vue/test-utils'
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

localVue.config.silent = true;
localVue.use(infiniteScroll)
localVue.use(Vuex)
localVue.use(Buefy)

describe('DeleteAccount Test', () => {
  const user = new User()
  let signed_up = false;
  let store;
  let account_deleted = false;

  beforeEach(() => {
    // trick axios into thinking its running on the browser
    // otherwise all requests will report with NetworkError
    axios.defaults.adapter = require('axios/lib/adapters/http');
    axios.defaults.baseURL = "http://127.0.0.1:8000/"

    const attacher = new VuexAttach(localVue);
    store = attacher.create_store(mock.modules);
    store.commit('initialize_store');
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
    1. test that login is successful if we enter the correct
    email and correct password
    2. check that JWT access and refresh tokens are saved in
    localStorage after a  successful login
    3. test that the JWT acquired post-login tokens actually work
    by sending an authenticated request to the backend
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

    // load presistent vuex store module
    // this is the one that contains the auth + refresh tokens
    const persistent = saved_storage[persistent_key]
    console.log('STORE PERSISTEN', persistent)
    console.log(
      'SAVE STORE', saved_storage, 
      localStorage.getItem('store'),
      typeof localStorage.getItem('store')
    )
    
    // ensure that localstorage contains newly created
    // auth token and refresh token
    const auth_key = 'auth_token'
    const refresh_key = 'refresh_token'
    expect(persistent.hasOwnProperty(auth_key)).toBe(true)
    expect(persistent.hasOwnProperty(refresh_key)).toBe(true)
    const auth_token = persistent[auth_key]
    const refresh_token = persistent[refresh_key]
    
    // check that the saved tokens are strings with length > 10
    expect(typeof auth_token === 'string').toBe(true)
    expect(typeof refresh_token === 'string').toBe(true)
    console.log('TEST AUTH TOKEN', auth_token)
    console.log('TEST REFRESH TOKEN', refresh_token)
    expect(auth_token.trim().length > 10).toBe(true)
    expect(refresh_token.trim().length > 10).toBe(true)
    expect(store.getters.authenticated).toBe(true)

    // attempt an authenticated request to the backend
    // to prove that the JWT tokens we've acquired work
    wrapper.$store = store
    // TODO: should refactor authrequester to take in the
    // store directly rather than a vue component
    const requester = new AuthRequester(wrapper)
    let status_code, response
    console.log('PRE-REQUEST')
    
    try {
      response = await requester.get('profile')
      // console.log('PROFILE RESP', response)
      status_code = response.status
    } catch (error) {
      // console.log('ERR-RESPONSE', error.response)
      status_code = error.response.status_code
    }

    // make sure the authenticated request succeeds
    expect(status_code).toBe(200)
  })
  
  it('DeleteAccount success test', async () => {
    // click the confirm delete account button in profile page to delete account
    expect(store.getters.authenticated).toBe(true)

    const wrapper = mount(DeleteAccount, {
      store, localVue, router,
      //specify custom components
      stubs: stubs,
    })

    wrapper.vm.password = user.password

    // check that the user is logged in and the
    // auth token works before the test starts
    wrapper.$store = store
    const requester = new AuthRequester(wrapper)
    const auth_token = requester.auth_token
    const refresh_token = requester.refresh_token
    let status_code = -1
    console.log('PRE-REQUEST')
    
    const formdata = {
      current_password: user.password,
    }

    const data = {
      "data": formdata
    }

    // try {
    //   const response = await requester.delete('auth/users/me/', {}, data)
    //   // console.log('PROFILE RESP', response)
    //   status_code = response.status
    // } catch (error) {
    //   console.log('ERR-RESPONSE', error.response)
    //   status_code = error.response.status_code
    // }

    // // make sure the authenticated request succeeds
    // expect(status_code).toBe(204)

    const delete_account_button = wrapper.find('#confirm_delete_account_button')
    expect(delete_account_button.exists()).toBe(true);
    // click the delete_account button
    // await delete_account_button.trigger('click')
    // expect(spy).toHaveBeenCalled()

    const return_value = await wrapper.vm.delete_account()
    expect(return_value).toBe(true)

    await wrapper.vm.$nextTick();

  })
})