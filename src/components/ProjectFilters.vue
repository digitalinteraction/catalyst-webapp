<template lang="pug">
.projectFilters
  h3.projectFilters-title
    //- button.collapse-button {{ isCollapsed ? '+' : '-' }}
    span Filter
    button.button.is-text.collapse-button(@click="toggleFilters")
      | {{ isCollapsed ? 'Show' : 'Hide' }} filters

  template(v-if="!isCollapsed")
    template(v-for="filter in filters")
      .field
        h4.projectFilters-heading
          span {{ filter.title }}
        div
          label.checkbox(v-for="option in getOptions(filter.prefix)" :key="option.id")
            input.checkbox(
              type="checkbox"
              :value="option.id"
              :checked="isChecked(filter, option)"
              @change="e => onChange(e, filter, option)"
            )
            | {{ option.name }}

    .buttons.is-centered
      button.button.is-text.collapse-button(@click="toggleFilters")
        span Hide filters

</template>

<script>
import { mapState } from 'vuex'
import { getLabels, toggleArrayValue, cloneFilters } from '@/utils'

/** Generate the default empty filters where each key is set to an empty array */
function emptyFilters(filters) {
  return filters
    .map(f => f.id)
    .reduce((newFilters, key) => ({ ...newFilters, [key]: [] }), {})
}

export default {
  props: {
    value: { type: Object, required: true }
  },
  data() {
    return { isCollapsed: false }
  },
  computed: {
    ...mapState('api', ['labels']),
    ...mapState('config', ['filters']),
    userFilters() {
      return {
        ...emptyFilters(this.filters),
        ...cloneFilters(this.value)
      }
    }
  },
  mounted() {
    this.isCollapsed = this.isMobile()
  },
  methods: {
    getOptions(prefix) {
      const labels = getLabels(this.labels, prefix)
      labels.sort((a, b) => a.name.localeCompare(b.name))
      return labels
    },
    isChecked(filter, option) {
      let values = this.userFilters[filter.id]
      return values.includes(option.id)
    },
    onChange(event, filter, option) {
      const newFilter = toggleArrayValue(this.userFilters[filter.id], option.id)

      this.$emit('input', {
        ...this.userFilters,
        [filter.id]: newFilter
      })
    },
    isMobile() {
      if (typeof window === 'undefined') return 1024
      return window.innerWidth < 770
    },
    toggleFilters() {
      if (!this.isMobile()) return
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style lang="sass">
.projectFilters
  margin-bottom: 0.2em

.projectFilters-title
  display: flex
  justify-content: space-between
  font-size: $size-3
  +is-title

.projectFilters-heading
  font-size: $size-5
  +is-title

label.checkbox
  display: block
  font-weight: normal
  font-size: 1em
  user-select: none
  &:not(:last-child)
    margin-bottom: 0.4em
  input
    margin-right: 0.5em

.projectFilters-heading
  display: flex
  // justify-content: space-between

.collapse-button
  +tablet
    display: none
</style>
