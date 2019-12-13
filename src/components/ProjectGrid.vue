<template lang="pug">
.project-grid
  .columns.is-multiline
    .column.is-one-third(v-for="project in projects", :key="project.id", )
      ProjectCard(:project="project")
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
.column
  display: flex
  justify-content: stretch
</style>
