<template lang="pug">
.page.about
  PrimaryHero.is-gradient
    h1.title.inherit-color.is-size-4-mobile {{ title || 'About' }}
    p.subtitle.inherit-color.is-size-6-mobile {{ subtitle }}
  
  section.crumbs
    .container
      nav.breadcrumb.has-text-weight-bold
        ul
          li: router-link(to="/") Home
          li.is-active: a(href="#") {{ title || 'About' }}
  
  .page-expand
    section.section
      ContentBlock(content-key="about.long")
  PageFooter
</template>

<script>
import { mapContent } from '@/utils'

import ContentBlock from '@/components/ContentBlock.vue'
import PrimaryHero from '@/components/PrimaryHero.vue'
import PageFooter from '@/components/PageFooter.vue'

export default {
  components: { ContentBlock, PrimaryHero, PageFooter },
  computed: {
    ...mapContent({
      title: 'about.title',
      subtitle: 'about.subtitle'
    })
  }
}
</script>

<style lang="sass" scoped></style>
