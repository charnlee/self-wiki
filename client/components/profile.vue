<template lang='pug'>
  v-app(:dark='$vuetify.theme.dark').profile
    nav-header
    v-navigation-drawer.profile-drawer.pb-0(v-model='profileDrawerShown', app, fixed, clipped, left, permanent)
      v-list(dense, nav)
        v-list-item(to='/profile', color='primary')
          v-list-item-action: v-icon mdi-face-profile
          v-list-item-content
            v-list-item-title {{$t('profile:title')}}
        //- v-list-item(to='/preferences', disabled)
        //-   v-list-item-action: v-icon(color='grey lighten-1') mdi-cog-outline
        //-   v-list-item-content
        //-     v-list-item-title Preferences
        //-     v-list-item-subtitle.caption.grey--text.text--lighten-1 Coming soon
        v-list-item(to='/pages', color='primary')
          v-list-item-action: v-icon mdi-file-document-outline
          v-list-item-content
            v-list-item-title {{$t('profile:pages.title')}}
        //- v-list-item(to='/comments', disabled)
        //-   v-list-item-action: v-icon(color='grey lighten-1') mdi-message-reply-text
        //-   v-list-item-content
        //-     v-list-item-title {{$t('profile:comments.title')}}
        //-     v-list-item-subtitle.caption.grey--text.text--lighten-1 Coming soon

    v-content.profile-main(:class='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-5"')
      transition(name='profile-router')
        router-view

    nav-footer
    notify
    search-results
</template>

<script>
import VueRouter from 'vue-router'

/* global WIKI */

const router = new VueRouter({
  mode: 'history',
  base: '/p',
  routes: [
    { path: '/', redirect: '/profile' },
    { path: '/profile', component: () => import(/* webpackChunkName: "profile" */ './profile/profile.vue') },
    { path: '/pages', component: () => import(/* webpackChunkName: "profile" */ './profile/pages.vue') },
    { path: '/comments', component: () => import(/* webpackChunkName: "profile" */ './profile/comments.vue') }
  ]
})

router.beforeEach((to, from, next) => {
  WIKI.$store.commit('loadingStart', 'profile')
  next()
})

router.afterEach((to, from) => {
  WIKI.$store.commit('loadingStop', 'profile')
})

export default {
  i18nOptions: { namespaces: 'profile' },
  data() {
    return {
      profileDrawerShown: true
    }
  },
  router,
  created() {
    this.$store.commit('page/SET_MODE', 'profile')
  }
}
</script>

<style lang='scss'>

.profile-router {
  &-enter-active, &-leave-active {
    transition: opacity .25s ease;
    opacity: 1;
  }
  &-enter-active {
    transition-delay: .25s;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
}

.profile-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &-title {
    margin-left: 1rem;
  }
}

