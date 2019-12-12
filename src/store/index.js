import Vue from 'vue'
import Vuex from 'vuex'

import makeApiModule from './api-module'
import makeAnalyticsModule from './analytics-module'
import makeFiltersModule from './filter-module'

Vue.use(Vuex)

export function makeStore() {
  // const apiClient = makeApiClient()

  return new Vuex.Store({
    modules: {
      api: makeApiModule(),
      analytics: makeAnalyticsModule(),
      filter: makeFiltersModule()
    },
    state: {},
    getters: {},
    mutations: {},
    actions: {}
  })
}
