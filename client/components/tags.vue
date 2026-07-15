<template lang='pug'>
  v-app(:dark='$vuetify.theme.dark').tags
    nav-header
    v-navigation-drawer.tags-drawer.pb-0(app, fixed, clipped, :right='$vuetify.rtl', permanent, width='300')
      vue-scroll(:ops='scrollStyle')
        v-list(dense, nav)
          v-list-item(href='/')
            v-list-item-icon: v-icon mdi-home
            v-list-item-title {{$t('common:header.home')}}
          template(v-for='(tags, groupName) in tagsGrouped')
            v-divider.my-2
            v-subheader.pl-4(:key='`tagGroup-` + groupName') {{groupName}}
            v-list-item(v-for='tag of tags', @click='toggleTag(tag.tag)', :key='`tag-` + tag.tag')
              v-list-item-icon
                v-icon(v-if='isSelected(tag.tag)', color='primary') mdi-checkbox-intermediate
                v-icon(v-else) mdi-checkbox-blank-outline
              v-list-item-title {{tag.title}}
    v-content.tags-main
      v-toolbar.tags-selection-bar(flat, height='58')
        template(v-if='selection.length > 0')
          .overline.mr-3.animated.fadeInLeft {{$t('tags:currentSelection')}}
          v-chip.mr-3.primary--text(
            v-for='tag of tagsSelected'
            :key='`tagSelected-` + tag.tag'
            color='primary'
            outlined
            close
            @click:close='toggleTag(tag.tag)'
            ) {{tag.title}}
          v-spacer
          v-btn.tags-clear-btn.animated.fadeIn(
            small
            outlined
            color='primary'
            rounded
            @click='selection = []'
            )
            v-icon(left) mdi-close
            span {{$t('tags:clearSelection')}}
        template(v-else)
          v-icon.mr-3.animated.fadeInRight mdi-arrow-left
          .overline.animated.fadeInRight {{$t('tags:selectOneMoreTags')}}
      v-toolbar.tags-filter-bar(flat, height='58')
        v-text-field.tags-search(
          v-model='innerSearch'
          :label='$t(`tags:searchWithinResultsPlaceholder`)'
          solo
          hide-details
          flat
          rounded
          single-line
          height='40'
          prepend-icon='mdi-text-box-search-outline'
          append-icon='mdi-arrow-right'
          clearable
        )
        template(v-if='locales.length > 1')
          v-divider.mx-3(vertical)
          .overline {{$t('tags:locale')}}
          v-select.ml-2(
            :items='locales'
            v-model='locale'
            :background-color='$vuetify.theme.dark ? `grey darken-3` : `white`'
            hide-details
            :label='$t(`tags:locale`)'
            item-text='name'
            item-value='code'
            rounded
            single-line
            dense
            height='40'
            style='max-width: 170px;'
          )
        v-divider.mx-3(vertical)
        .overline {{$t('tags:orderBy')}}
        v-select.ml-2(
          :items='orderByItems'
          v-model='orderBy'
          :background-color='$vuetify.theme.dark ? `grey darken-3` : `white`'
          hide-details
          :label='$t(`tags:orderBy`)'
          rounded
          single-line
          dense
          height='40'
          style='max-width: 250px;'
        )
        v-btn-toggle.ml-2(v-model='orderByDirection', rounded, mandatory)
          v-btn(text, height='40'): v-icon(size='20') mdi-chevron-double-up
          v-btn(text, height='40'): v-icon(size='20') mdi-chevron-double-down
      v-divider
      .tags-empty-state.text-center.pt-10(v-if='selection.length < 1')
        img(src='/_assets/svg/icon-price-tag.svg')
        .subtitle-2.grey--text {{$t('tags:selectOneMoreTagsHint')}}
      .tags-results.px-5.py-2(v-else)
        v-data-iterator(
          :items='pages'
          :items-per-page='4'
          :search='innerSearch'
          :loading='isLoading'
          :options.sync='pagination'
          @page-count='pageTotal = $event'
          hide-default-footer
          ref='dude'
          )
          template(v-slot:loading)
            .tags-empty-state.text-center.pt-10
              v-progress-circular(
                indeterminate
                color='primary'
                size='96'
                width='2'
                )
              .subtitle-2.grey--text.mt-5 {{$t('tags:retrievingResultsLoading')}}
          template(v-slot:no-data)
            .tags-empty-state.text-center.pt-10
              img(src='/_assets/svg/icon-info.svg')
              .subtitle-2.grey--text {{$t('tags:noResults')}}
          template(v-slot:no-results)
            .tags-empty-state.text-center.pt-10
              img(src='/_assets/svg/icon-info.svg')
              .subtitle-2.grey--text {{$t('tags:noResultsWithFilter')}}
          template(v-slot:default='props')
            v-row(align='stretch')
              v-col(
                v-for='item of props.items'
                :key='`page-` + item.id'
                cols='12'
                lg='6'
                )
                v-card.tags-result-card(
                  @click='goTo(item)'
                  style='height:100%;'
                  :class='$vuetify.theme.dark ? `grey darken-4` : ``'
                  )
                  v-card-text
                    .d-flex.flex-row.align-center
                      .body-1: strong.primary--text {{item.title}}
                      v-spacer
                      i18next.caption(tag='div', path='tags:pageLastUpdated')
                        span(place='date') {{item.updatedAt | moment('from')}}
                    .body-2.grey--text {{item.description || '---'}}
                    v-divider.my-2
                    .d-flex.flex-row.align-center
                      v-chip(small, label, :color='$vuetify.theme.dark ? `grey darken-3-l5` : `grey lighten-4`').overline {{item.locale}}
                      .caption.ml-1 / {{item.path}}
        .text-center.py-2.animated.fadeInDown(v-if='this.pageTotal > 1')
          v-pagination(v-model='pagination.page', :length='pageTotal')

    nav-footer
    notify
    search-results
