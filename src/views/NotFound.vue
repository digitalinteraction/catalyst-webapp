<template lang="pug">
.page.not-found
  PrimaryHero.is-not-found
    h1.title.inherit-color.is-size-4-mobile {{ title || 'Page not found' }}
  .container
    .section.is-medium
      .message.is-danger.is-medium
        .message-header
          p {{ title || 'Page not found' }}
        .message-body
          p {{ message || "We couldn't find the page you were looking for" }}
      
      .buttons.is-centered
        router-link.button.is-text.is-medium(:to="homeRoute") Go home
  PageFooter
</template>

<script>
import { mapContent } from '@/utils'
import { ROUTE_HOME } from '@/const'
import PrimaryHero from '@/components/PrimaryHero.vue'
import PageFooter from '@/components/PageFooter.vue'

export default {
  components: { PrimaryHero, PageFooter },
  computed: {
    ...mapContent({
      title: 'notFound.title',
      message: 'notFound.message'
    }),
    homeRoute() {
      return { name: ROUTE_HOME }
    }
  }
}
</script>
