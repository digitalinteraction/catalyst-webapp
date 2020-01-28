import { makeApp } from './app'

// client-specific bootstrapping logic...

const { app } = makeApp({
  state: window.__INITIAL_STATE__
})

// this assumes App.vue template root element has `id="app"`
app.$mount('#app')
