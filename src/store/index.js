import Vue from 'vue'
import Vuex from 'vuex'

import makeApiModule from './api-module'
import makeAnalyticsModule from './analytics-module'
import makeFiltersModule from './filter-module'
import makeConfigModule from './config-module'

Vue.use(Vuex)

export function makeStore(initialState = {}) {
  return new Vuex.Store({
    modules: {
      api: makeApiModule(initialState.api),
      analytics: makeAnalyticsModule(initialState.analytics),
      filter: makeFiltersModule(initialState.filter),
      config: makeConfigModule(initialState.config)
    },
    state: () => ({}),
    getters: {},
    mutations: {},
    actions: {}
  })
}