</template>

<script>
import VueRouter from 'vue-router'
import _ from 'lodash'

import tagsQuery from 'gql/common/common-pages-query-tags.gql'
import pagesQuery from 'gql/common/common-pages-query-list.gql'

/* global siteLangs */

const router = new VueRouter({
  mode: 'history',
  base: '/t'
})

export default {
  i18nOptions: { namespaces: 'tags' },
  data() {
    return {
      tags: [],
      selection: [],
      innerSearch: '',
      locale: 'any',
      locales: [],
      orderBy: 'title',
      orderByDirection: 0,
      pagination: {
        page: 1,
        itemsPerPage: 12,
        mustSort: true,
        sortBy: ['title'],
        sortDesc: [false]
      },
      pages: [],
      pageTotal: 0,
      isLoading: true,
      scrollStyle: {
        vuescroll: {},
        scrollPanel: {
          initialScrollY: 0,
          initialScrollX: 0,
          scrollingX: false,
          easing: 'easeOutQuad',
          speed: 1000,
          verticalNativeBarPos: this.$vuetify.rtl ? `left` : `right`
        },
        rail: {
          gutterOfEnds: '2px'
        },
        bar: {
          onlyShowBarOnScroll: false,
          background: '#CCC',
          hoverStyle: {
            background: '#999'
          }
        }
      }
    }
  },
  computed: {
    tagsGrouped () {
      return _.groupBy(this.tags, t => t.title.charAt(0).toUpperCase())
    },
    tagsSelected () {
      return _.filter(this.tags, t => _.includes(this.selection, t.tag))
    },
    orderByItems () {
      return [
        { text: this.$t('tags:orderByField.creationDate'), value: 'createdAt' },
        { text: this.$t('tags:orderByField.ID'), value: 'id' },
        { text: this.$t('tags:orderByField.lastModified'), value: 'updatedAt' },
        { text: this.$t('tags:orderByField.path'), value: 'path' },
        { text: this.$t('tags:orderByField.title'), value: 'title' }
      ]
    }
  },
  watch: {
    locale (newValue, oldValue) {
      this.rebuildURL()
    },
    orderBy (newValue, oldValue) {
      this.rebuildURL()
      this.pagination.sortBy = [newValue]
    },
    orderByDirection (newValue, oldValue) {
      this.rebuildURL()
      this.pagination.sortDesc = [newValue === 1]
    }
  },
  router,
  created () {
    this.$store.commit('page/SET_MODE', 'tags')
    this.selection = _.compact(decodeURI(this.$route.path).split('/'))
  },
  mounted () {
    this.locales = _.concat(
      [{name: this.$t('tags:localeAny'), code: 'any'}],
      (siteLangs.length > 0 ? siteLangs : [])
    )
    if (this.$route.query.lang) {
      this.locale = this.$route.query.lang
    }
    if (this.$route.query.sort) {
      this.orderBy = this.$route.query.sort.toLowerCase()
      switch (this.orderBy) {
        case 'updatedat':
          this.orderBy = 'updatedAt'
          break
      }
      this.pagination.sortBy = [this.orderBy]
    }
    if (this.$route.query.dir) {
      this.orderByDirection = this.$route.query.dir === 'asc' ? 0 : 1
      this.pagination.sortDesc = [this.orderByDirection === 1]
    }
  },
  methods: {
    toggleTag (tag) {
      if (_.includes(this.selection, tag)) {
        this.selection = _.without(this.selection, tag)
      } else {
        this.selection.push(tag)
      }
      this.rebuildURL()
    },
    isSelected (tag) {
      return _.includes(this.selection, tag)
    },
    rebuildURL () {
      let urlObj = {
        path: '/' + this.selection.join('/')
      }
      if (this.locale !== `any`) {
        _.set(urlObj, 'query.lang', this.locale)
      }
      if (this.orderBy !== `TITLE`) {
        _.set(urlObj, 'query.sort', this.orderBy.toLowerCase())
      }
      if (this.orderByDirection !== 0) {
        _.set(urlObj, 'query.dir', this.orderByDirection === 0 ? `asc` : `desc`)
      }
      this.$router.push(urlObj)
    },
    goTo (page) {
      window.location.assign(`/${page.locale}/${page.path}`)
    }
  },
  apollo: {
    tags: {
      query: tagsQuery,
      fetchPolicy: 'cache-and-network',
      update: (data) => _.cloneDeep(data.pages.tags),
      watchLoading (isLoading) {
        this.$store.commit(`loading${isLoading ? 'Start' : 'Stop'}`, 'tags-refresh')
      }
    },
    pages: {
      query: pagesQuery,
      fetchPolicy: 'cache-and-network',
      update: (data) => _.cloneDeep(data.pages.list),
      watchLoading (isLoading) {
        this.isLoading = isLoading
        this.$store.commit(`loading${isLoading ? 'Start' : 'Stop'}`, 'pages-refresh')
      },
      variables () {
        return {
          locale: this.locale === 'any' ? null : this.locale,
          tags: this.selection
        }
      },
      skip () {
        return this.selection.length < 1
      }
    }
  }
}
</script>

