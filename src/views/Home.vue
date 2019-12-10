<template lang="pug">
.page.home
  PrimaryHero.is-gradient
    div.info
      h1.title.inherit-color.is-size-4-mobile
        span Find potential projects, get involved
        br
        span and make them happen!
      //- div.search
        h2.title.is-5.inherit-color
          label(for="search")
            SearchSvg.hero-title-icon
            | Search for a project:
          input#search(type="search", v-model="searchQuery")
  .page-expand
    section.section
      .container
        h2.title.is-2.is-marginless Find projects
        .columns
          .column.is-one-quarter
            ProjectFilters(:calls="filters.calls", :themes="filters.themes")
          
          .column.is-three-quarters
            h3.title.is-3 Results
  
  PageFooter
</template>

<script>
import PrimaryHero from '@/components/PrimaryHero.vue'
import PageFooter from '@/components/PageFooter.vue'
import ContentBlock from '@/components/ContentBlock.vue'
import ProjectFilters from '@/components/ProjectFilters.vue'

import SearchSvg from '@/assets/search.svg'

export default {
  components: {
    PrimaryHero,
    PageFooter,
    ContentBlock,
    SearchSvg,
    ProjectFilters
  },
  data() {
    return {
      filters: {
        search: '',
        calls: [],
        themes: []
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.home.page
  #search
    max-width: 480px

#search
  +header-input

  &::placeholder
    color: $white
    opacity: 0.3
    font-style: italic
</style>
