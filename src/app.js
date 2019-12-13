import Vue from 'vue'
import App from './App.vue'
import { makeRouter } from './router'
import { makeStore } from './store'
import { ACTION_EMIT_ERROR } from './const'
import { sync } from 'vuex-router-sync'

export function makeApp(context = {}) {
  const store = makeStore(context.state)
  const router = makeRouter(store)

  Vue.config.productionTip = false
  Vue.config.errorHandler = error => {
    console.error(error)
    store.dispatch(ACTION_EMIT_ERROR, error)
  }

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
