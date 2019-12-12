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
          input#searchField(type="search", :value="search" @input="onSearch")
  .page-expand
    section.section
      .container
        h2.title.is-2 Find projects
        .columns
          .column.is-one-quarter
            ProjectFilters(:value="filters" @input="onFilter")
          
          .column.is-three-quarters
            h3.title.is-3 Results
            p.result-info
              span(v-if="noResults") No projects matched your query
              span(v-else-if="isFiltering") Showing results for your filters
              span(v-else) Showing all projects
            ProjectGrid(:projects="filteredProjects")
  
  PageFooter
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'

import PrimaryHero from '@/components/PrimaryHero.vue'
import PageFooter from '@/components/PageFooter.vue'
import ContentBlock from '@/components/ContentBlock.vue'
import ProjectFilters from '@/components/ProjectFilters.vue'
import ProjectGrid from '@/components/ProjectGrid.vue'

import SearchSvg from '@/assets/search.svg'
import { makePredicate, serializeQuery, deserializeQuery } from '@/utils'
import { ROUTE_HOME, MUTATION_SEARCH, MUTATION_FILTERS } from '@/const'

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
      onSearch: debounce(event => {
        this.$store.commit(MUTATION_SEARCH, event.target.value)
        this.setQuery(event.target.value, this.filters)
      }, 300),
      setQuery: debounce((search, filters) => {
        this.updateUrlParams(serializeQuery(search, filters))
      }, 10)
    }
  },
  computed: {
    ...mapState('api', ['projects']),
    ...mapState('filter', ['search', 'filters']),
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
    },
    noResults() {
      return this.filteredProjects.length === 0
    }
  },
  created() {
    const [search, filters] = deserializeQuery(this.$route.query)
    if (search.length > 0) {
      this.$store.commit(MUTATION_SEARCH, search)
    }
    if (Object.keys(filters).length > 0) {
      this.$store.commit(MUTATION_FILTERS, filters)
    }
  },
  methods: {
    onFilter(newFilters) {
      this.$store.commit(MUTATION_FILTERS, newFilters)
      this.setQuery(this.search, newFilters)
    },
    updateUrlParams(query) {
      this.$router.replace({ name: ROUTE_HOME, query })
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
