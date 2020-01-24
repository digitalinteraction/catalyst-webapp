<template lang="pug">
ColoredCard.project-card(:color="category.color", interactable)
  router-link.inherit-color(:to="projectRoute")
    .category-image
      img(:src="categoryImage", :alt="category.name")
    h3.title.inherit-color.is-4.is-marginless {{ project.name }}
    .tags(v-if="projectThemes")
      .tag.is-white.knockout-text.has-font-weight-black(
        v-for="theme in projectThemes.slice(0, 5)"
      )
        | {{ theme.name | ellipsify }}
      .tag.is-white.knockout-text.has-font-weight-black(
        v-if="projectThemes.length > numTags"
      )
        | + {{ projectThemes.length - numTags }} more
</template>

<script>
import { mapState } from 'vuex'

import { ROUTE_PROJECT, GETTER_PUBLIC_ASSET } from '@/const'

import { getLabels, projectCategory } from '@/utils'
import ColoredCard from './ColoredCard.vue'

export default {
  components: { ColoredCard },
  filters: {
    ellipsify(text) {
      const max = 320
      return text.length <= max ? text : text.slice(0, max) + '…'
    }
  },
  props: {
    project: { type: Object, required: true }
  },
  data() {
    return {
      numTags: 5
    }
  },
  computed: {
    ...mapState('config', ['categories']),
    category() {
      return projectCategory(this.project, this.categories)
    },
    projectRoute() {
      const params = { id: this.project.id }
      return { name: ROUTE_PROJECT, params }
    },
    categoryImage() {
      return this.$store.getters[GETTER_PUBLIC_ASSET](
        `categories/${this.category.image}`
      )
    },
    projectThemes() {
      return getLabels(this.project.labels, 'theme:')
    }
  }
}
</script>

<style lang="sass" scoped>
a
  height: 100%
  display: flex
  flex-direction: column
.title
  flex: 1
  padding-bottom: 0.5em
.category-image
  padding: 1em 2em

+mobile
  .project-card a
    flex-wrap: wrap
    flex-direction: row
    align-items: flex-start
  .title
    width: 100%
    padding-left: 0.3em
    padding-bottom: 0.3em
  .category-image
    width: 64px
    padding: 0
    margin-right: 0.5em
  .tags
    flex: none
    width: 100%
    justify-content: flex-end
</style>