.profile {
  --profile-bg: #f5f4ef;
  --profile-surface: rgba(255, 255, 255, .84);
  --profile-surface-solid: #fffefa;
  --profile-line: #e1ddd4;
  --profile-text: #18202a;
  --profile-muted: #6d7580;
  --profile-ink: #111827;
  --profile-blue: #315efb;
  --profile-sage: #718b7b;
  --profile-shadow: 0 16px 42px rgba(31, 36, 43, .08);
  background:
    linear-gradient(90deg, rgba(24, 32, 42, .028) 1px, transparent 1px),
    linear-gradient(180deg, rgba(24, 32, 42, .024) 1px, transparent 1px),
    var(--profile-bg) !important;
  background-size: 44px 44px, 44px 44px, auto;
  color: var(--profile-text);

  .nav-header.v-app-bar {
    border-bottom: 1px solid rgba(225, 221, 212, .9);
    background: rgba(245, 244, 239, .84) !important;
    box-shadow: none !important;
    backdrop-filter: blur(18px);
  }

  .profile-drawer.v-navigation-drawer {
    width: 248px !important;
    border-right: 1px solid rgba(225, 221, 212, .9) !important;
    background: rgba(255, 254, 250, .9) !important;
    box-shadow: none !important;

    .v-navigation-drawer__content {
      padding: 18px 14px;
      background: transparent !important;
    }

    .v-list {
      padding: 0;
      background: transparent !important;
    }

    .v-list-item {
      min-height: 42px;
      margin-bottom: 6px;
      border-radius: 8px;
      color: var(--profile-muted) !important;
      font-weight: 700;
      letter-spacing: 0;
    }

    .v-list-item--active {
      background: #edf1ff !important;
      color: var(--profile-blue) !important;
    }

    .v-list-item__action {
      margin-right: 12px;
    }

    .v-icon {
      color: currentColor !important;
    }
  }

  .profile-main {
    background: transparent !important;
  }

  .container {
    max-width: 1180px;
    padding: 34px 40px 72px;
  }

  .profile-header {
    min-height: 126px;
    margin-bottom: 8px;
    padding: 28px 30px;
    border: 1px solid var(--profile-line);
    border-radius: 10px;
    background:
      linear-gradient(135deg, rgba(255, 254, 250, .94), rgba(239, 244, 241, .86)),
      var(--profile-surface-solid);
    box-shadow: var(--profile-shadow);

    img {
      width: 64px !important;
      height: 64px;
      padding: 12px;
      border: 1px solid rgba(49, 94, 251, .16);
      border-radius: 10px;
      background: #f4f7ff;
    }
  }

  .profile-header-title {
    margin-left: 18px;

    .headline {
      color: var(--profile-ink) !important;
      font-size: 30px !important;
      font-weight: 820;
      letter-spacing: 0 !important;
      line-height: 1.15;
    }

    .subheading {
      margin-top: 7px;
      color: var(--profile-muted) !important;
      font-size: 14px;
      letter-spacing: 0;
    }
  }

  .profile-header .v-btn.success {
    height: 42px;
    border-radius: 8px !important;
    background: var(--profile-blue) !important;
    box-shadow: 0 10px 24px rgba(49, 94, 251, .18) !important;
    color: #ffffff !important;
    font-weight: 760;
  }

  .v-card {
    overflow: hidden;
    border: 1px solid var(--profile-line) !important;
    border-radius: 10px !important;
    background: var(--profile-surface) !important;
    box-shadow: var(--profile-shadow) !important;
    backdrop-filter: blur(12px);
  }

  .v-card .v-toolbar {
    height: 48px !important;
    border-bottom: 1px solid var(--profile-line);
    background: rgba(255, 254, 250, .86) !important;
    color: var(--profile-ink) !important;

    .v-toolbar__content {
      height: 48px !important;
    }

    .v-toolbar__title,
    .subtitle-1 {
      color: var(--profile-ink) !important;
      font-size: 14px !important;
      font-weight: 820;
      letter-spacing: 0;
    }
  }

  .v-list {
    background: transparent !important;
  }

  .v-list-item {
    min-height: 62px;
    padding: 0 18px;
  }

  .v-list-item__avatar {
    margin-right: 14px !important;

    .v-icon {
      width: 34px;
      height: 34px;
      display: inline-grid;
      place-items: center;
      border-radius: 8px;
      background: #edf4ef;
      color: var(--profile-sage) !important;
    }
  }

  .v-list-item__title {
    color: var(--profile-ink);
    font-size: 13px;
    font-weight: 760;
  }

  .v-list-item__subtitle,
  .caption,
  .grey--text {
    color: var(--profile-muted) !important;
  }

  .v-list-item__action .v-btn {
    border-radius: 7px !important;
    color: var(--profile-blue) !important;
    font-weight: 700;
  }

  .v-divider {
    border-color: rgba(225, 221, 212, .76) !important;
  }

  .v-card__text {
    color: var(--profile-text) !important;
  }

  .v-subheader {
    height: auto;
    padding-top: 18px;
    color: var(--profile-muted) !important;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
  }

  .v-input__slot {
    border-radius: 8px !important;
    background: rgba(255, 254, 250, .9) !important;
    box-shadow: none !important;
  }

  .v-text-field--outlined fieldset {
    border-color: var(--profile-line) !important;
  }

  .v-card__actions,
  .v-card-chin {
    border-top: 1px solid var(--profile-line);
    background: rgba(247, 246, 243, .58);
  }

  .v-card-chin .v-btn,
  .v-card__actions .v-btn {
    border-radius: 8px !important;
    font-weight: 760;
  }
}