<style lang='scss'>
.tags {
  --tags-bg: #f5f4ef;
  --tags-surface: rgba(255, 255, 255, .86);
  --tags-surface-solid: #fffefa;
  --tags-line: #e1ddd4;
  --tags-text: #18202a;
  --tags-muted: #6d7580;
  --tags-ink: #111827;
  --tags-blue: #315efb;
  --tags-sage: #718b7b;
  --tags-shadow: 0 16px 42px rgba(31, 36, 43, .08);
  background:
    linear-gradient(90deg, rgba(24, 32, 42, .028) 1px, transparent 1px),
    linear-gradient(180deg, rgba(24, 32, 42, .024) 1px, transparent 1px),
    var(--tags-bg) !important;
  background-size: 44px 44px, 44px 44px, auto;
  color: var(--tags-text);

  .tags-drawer.v-navigation-drawer {
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

    .v-subheader {
      height: auto;
      padding: 16px 12px 7px !important;
      color: var(--tags-muted) !important;
      font-size: 11px;
      font-weight: 820;
      letter-spacing: 0;
    }

    .v-list-item {
      min-height: 38px;
      margin-bottom: 4px;
      border-radius: 8px;
      color: var(--tags-muted) !important;
      font-weight: 680;
    }

    .v-list-item:hover {
      background: rgba(49, 94, 251, .07) !important;
      color: var(--tags-blue) !important;
    }

    .v-icon {
      color: currentColor !important;
    }
  }

  .tags-main {
    background: transparent !important;
  }

  .tags-selection-bar.v-toolbar,
  .tags-filter-bar.v-toolbar {
    margin: 18px 32px 0;
    border: 1px solid var(--tags-line);
    border-radius: 10px;
    background: var(--tags-surface) !important;
    box-shadow: var(--tags-shadow);
    color: var(--tags-text) !important;
    backdrop-filter: blur(12px);

    .v-toolbar__content {
      padding-right: 18px;
      padding-left: 18px;
    }

    .overline {
      color: var(--tags-muted);
      font-weight: 820;
      letter-spacing: 0 !important;
    }
  }

  .tags-filter-bar.v-toolbar {
    margin-top: 12px;
  }

  .tags-selection-bar .v-chip {
    border-color: rgba(49, 94, 251, .22) !important;
    background: #edf1ff !important;
    color: var(--tags-blue) !important;
    font-weight: 760;
  }

  .tags-clear-btn.v-btn {
    border-color: rgba(49, 94, 251, .32) !important;
    color: var(--tags-blue) !important;
    font-weight: 760;
  }

  .tags-search .v-input__slot,
  .v-select .v-input__slot {
    border: 1px solid var(--tags-line);
    border-radius: 8px !important;
    background: rgba(255, 254, 250, .92) !important;
    box-shadow: none !important;
  }

  .tags-empty-state {
    max-width: 520px;
    margin: 72px auto 0;
    padding: 44px 32px;
    border: 1px solid var(--tags-line);
    border-radius: 10px;
    background: var(--tags-surface);
    box-shadow: var(--tags-shadow);

    img {
      width: 136px;
      max-width: 42vw;
      opacity: .82;
    }

    .subtitle-2 {
      margin-top: 16px;
      color: var(--tags-muted) !important;
      font-size: 14px;
    }
  }

  .tags-results {
    padding: 26px 32px 18px !important;
  }

  .tags-result-card.v-card {
    overflow: hidden;
    border: 1px solid var(--tags-line) !important;
    border-radius: 10px !important;
    background: var(--tags-surface) !important;
    box-shadow: var(--tags-shadow) !important;
    color: var(--tags-text);
    transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;

    &:hover {
      border-color: rgba(49, 94, 251, .32) !important;
      box-shadow: 0 20px 48px rgba(31, 36, 43, .12) !important;
      transform: translateY(-2px);
    }

    .primary--text {
      color: var(--tags-blue) !important;
    }

    .grey--text,
    .caption,
    .body-2 {
      color: var(--tags-muted) !important;
    }

    .v-chip {
      border: 1px solid rgba(113, 139, 123, .22);
      background: #edf4ef !important;
      color: var(--tags-sage) !important;
    }
  }

  .v-pagination {
    .v-pagination__item,
    .v-pagination__navigation {
      border-radius: 8px;
      box-shadow: none;
    }
  }
}

