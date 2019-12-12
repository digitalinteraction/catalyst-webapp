export default function() {
  const state = () => ({
    filters: {},
    search: ''
  })

  const getters = {}

  const mutations = {
    search: (state, search) => Object.assign(state, { search }),
    filters: (state, filters) => Object.assign(state, { filters })
  }

  const actions = {}

  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
}
