import axios from 'axios'
import assert from 'assert'

class AuthRequester {
  /*
  sends requests with JWT header info filled in,
  and in the event that the JWT request fails
  */
  constructor(component) {
    const store = component.$store;
    const self = this;
    
    self.store = store
    self.auth_failed = false
    self.load_credentials()
  }

  load_credentials() {
    const self = this;
    const state = self.store.state
    self.auth_token = state.Persistent.auth_token
    self.refresh_token = state.Persistent.refresh_token
  }

  // build_headers = () => this._build_headers()
  build_headers() {
    if (this.auth_token === null) {
      // server will give 400 (BAD REQUEST) with a null token
      return {}
    }

    return {
      headers: { Authorization: 'JWT ' + this.auth_token }
    }
  }

  // refresh = () => this._refresh()
  async refresh() {
    const self = this
    assert(!self.auth_failed)
    if (self.refresh_token === null) {
      // server will give 400 (BAD REQUEST) with a null token
      self.store.commit('clear_credentials')
      console.log('REFRESH NULL')
      return false;
    }

    console.log('ATTEMPT REFRESH')

    const json_info = {
      refresh: this.refresh_token
    }
    const request = axios.post('token/refresh/', json_info, {
      'Content-Type': 'application/json'
    })

    let response;

    try {
      response = await request
    } catch (error) {
      console.warn('REFRESH FAILED', error)
      // return false if refresh token expired
      const status_code = error.response.status
      
      if (status_code === 401) { 
        self.store.commit('clear_credentials')
        console.log('REFRESH EXPIRED')
        return false;
      }
      // throw the error again if there are other errors
      // e.g. cannot connect to server
      throw error
    }

    console.log('REFRESH SUCCESS')
    const auth_token = response.data.access
    // TODO: commit auth token to vuex store
    self.store.commit('save_auth_token', auth_token)
    self.auth_token = auth_token
    return true
  }

  // trigger_fail_handlers = (e) => this._trigger_fail_handlers(e)
  async trigger_fail_handlers(error) {
    const self = this;
    for (let k=0; k<self.auth_fail_handlers.length; k++) {
      const auth_fail_handler = self.auth_fail_handlers[k]
      await auth_fail_handler(error)
    }
  }

  // get = (endpoint) => this._get(endpoint)
  async get(endpoint, options={}) {
    const self = this;
    assert(!self.auth_failed)

    const headers = self.build_headers()
    options = Object.assign(options, headers)
    
    try {
      return await axios.get(endpoint, options)
    } catch (access_error) {
      const status_code = access_error.response.status
      console.warn('FAIL STATUS CODE', status_code)
      console.warn('FAIL ERR', access_error)

      if (status_code === 401) {
        let refresh_success = false
        
        /*
        the refresh itself could throw a non-401
        and if that happens we'll just pretend the
        refresh request never happened to begin with
        and rethrow the error from the initial endpoint request

        I'm choosing to do this over letting the refresh
        error bubble up to whatever code is calling the thing
        because I think its easier to only have to anticipate
        and deal with errors directly from the request to the 
        endpoint you intended to send to directly only, espectially
        for stuff like error response request introspection.

        Not to mention, non-401 errors are rare enough
        and likely covariant with circumstances that would
        also mess with the original endpoint request anyway
        */

        try {
          refresh_success = await self.refresh()
        } catch (refresh_error) {
          console.error('REFRESH FAILED', refresh_error)
        }

        if (!refresh_success) { throw access_error }
        
        assert(refresh_success)
        const headers = self.build_headers()
        options = Object.assign(options, headers)
        // call endpoint again with the new access token
        return await axios.get(endpoint, options)
      } else {
        // rethrow error if its not a 401
        // (401 means access token expired)
        throw access_error
      }
    }
  }
}

export default AuthRequester