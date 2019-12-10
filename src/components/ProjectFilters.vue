<template lang="pug">
.project-filters
  h3.title.is-3 Filter
  .field
    h4.title.is-4 Call for proposal
    label.checkbox.is-multiple(v-for="call in allCalls" :key="call.id")
      input.checkbox(
        type="checkbox"
        :value="call.id"
        v-model="chosenCalls"
      )
      | {{ call.name }}
  
  .field
    h4.title.is-4 Keywords
    label.checkbox.is-multiple(v-for="theme in allThemes" :key="theme.id")
      input.checkbox(
        type="checkbox"
        :value="theme.id"
        v-model="chosenThemes"
      )
      | {{ theme.name }}
  
  hr

  pre(v-html="{ chosenCalls, chosenThemes }")

</template>

<script>
import casex from 'casex'
import { mapState } from 'vuex'

function getLabels(labels, prefix) {
  if (!labels) return []
  return labels
    .filter(l => l.name.startsWith(prefix))
    .map(l => convertLabel(l, prefix))
}

function convertLabel(label, prefix) {
  return {
    id: label.id,
    name: casex(label.name.replace(prefix, ''), 'Ca Se')
  }
}

export default {
  props: {
    calls: { type: Array, required: true },
    themes: { type: Array, required: true }
  },
  data() {
    return {
      chosenCalls: [...this.calls],
      chosenThemes: [...this.themes]
    }
  },
  computed: {
    ...mapState('api', ['labels']),
    allCalls() {
      return getLabels(this.labels, 'category:')
    },
    allThemes() {
      return getLabels(this.labels, 'theme:')
    }
  }
}
</script>

<style lang="sass" scoped>
h4.title
  margin-bottom: 0.2em
</style>
