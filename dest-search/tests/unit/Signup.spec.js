import {createLocalVue, shallowMount, mount} from '@vue/test-utils'
import SignUp from '../../src/components/SignUp.vue'
import Login from '../../src/components/Login.vue'
import VuexAttach from '../../src/store/VuexAttach.js'
import Buefy from 'buefy'

// import store from '../../src/store' 
// you could also mock this out.
import moment from 'moment'
import axios from 'axios'
import Vuex from 'vuex'
import sleep from 'await-sleep'
import stubs from './stubs.js'
import { assert, time } from 'console'
import { wrap } from 'lodash'
import { start } from 'repl'

const crypto = require("crypto");
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

const infiniteScroll =  require('vue-infinite-scroll');
const localVue = createLocalVue();
localVue.use(infiniteScroll)
localVue.use(Vuex)
localVue.use(Buefy)

describe('Signup Test', () => {
  let timestamp, date_stamp;
  let username, password;
  let email, first_name, last_name;

  let signed_up = false;
  let store;

  beforeEach(() => {
    const date_now = new Date()
    timestamp = date_now.getTime();
    date_stamp = moment(date_now).format('YYMMDD-hhmmss-SSS');
    
    // generate form data for signup and login tests
    username = `test-user-${date_stamp}`
    email = `test-email-${date_stamp}@testmail.com`
    password = crypto.randomBytes(6).toString('hex');
    first_name = crypto.randomBytes(2).toString('hex');
    last_name = crypto.randomBytes(2).toString('hex');

    console.log('DATE_STAMP', date_stamp)
    console.log('PASSWROD', password, first_name, last_name)

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

    let false_password = password
    while (false_password === password) {
      // keep generating random differing passwords
      // the while loop makes sure the regenerated password
      // does not end up marching the original password
      // I know this is unbelievably improbable, but whatever
      false_password = crypto.randomBytes(6).toString('hex');
    }

    assert(false_password !== password)
    wrapper.vm.email = email
    wrapper.vm.first_name = first_name
    wrapper.vm.last_name = last_name
    wrapper.vm.password = password
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

    wrapper.vm.email = email
    wrapper.vm.first_name = first_name
    wrapper.vm.last_name = last_name
    wrapper.vm.password = password
    wrapper.vm.re_password = password
    
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
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: password,
      re_password: password,
    }

    const event_data = wrapper.emitted('open-login')
    // console.log('EVENT', event_data)
    expect(event_data).toStrictEqual([[formdata]])
    console.log('SIGNUP COMPLETE')
    signed_up = true;
  })

  it('login success test', async () => {
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
    wrapper.vm.email = email
    wrapper.vm.password = password
    await wrapper.vm.$nextTick()
    const formdata = {
      email: email,
      password: password
    }

    expect(wrapper.vm.pending).toBe(false)
    await login_button.vm.$listeners.click()
    expect(wrapper.vm.pending).toBe(true)
    // wait for the sign up axios request to complete
    while (wrapper.vm.pending) { await sleep(100); }

    // ensure login-done event is emitted
    const event_data = wrapper.emitted('login-done')
    expect(event_data).toStrictEqual([[formdata]])
  })
})