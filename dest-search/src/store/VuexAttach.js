import Vuex from 'vuex';

const state_builder = (modules) => {
  const build_save_state = (state) => {
    // build a json object that contains
    // all the values for all the modules in vuex
    // that were flagged as persistent
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

  return build_save_state
}

const store_updator = (modules) => {
  const store_updatable = (mutation) => {
    // check if the mutation is changing the value of
    // a vuex state variable for a variable under 
    // a vuex module that is persistent
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

  return store_updatable
}

class VuexAttach {
  constructor(vue_instance) {
    if (VuexAttach._instance) {
      // https://stackoverflow.com/questions/59626230/
      // return created instance if it already exists
      // basically we made this class a singleton
      return VuexAttach._instance;
    }

    VuexAttach._instance = this;
    this.vue_instance = vue_instance;
    this.vue_instance.use(Vuex);
  }

  static instance() {
    if (!VuexAttach._instance) {
      return new VuexAttach();
    }

    return VuexAttach._instance;
  }

  create_store(modules) {
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
              console.log('MODUKE', module_name, state[module_name], state)
              state[module_name][varname] = module[varname]
            }
          }
        }
      },
    })

    const store_updatable = store_updator(modules);
    const build_save_state = state_builder(modules);

    store.subscribe((mutation, state) => {
      // console.log('MODULKES', modules, mutation)
      const update_store = store_updatable(mutation)
      if (!update_store) { return false }
    
      const save_state = build_save_state(state)
      localStorage.setItem('store', JSON.stringify(save_state))
      console.log('STORE', mutation, save_state)
    })
    
    return store;
  }
}

VuexAttach._instance = null;
export default VuexAttach;