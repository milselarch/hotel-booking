import { fa0 } from '@fortawesome/free-solid-svg-icons'
import Vue from 'vue'
import Vuex from 'vuex'

// import { createSharedMutations } from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  mutations: {
    // loads persistent localStorage values into Vuex store state
    // this mutation is triggered in main.js in beforeCreate()
		initialize_store(state) {
			// Check if the ID exists
      const raw_local_store = localStorage.getItem('store')
      let local_store;
      
      try {
        local_store = JSON.parse(raw_local_store)
      } catch (e) {
        console.error('FAILED TO PARSE LOCAL STORE')
        console.error('UNPARSABLE STORE DATA', raw_local_store)
        return false
      }

			// nothing saved to local storage, so we exit
      console.log('LOCALSTRORE', local_store)
      if (!local_store) { return false }

      for (const module_name in local_store) {
        const module = local_store[module_name]
        for (const varname in module) {
          state[module_name][varname] = module[varname]
        }
      }
		}
	},
})

const build_save_state = (state) => {
  const save_state = {}
  
  for (const module_name in modules) {
    const module = modules[module_name];
    // ignore module stores that aren't flagged as persistent
    if (module.persistent !== true) { continue }

    const module_vars = Object.keys(module.state)
    save_state[module_name] = {}

    for (let k=0; k<module_vars.length; k++) {
      const varname = module_vars[k];
      const state_value = state[module_name][varname]
      const default_value = module[varname]

      // don't save var to localstorage if its value is 
      // the default value set in the store
      if (state_value === default_value) { continue }
      save_state[module_name][varname] = state_value
    }
  }

  return save_state;
}

const store_updatable = (mutation) => {
  const mutate_name = mutation.type
  let update_store = false

  for (const module_name in modules) {
    const module = modules[module_name]
    if (module.persistent !== true) { continue }

    const mutations = module.mutations
    const is_module_mutation = mutations.hasOwnProperty(mutate_name)
    if (is_module_mutation) {
      update_store = true
      break
    }
  }

  // console.log('UPDATE STORE', update_store)
  return update_store
}

store.subscribe((mutation, state) => {
  console.log('MODULKES', modules, mutation)
  const update_store = store_updatable(mutation)
  if (!update_store) { return false }

  const save_state = build_save_state(state)
  localStorage.setItem('store', JSON.stringify(save_state))
  console.log('STORE', mutation, save_state)
})

export default store