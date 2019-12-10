<template lang="pug">
.content-block
  .container
    .content.page-content(v-html="content")
</template>

<script>
import marked from 'marked'
import { GETTER_CONTENT } from '@/const'

export default {
  props: {
    contentKey: { type: String, required: true },
    fallback: { type: String, default: '' }
  },
  computed: {
    content() {
      return marked(
        this.$store.getters[GETTER_CONTENT](this.contentKey) || this.fallback
      )
    }
  }
}
</script>

<style lang="sass" scoped>
.content-block:not(:last-child)
  margin-bottom: 1.5rem
</style>
