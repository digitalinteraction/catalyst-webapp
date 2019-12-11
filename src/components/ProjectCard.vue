<template lang="pug">
ColoredCard.project-card(:color="category.color", interactable)
  router-link.inherit-color(:to="projectRoute")
    .category-image
      img(:src="categoryImage", :alt="category.name")
    h3.title.inherit-color.is-4.is-marginless {{ project.name }}
    .tags
      .tag.is-white.knockout-text.has-font-weight-black(
        v-for="theme in projectThemes"
        v-text="theme.name"
      )
</template>

<script>
import ColoredCard from './ColoredCard.vue'

import { ROUTE_PROJECT } from '@/const'
import { getLabels, projectCategory, categoryImage } from '@/utils'

export default {
  components: { ColoredCard },
  props: {
    project: { type: Object, required: true }
  },
  computed: {
    category() {
      return projectCategory(this.project)
    },
    projectRoute() {
      const params = { id: this.project.id }
      return { name: ROUTE_PROJECT, params }
    },
    categoryImage() {
      return categoryImage(this.category)
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
