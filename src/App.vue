<template lang="pug">
#app(v-if="isReady")
  router-view
</template>

<script>
import {
  ACTION_FETCH_PROJECTS,
  ACTION_FETCH_LABELS,
  ACTION_FETCH_CONTENT,
  ACTION_EMIT_MESSAGE,
  ACTION_REGISTER_SOCKET
} from '@/const'

export default {
  computed: {
    isReady() {
      const { projects, labels, content } = this.$store.state.api
      return projects && labels && content
    }
  },
  mounted() {
    // Wait for next tick to allow for hydration
    this.$nextTick(() => {
      const { projects, labels, content } = this.$store.state.api

      // Fetch content if not hydrated
      if (!projects) this.$store.dispatch(ACTION_FETCH_PROJECTS)
      if (!labels) this.$store.dispatch(ACTION_FETCH_LABELS)
      if (!content) this.$store.dispatch(ACTION_FETCH_CONTENT)

      // Create a websocket if they are available
      if (typeof WebSocket !== 'undefined') {
        this.$store.dispatch(
          ACTION_REGISTER_SOCKET,
          new WebSocket(this.socketUrl(this.$store.state.api.url))
        )

        // Emit the first page view (as this occurs after router.beforeEach)
        const path = location.pathname
        this.$store.dispatch(ACTION_EMIT_MESSAGE, { type: 'page_view', path })
      }
    })
  },
  methods: {
    socketUrl(httpUrl) {
      return httpUrl.replace(/^http/, 'ws')
    }
  }
}
</script>

<style lang="sass">
@import ~@/sass/styles.sass

#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
</style>