.theme--dark.tags {
  --tags-bg: #0d1117;
  --tags-surface: rgba(22, 27, 34, .88);
  --tags-surface-solid: #161b22;
  --tags-line: #303843;
  --tags-text: #d8e0e7;
  --tags-muted: #93a1af;
  --tags-ink: #ffffff;
  --tags-blue: #7aa2ff;
  --tags-sage: #9bb8a3;
  --tags-shadow: 0 18px 48px rgba(0, 0, 0, .28);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, .032) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, .026) 1px, transparent 1px),
    radial-gradient(circle at 25% 0%, rgba(76, 104, 255, .12), transparent 34%),
    #0d1117 !important;
  background-size: 44px 44px, 44px 44px, auto, auto;

  .tags-drawer.v-navigation-drawer {
    border-right-color: rgba(48, 56, 67, .9) !important;
    background: rgba(16, 21, 29, .92) !important;
  }

  .tags-selection-bar.v-toolbar,
  .tags-filter-bar.v-toolbar,
  .tags-empty-state,
  .tags-result-card.v-card,
  .tags-search .v-input__slot,
  .v-select .v-input__slot,
  .v-menu__content .v-card,
  .v-menu__content .v-list {
    border-color: var(--tags-line) !important;
    background: var(--tags-surface) !important;
  }

  .tags-selection-bar .v-chip {
    border-color: rgba(122, 162, 255, .24) !important;
    background: rgba(122, 162, 255, .12) !important;
    color: var(--tags-blue) !important;
  }

  .tags-result-card.v-card .v-chip {
    border-color: rgba(155, 184, 163, .22);
    background: rgba(155, 184, 163, .12) !important;
    color: var(--tags-sage) !important;
  }

  .v-label,
  input,
  .v-select__selection,
  .v-list-item__title,
  .body-1,
  strong {
    color: var(--tags-text) !important;
  }

  .overline,
  .grey--text,
  .caption,
  .body-2 {
    color: var(--tags-muted) !important;
  }

  .v-divider {
    border-color: var(--tags-line) !important;
  }
}

.tags-search {
  .v-input__control {
    min-height: initial !important;
  }
  .v-input__prepend-outer {
    margin-top: 8px !important;
  }
}
</style>
