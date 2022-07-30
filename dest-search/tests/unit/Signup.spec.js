import {createLocalVue, mount} from '@vue/test-utils'
import flushPromises from 'flush-promises'

import SignUp from '../../src/components/SignUp.vue'
import Login from '../../src/components/Login.vue'
import Profile from '../../src/components/Profile.vue'
import VuexAttach from '../../src/store/VuexAttach.js'
import AuthRequester from '../../src/AuthRequester.js'
import router from '../../src/router'
import App from '../../src/App.vue'
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
import exp from 'constants'
import { fail } from 'assert'

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

    // set the form data variables
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

  it('duplicate signup failure mismatch test', async () => {
    /*
    check that signing up with the same credentials
    (and especially same username) after the previous signup
    test fails (as we cannot sign up with the same email twice)
    */
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

    // set the form data variables
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

    expect(wrapper.vm.has_error).toBe(true)
    const err_msg = "user_account with this email already exists."
    // check that email error message exists and is correct
    expect(wrapper.vm.email_error).toStrictEqual([err_msg])
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

  it('login email failure test', async () => {
    /*
    test that login fails if we enter the wrong
    email but correct password
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

    let false_email = user.email
    while (false_email === user.email) {
      // keep generating random differing passwords
      // the while loop makes sure the regenerated password
      // does not end up marching the original password
      // I know this is unbelievably improbable, but whatever
      await sleep(100);
      false_email = user.generate_email(new Date())
    }

    wrapper.vm.email = false_email
    wrapper.vm.password = user.password
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

  it ('profile load test', async () => {
    // check that profile page can load profile info
    // when user is authenticated
    const wrapper = mount(Profile, {
      store, localVue,
      //specify custom components
      stubs: stubs
    })

    expect(store.getters.authenticated).toBe(true)
    while (wrapper.vm.is_loading) { await sleep(100); }
    const email_component = wrapper.find('#email-info')
    const name_component = wrapper.find('#name-info')
    const profile_email = email_component.text()
    const profile_name = name_component.text()

    const full_name = `${user.first_name} ${user.last_name}`
    expect(profile_email).toBe(user.email)
    expect(profile_name).toBe(full_name)
    console.log('EMAIL_COMPONENT', email_component.text())
  })
  
  it('logout success test', async () => {
    // click the logout button on the navbar to logout
    expect(store.getters.authenticated).toBe(true)
    const mock_jquery_navbar = new Object({
      ready(func) { func() },
      height() { return 500 }
    })

    const wrapper = mount(App, {
      store, localVue, router,
      //specify custom components
      stubs: stubs,
      methods: {
        get_navbar() {
          return mock_jquery_navbar
        }
      }
    })

    // check that the user is logged in and the
    // auth token works before the test starts
    wrapper.$store = store
    const requester = new AuthRequester(wrapper)
    const auth_token = requester.auth_token
    const refresh_token = requester.refresh_token
    let status_code = -1
    console.log('PRE-REQUEST')
    
    try {
      const response = await requester.get('profile')
      // console.log('PROFILE RESP', response)
      status_code = response.status
    } catch (error) {
      console.log('ERR-RESPONSE', error.response)
      status_code = error.response.status_code
    }

    // make sure the authenticated request succeeds
    expect(status_code).toBe(200)

    const logout_button = wrapper.find('#logout-button')
    console.log('LOGOUT-BTTN', logout_button)
    expect(logout_button.exists()).toBe(true);
    expect(wrapper.vm.logout_requests).toStrictEqual([])
    jest.spyOn(wrapper.vm, 'logout')
    // click the logout button on the navbar
    await logout_button.trigger('click')
    await wrapper.vm.$nextTick();

    // await flushPromises()
    // wait for vuejs component to update
    
    /*
    // this test checks if the previous tokens work
    // which im relegating to a seperate feature requirement
    // i.e. blacklisting tokens on the backend 
    // and sending the request to do so is out of scope
    expect(wrapper.vm.logout).toHaveBeenCalled()
    expect(wrapper.vm.logout_requests.length).toBe(1)
    const logout_request = wrapper.vm.logout_requests[0]
    const logout_response = await logout_request
    const logout_status = logout_response.status
    expect(logout_status).toBe(200)
    */

    // check that the user is logged out and the
    // authenticated request to /profile fails
    wrapper.$store = store
    const requester2 = new AuthRequester(wrapper)
    // requester2.set_auth_token('0')
    // requester2.set_refresh_token(refresh_token)
    // console.log('POST-LOGOUT-REQUEST')
    
    try {
      const response = await requester2.get('profile')
      // console.log('PROFILE RESP', response)
      status_code = response.status
    } catch (error) {
      // console.log('ERR-RESPONSE', error.response)
      status_code = error.response.status
    }

    // check that the user is no longer authenticated
    expect(store.getters.authenticated).toBe(false)
    // make sure the authenticated request succeeds
    expect(status_code).toBe(401)
  })
})