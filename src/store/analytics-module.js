export default function() {
  const state = {
    socket: null,
    bufferedMessages: []
  }

  const getters = {}

  const mutations = {
    setSocket: (state, socket) => {
      Object.assign(state, { socket })
    },
    bufferMessage: (state, message) => {
      state.bufferedMessages.push(message)
    },
    resetBuffer: (state, bufferedMessages = []) => {
      Object.assign(state, { bufferedMessages })
    }
  }

  const actions = {
    registerSocket({ commit, dispatch }, socket) {
      Object.seal(socket)
      commit('setSocket', socket)
      socket.addEventListener('open', () => dispatch('onOpenSocket', socket))
    },
    onOpenSocket({ state, commit }, socket) {
      state.bufferedMessages.forEach(msg => socket.send(msg))
      commit('resetBuffer')
    },
    emitMessage({ state, commit }, payload) {
      const message = JSON.stringify(payload)

      if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
        commit('bufferMessage', message)
      } else {
        state.socket.send(message)
      }
    },
    emitError({ dispatch }, error) {
      dispatch('emitMessage', {
        type: 'client_error',
        message: error.message,
        stack: error.stack
      })
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