.theme--dark.profile {
  --profile-bg: #0d1117;
  --profile-surface: rgba(22, 27, 34, .88);
  --profile-surface-solid: #161b22;
  --profile-line: #303843;
  --profile-text: #d8e0e7;
  --profile-muted: #93a1af;
  --profile-ink: #ffffff;
  --profile-blue: #7aa2ff;
  --profile-sage: #9bb8a3;
  --profile-shadow: 0 18px 48px rgba(0, 0, 0, .28);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, .032) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, .026) 1px, transparent 1px),
    radial-gradient(circle at 28% 0%, rgba(76, 104, 255, .12), transparent 34%),
    #0d1117 !important;
  background-size: 44px 44px, 44px 44px, auto, auto;

  .nav-header.v-app-bar {
    border-bottom-color: rgba(48, 56, 67, .9);
    background: rgba(13, 17, 23, .86) !important;
  }

  .profile-drawer.v-navigation-drawer {
    border-right-color: rgba(48, 56, 67, .9) !important;
    background: rgba(16, 21, 29, .92) !important;

    .v-navigation-drawer__content {
      background: transparent !important;
    }

    .v-list-item {
      color: var(--profile-muted) !important;
    }

    .v-list-item--active {
      background: rgba(122, 162, 255, .14) !important;
      color: var(--profile-blue) !important;
    }
  }

  .profile-main {
    background: transparent !important;
  }

  .profile-header {
    border-color: var(--profile-line);
    background:
      linear-gradient(135deg, rgba(22, 27, 34, .96), rgba(18, 26, 31, .9)),
      var(--profile-surface-solid) !important;
    box-shadow: var(--profile-shadow);

    img {
      border-color: rgba(122, 162, 255, .18);
      background: rgba(122, 162, 255, .1);
    }
  }

  .profile-header .v-btn.success {
    background: #4269e8 !important;
    box-shadow: 0 14px 30px rgba(66, 105, 232, .28) !important;
  }

  .v-card {
    border-color: var(--profile-line) !important;
    background: var(--profile-surface) !important;
    box-shadow: var(--profile-shadow) !important;
  }

  .v-card .v-toolbar {
    border-bottom-color: var(--profile-line);
    background: rgba(18, 24, 32, .9) !important;
    color: var(--profile-ink) !important;
  }

  .v-list,
  .v-card__text,
  .v-menu__content .v-card,
  .v-menu__content .v-list,
  .v-input__slot {
    background: var(--profile-surface) !important;
  }

  .v-list-item__avatar .v-icon {
    background: rgba(155, 184, 163, .12);
    color: var(--profile-sage) !important;
  }

  .v-list-item__title,
  .body-2,
  strong {
    color: var(--profile-text) !important;
  }

  .v-list-item__subtitle,
  .caption,
  .grey--text,
  .v-label,
  input,
  .v-select__selection {
    color: var(--profile-muted) !important;
  }

  .v-divider,
  .v-text-field--outlined fieldset {
    border-color: var(--profile-line) !important;
  }

  .v-card__actions,
  .v-card-chin {
    border-top-color: var(--profile-line);
    background: rgba(13, 17, 23, .42);
  }

  .v-toolbar.purple,
  .v-toolbar.purple.lighten-5,
  .v-toolbar.grey,
  .v-toolbar.blue-grey {
    background: rgba(122, 162, 255, .1) !important;
    color: var(--profile-blue) !important;
  }

  .v-btn {
    color: var(--profile-blue) !important;
  }
}

</style>
