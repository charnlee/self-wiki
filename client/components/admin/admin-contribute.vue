<template lang='pug'>
  v-container.admin-contribute(fluid, grid-list-lg)
    v-layout(row, wrap)
      v-flex(xs12)
        .admin-header
          img.animated.fadeInUp(src='/_assets/favicons/favicon.svg', alt='charnlee.wiki', style='width: 80px;')
          .admin-header-title
            .headline.primary--text.animated.fadeInLeft charnlee.wiki
            .subtitle-1.grey--text.animated.fadeInLeft.wait-p4s Self-hosted knowledge base
        v-card.mt-3.animated.fadeInUp
          v-card-text
            .body-2.pl-3 charnlee.wiki is maintained as a personal knowledge base for documents, notes and internal references.
            v-divider.my-4
            v-subheader.subtitle-2 Project
            v-list(two-line)
              v-list-item
                v-list-item-avatar
                  v-icon.primary.white--text mdi-book-open-page-variant
                v-list-item-content
                  v-list-item-title Documentation-first
                  v-list-item-subtitle A focused workspace for writing, organizing and searching knowledge.
              v-list-item
                v-list-item-avatar
                  v-icon.primary.white--text mdi-server
                v-list-item-content
                  v-list-item-title Self-hosted
                  v-list-item-subtitle Runs on your own server with local database and deployment control.
              v-list-item
                v-list-item-avatar
                  v-icon.primary.white--text mdi-palette-outline
                v-list-item-content
                  v-list-item-title Custom brand
                  v-list-item-subtitle Interface, logo and default naming are tailored for charnlee.wiki.
            v-divider.my-4
            v-subheader.subtitle-2 Links
            v-card-actions
              v-btn(outlined, color='primary', href='https://charnlee.art', target='_blank')
                v-icon(left) mdi-earth
                span Visit Site
              v-btn(outlined, color='primary', href='https://github.com/charnlee/self-wiki', target='_blank')
                v-icon(left) mdi-github
                span Source
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang='scss'>
.admin-contribute {
  .v-list-item__subtitle {
    white-space: normal;
  }
}
</style>
