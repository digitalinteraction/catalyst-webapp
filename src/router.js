import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import About from './views/About.vue'
import Project from './views/Project.vue'
import NotFound from './views/NotFound.vue'

import {
  ROUTE_HOME,
  ROUTE_ABOUT,
  ROUTE_PROJECT,
  ACTION_EMIT_MESSAGE
} from '@/const'

Vue.use(Router)

function makeMeta(pageName) {
  return { meta: { pageName } }
}

function scrollBehavior(to, from, savedPosition) {
  if (to.name === ROUTE_PROJECT || to.name === ROUTE_ABOUT) {
    return { x: 0, y: 0 }
  } else {
    return savedPosition
  }
}

export function makeRouter(store) {
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior,
    routes: [
      {
        path: '/',
        name: ROUTE_HOME,
        component: Home,
        ...makeMeta('Home')
      },
      {
        path: '/about',
        name: ROUTE_ABOUT,
        component: About,
        ...makeMeta('Home')
      },
      {
        path: '/project/:id',
        name: ROUTE_PROJECT,
        component: Project,
        ...makeMeta('Project')
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  })

  // Emit a page_view when each page is visited
  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      store.dispatch(ACTION_EMIT_MESSAGE, { type: 'page_view', path: to.path })
    }
    next()
  })

  // Update the title when each page is visited
  router.beforeEach((to, from, next) => {
    let title = 'Not-Equal Catalyst'

    if (to.meta && to.meta.pageName) {
      title = `${to.meta.pageName} | ${title}`
    }

    if (typeof window !== 'undefined') window.document.title = title

    next()
  })

  return router
}
