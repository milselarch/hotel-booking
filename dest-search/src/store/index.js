import Vue from 'vue'
import Vuex from 'vuex'

// import { createSharedMutations } from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

const build_save_state = (state) => {
  const save_state = {}
  
  for (const module_name in modules) {
    const module = modules[module_name];
    if (module.persistent !== true) { continue; }

    const module_vars = Object.keys(module.state)
    save_state[module_name] = {}

    for (let k=0; k<module_vars.length; k++) {
      const varname = module_vars[k];
      const state_value = state[module_name][varname]
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
  console.log('PERSIST', mutation, save_state)
})

export default store