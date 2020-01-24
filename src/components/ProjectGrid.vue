<template lang="pug">
.project-grid
  ProjectCard(v-for="project in projects", :key="project.id" :project="project")
</template>

<script>
import ProjectCard from '@/components/ProjectCard.vue'

export default {
  components: { ProjectCard },
  props: {
    projects: { type: Array, required: true }
  }
}
</script>

<style lang="sass" scoped>
.project-grid
  display: grid
  grid: auto-flow / 1fr
  grid-gap: $gap / 2

  +tablet
    grid-template-columns: 1fr 1fr

  +desktop
    grid-template-columns: 1fr 1fr 1fr
</style>

<style lang="sass">
.project-grid > *
  overflow: hidden
</style>
