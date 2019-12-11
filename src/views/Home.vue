<template lang="pug">
.page.home
  PrimaryHero.is-gradient
    div.info
      h1.title.inherit-color.is-size-4-mobile
        span Find potential projects, get involved
        br
        span and make them happen!
      div.search
        h2.title.is-5.inherit-color
          label(for="searchField")
            SearchSvg.hero-title-icon
            | Search for a project:
          input#searchField(type="search", v-model="search")
  .page-expand
    section.section
      .container
        h2.title.is-2 Find projects
        .columns
          .column.is-one-quarter
            ProjectFilters(v-model="filters")
          
          .column.is-three-quarters
            h3.title.is-3 Results
            p.result-info
              span(v-if="isFiltering") Showing results for your filters
              span(v-else) Showing all projects
            ProjectGrid(:projects="filteredProjects")
  
  PageFooter
</template>

<script>
import { mapState } from 'vuex'
import PrimaryHero from '@/components/PrimaryHero.vue'
import PageFooter from '@/components/PageFooter.vue'
import ContentBlock from '@/components/ContentBlock.vue'
import ProjectFilters from '@/components/ProjectFilters.vue'
import ProjectGrid from '@/components/ProjectGrid.vue'

import SearchSvg from '@/assets/search.svg'
import { makePredicate } from '@/utils'

export default {
  components: {
    PrimaryHero,
    PageFooter,
    ContentBlock,
    SearchSvg,
    ProjectFilters,
    ProjectGrid
  },
  data() {
    return {
      search: '',
      filters: {}
    }
  },
  computed: {
    ...mapState('api', ['projects']),
    filteredProjects() {
      if (!this.projects) return []
      const predicate = makePredicate(this.search, this.filters)
      return this.projects.filter(predicate)
    },
    isFiltering() {
      return (
        this.search.length > 0 ||
        Object.values(this.filters).some(filter => filter.length > 0)
      )
    }
  }
}
</script>

<style lang="sass" scoped>
.home.page
  #search
    max-width: 480px

.search
  margin-top: 3em

#searchField
  +header-input
  margin-left: 0.5em

  &::placeholder
    color: $white
    opacity: 0.3
    font-style: italic

.result-info
  color: $grey
  font-weight: bold
  font-size: 1.5em
  padding: 0.3em 0.5em
  margin-bottom: 1em
  border-left: 5px solid $border
  background: $white-ter
</style>
