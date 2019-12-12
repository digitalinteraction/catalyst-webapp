import { makeApiClient } from '@api'

import { ACTION_EMIT_ERROR } from '@/const'

export default function() {
  const apiClient = makeApiClient()

  const state = () => ({
    projects: null,
    labels: null,
    content: null,
    url: process.env.VUE_APP_API_URL
  })

  const getters = {
    apiConf(state) {
      return { prefixUrl: state.url }
    },
    getContent: state => (key, fallback = '') => {
      if (!state.content) return fallback
      return state.content[key] || fallback
    }
  }

  const mutations = {
    setProjects: (state, projects) => Object.assign(state, { projects }),
    setLabels: (state, labels) => Object.assign(state, { labels }),
    setContent: (state, content) => Object.assign(state, { content })
  }

  const actions = {
    async fetchProjects({ commit, getters, dispatch }) {
      try {
        const { data } = await apiClient.get('cards', getters.apiConf).json()

        commit('setProjects', data)
      } catch (error) {
        console.error(error)
        dispatch(ACTION_EMIT_ERROR, error)
      }
    },
    async fetchLabels({ commit, getters, dispatch }) {
      try {
        const { data } = await apiClient.get('labels', getters.apiConf).json()

        commit('setLabels', data)
      } catch (error) {
        console.error(error)
        dispatch(ACTION_EMIT_ERROR, error)
      }
    },
    async fetchContent({ commit, getters, dispatch }) {
      try {
        const { data } = await apiClient.get('content', getters.apiConf).json()

        commit('setContent', data)
      } catch (error) {
        console.error(error)
        dispatch(ACTION_EMIT_ERROR, error)
      }
    }
  }

  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
}
