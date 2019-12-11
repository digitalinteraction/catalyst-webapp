<template lang="pug">
.projectFilters
  h3.projectFilters-title Filter

  template(v-for="filter in allFilters")
    .field
      h4.projectFilters-heading(@click="toggleFilter(filter)")
        span {{ filter.title }}
        button.collapse-button {{ isCollapsed(filter) ? '+' : '-' }}
      div(v-show="!isCollapsed(filter)")
        label.checkbox(v-for="option in getOptions(filter.prefix)" :key="option.id")
          input.checkbox(
            type="checkbox"
            :value="option.id"
            :checked="isChecked(filter, option)"
            @change="e => onChange(e, filter, option)"
          )
          | {{ option.name }}

</template>

<script>
import { mapState } from 'vuex'
import allFilters from '@/data/filters.json'
import { getLabels, toggleArrayValue, cloneFilters } from '@/utils'

/** Generate the default empty filters where each key is set to an empty array */
function emptyFilters() {
  return allFilters.map(f => f.id).reduce((m, k) => ({ ...m, [k]: [] }), {})
}

export default {
  props: {
    value: { type: Object, required: true }
  },
  data() {
    return { allFilters, collapsedFilters: [] }
  },
  computed: {
    ...mapState('api', ['labels']),
    userFilters() {
      return {
        ...emptyFilters(),
        ...cloneFilters(this.value)
      }
    }
  },
  methods: {
    getOptions(prefix) {
      return getLabels(this.labels, prefix)
    },
    isChecked(filter, option) {
      let values = this.userFilters[filter.id]
      return values.includes(option.id)
    },
    isCollapsed(filter) {
      return this.collapsedFilters.includes(filter.id)
    },
    onChange(event, filter, option) {
      const newFilter = toggleArrayValue(this.userFilters[filter.id], option.id)

      this.$emit('input', {
        ...this.userFilters,
        [filter.id]: newFilter
      })
    },
    toggleFilter(filter) {
      this.collapsedFilters = toggleArrayValue(this.collapsedFilters, filter.id)
    }
  }
}
</script>

<style lang="sass" scoped>
.projectFilters
  margin-bottom: 0.2em

.projectFilters-title
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
  justify-content: space-between
  cursor: pointer

.collapse-button
  font-family: $family-monospace
  padding: 0 0.5em
  font-size: 1em
  background: white
  outline: none
  border: none
  font-weight: 900
  transform: scale(1.3)
  cursor: pointer
</style>
