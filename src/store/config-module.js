import categories from '@/data/categories.json'
import filters from '@/data/filters.json'

export default function(initialState = {}) {
  const state = () => ({
    publicPath: '',
    categories,
    filters,
    ...initialState
  })

  const getters = {
    publicAsset: state => path => {
      return `${process.env.BASE_URL}${state.publicPath}${path}`
    }
  }

  const mutations = {}
  const actions = {}

  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
}
