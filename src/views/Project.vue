<template lang="pug">
.page.project
  template
    PrimaryHero(:class="colorClass")
    
    section.crumbs
      .container
        nav.breadcrumb.has-text-weight-bold
          ul
            li: router-link(to="/") Home
            li.is-active: a(href="#") View project
    
    section.section.page-expand
      .container
        .project-detail
          .columns.is-gapless
            .column.is-two-thirds
              .project-detail-card(:class="colorClass")
                .columns
                  .column
                    h1.title.inherit-color {{ project.name }}
                  .column.is-narrow
                    img.category-image(:src="categoryImage")
                .content(
                  ref="projectContent",
                  v-html="projectContent",
                  @click="contentClick"
                )
                .tags
                  .tag.is-white.knockout-text.has-font-weight-black(
                    v-for="theme in project.themes"
                  ) {{theme.name}}
            .column
              .content.what-is-this(v-html="aboutContent")
    PageFooter
</template>

<script>
import marked from 'marked'

import PrimaryHero from '@/components/PrimaryHero.vue'
import PageFooter from '@/components/PageFooter.vue'

import { GETTER_CONTENT } from '@/const'
import { projectCategory, categoryImage } from '@/utils'
import { mapState } from 'vuex'

export default {
  components: { PrimaryHero, PageFooter },
  computed: {
    ...mapState('api', ['projects']),
    ...mapState('config', ['categories']),
    projectId() {
      return this.$route.params.id
    },
    project() {
      return this.projects && this.projects.find(p => p.id === this.projectId)
    },
    projectCrumb() {
      return this.project ? this.project.name : 'View Project'
    },
    category() {
      return projectCategory(this.project, this.categories)
    },
    categoryImage() {
      const { publicPath } = this.$store.state.config
      return categoryImage(this.category, publicPath)
    },
    colorClass() {
      return [this.category && `is-${this.category.color}`]
    },
    projectContent() {
      return marked(this.project.desc)
    },
    aboutContent() {
      return marked(this.$store.getters[GETTER_CONTENT]('about.short', ''))
    }
  },
  methods: {
    contentClick(e) {
      // if they clicked on an anchor, emit a project action
      if (e.target instanceof HTMLAnchorElement) {
        this.$store.dispatch('emitMessage', {
          type: 'project_action',
          project: this.projectId,
          link: e.target.getAttribute('href')
        })
      }
    }
  }
}
</script>

<style lang="sass">
+mobile
  .page.project section
    padding-left: 0
    padding-right: 0
  .content.what-is-this
    padding: 2em 1.5em

+tablet
  .content.what-is-this
    margin-left: 1.5em

.content.what-is-this
  h1, h2, h3, h4, h5, h6
    &:first-child
      margin-bottom: 0

.project-detail-card
  padding: 1em 1.5em
  +add-theme-colors

  .category-image
    width: 96px

  .content
    border-radius: 2px
    padding: 1rem
    background-color: rgba(0,0,0,0.1)
    font-family: Helvetica, Arial, sans-serif

    h1, h2, h3, h4, h5, h6
      color: inherit

    +mobile
      padding: 0.75rem

    a
      color: inherit
      font-weight: bold
      text-decoration: underline

    blockquote
      border-left-color: rgba(255, 255, 255, 0.4)
      background: rgba(0, 0, 0, 0.05)
</style>
