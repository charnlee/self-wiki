<template lang="pug">
  .nav-sidebar-modern
    .reader-sidebar-brand
      .reader-brand-mark(@click='goHome')
        span C
      .reader-brand-copy(@click='goHome')
        .reader-brand-name Charnlee's Wiki
      .reader-brand-avatar(v-if='isAuthenticated') CL
    .reader-sidebar-tools
      .reader-search-box
        reader-icon(name='search', size='18')
        input(
          v-model='sidebarFilter'
          type='search'
          placeholder='搜索文档'
          autocomplete='off'
          :aria-label='$t(`common:header.search`)'
          )
        kbd ⌘ K
      button.reader-create-btn(v-if='hasNewPagePermission && path', type='button', @click='pageNew')
        reader-icon(name='plus', size='19')
        span 新建页面
        reader-icon(name='chevron-down', size='15')
    v-list.reader-tree.reader-home-list(v-if='currentMode === `browse`', dense, :class='color', :dark='dark')
      v-list-item.reader-tree-row.reader-home-row(
        :href='`/` + locale + `/home`'
        :input-value='path === `home`'
        )
        v-list-item-avatar(size='24')
          reader-icon(name='home', size='18')
        v-list-item-title 首页
    .reader-tree-head
      span 文档
      button(type='button', @click='pageNew', v-if='hasNewPagePermission && path', aria-label='新建页面') +
      button(type='button', @click='sidebarFilter = ``', v-if='sidebarFilter', aria-label='清除搜索') ×
    //-> Custom Navigation
    v-list.reader-tree(v-if='currentMode === `custom`', dense, :class='color', :dark='dark')
      template(v-for='item of visibleCustomItems')
        v-list-item(
          v-if='item.k === `link`'
          :href='item.t'
          :target='item.y === `externalblank` ? `_blank` : `_self`'
          :rel='item.y === `externalblank` ? `noopener` : ``'
          )
          v-list-item-avatar(size='24', tile)
            reader-icon(:name='iconForItem(item)', size='18')
          v-list-item-title {{ item.l }}
        v-divider.my-2(v-else-if='item.k === `divider`')
        v-subheader.pl-4(v-else-if='item.k === `header`') {{ item.l }}
      .reader-empty-state(v-if='visibleCustomItems.length < 1') 没有匹配的页面
    //-> Browse
    v-list.reader-tree(v-else-if='currentMode === `browse`', dense, :class='color', :dark='dark')
      template(v-for='item of visibleBrowseItems')
        v-list-item.reader-tree-row(
          v-if='item.isFolder'
          :key='`folder-` + item.id'
          :class='{ "is-expanded": isFolderExpanded(item), "is-child-active": isFolderInCurrentPath(item), "has-depth": item.depth > 0 }'
          :style='treeRowStyle(item.depth)'
          @click='toggleFolder(item)'
          )
          v-list-item-avatar.reader-tree-chevron(size='18')
            reader-icon(:name='isFolderExpanded(item) ? `chevron-down` : `chevron-down`', size='14')
          v-list-item-avatar(size='24')
            reader-icon(:name='isFolderExpanded(item) ? `folder-open` : `folder`', size='18')
          v-list-item-title {{ item.title }}
        v-list-item.reader-tree-row(
          v-else
          :key='`page-` + item.id'
          :href='`/` + item.locale + `/` + item.path'
          :input-value='path === item.path'
          :class='{ "has-depth": item.depth > 0 }'
          :style='treeRowStyle(item.depth)'
          )
          v-list-item-avatar.reader-tree-chevron(size='18')
          v-list-item-avatar(size='24')
            reader-icon(name='file-text', size='18')
          v-list-item-title {{ item.title }}
      .reader-empty-state(v-if='visibleBrowseItems.length < 1') 没有匹配的页面
    .reader-sidebar-footer
      button(type='button', @click='goSettings')
        reader-icon(name='settings', size='17')
        span 设置
      button(type='button', @click='goHistory')
        reader-icon(name='history', size='17')
        span 历史
      button(type='button', @click='goAccount')
        reader-icon(name='user', size='17')
        span 账户
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { get } from 'vuex-pathify'
import ReaderIcon from './reader-icon.vue'

/* global siteLangs */

export default {
  components: {
    ReaderIcon
  },
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    dark: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => []
    },
    navMode: {
      type: String,
      default: 'MIXED'
    }
  },
  data() {
    return {
      currentMode: 'custom',
      currentItems: [],
      currentParent: {
        id: 0,
        title: '/ (root)'
      },
      parents: [],
      loadedCache: [],
      expandedFolders: {},
      treeItems: [],
      sidebarFilter: ''
    }
  },
  computed: {
    path: get('page/path'),
    locale: get('page/locale'),
    title: get('site/title'),
    name: get('user/name'),
    isAuthenticated: get('user/authenticated'),
    permissions: get('user/permissions'),
    hasAdminPermission: get('page/effectivePermissions@system.manage'),
    displayTitle () {
      return this.title === 'Wiki.js' ? 'charnlee.wiki' : this.title
    },
    userInitials () {
      const source = this.name || 'CW'
      const nameParts = source.toUpperCase().split(' ')
      let initials = _.head(nameParts).charAt(0)
      if (nameParts.length > 1) {
        initials += _.last(nameParts).charAt(0)
      }
      return initials
    },
    hasNewPagePermission () {
      return this.hasAdminPermission || _.intersection(this.permissions || [], ['write:pages']).length > 0
    },
    visibleCustomItems () {
      const query = this.normalizedSidebarFilter
      if (!query) {
        return this.items
      }
      return _.filter(this.items, item => item.k === 'link' && _.includes(_.toLower(item.l), query))
    },
    visibleBrowseItems () {
      const query = this.normalizedSidebarFilter
      return this.flattenTree(this.treeItems, query)
    },
    normalizedSidebarFilter () {
      return _.trim(_.toLower(this.sidebarFilter))
    }
  },
  methods: {
    iconForItem (item) {
      return this.isHomeItem(item) ? 'home' : 'file-text'
    },
    switchMode (mode) {
      this.currentMode = mode
      window.localStorage.setItem('navPref', mode)
      if (mode === `browse` && this.loadedCache.length < 1) {
        this.loadFullTree()
      }
    },
    async fetchBrowseItems (item) {
      this.$store.commit(`loadingStart`, 'browse-load')
      if (!item) {
        item = this.currentParent
      }

      if (this.loadedCache.indexOf(item.id) < 0) {
        this.currentItems = []
      }

      if (item.id === 0) {
        this.parents = []
      } else {
        const flushRightIndex = _.findIndex(this.parents, ['id', item.id])
        if (flushRightIndex >= 0) {
          this.parents = _.take(this.parents, flushRightIndex)
        }
        if (this.parents.length < 1) {
          this.parents.push(this.currentParent)
        }
        this.parents.push(item)
      }

      this.currentParent = item

      const resp = await this.$apollo.query({
        query: gql`
          query ($parent: Int, $locale: String!) {
            pages {
              tree(parent: $parent, mode: ALL, locale: $locale) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          parent: item.id,
          locale: this.locale
        }
      })
      this.loadedCache = _.union(this.loadedCache, [item.id])
      this.currentItems = _.get(resp, 'data.pages.tree', [])
      this.$store.commit(`loadingStop`, 'browse-load')
    },
    async fetchTreeChildren (parentId) {
      const resp = await this.$apollo.query({
        query: gql`
          query ($parent: Int, $locale: String!) {
            pages {
              tree(parent: $parent, mode: ALL, locale: $locale) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
              }
            }
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          parent: parentId,
          locale: this.locale
        }
      })
      return _.filter(_.get(resp, 'data.pages.tree', []), item => item.path !== 'home')
    },
    async buildTreeBranch (parentId = 0, depth = 0) {
      const items = await this.fetchTreeChildren(parentId)
      const branches = []
      for (const item of items) {
        const branch = {
          ...item,
          depth,
          children: []
        }
        if (item.isFolder) {
          branch.children = await this.buildTreeBranch(item.id, depth + 1)
        }
        branches.push(branch)
      }
      return branches
    },
    async loadFullTree () {
      this.$store.commit(`loadingStart`, 'browse-load')
      try {
        this.treeItems = await this.buildTreeBranch()
        this.expandCurrentPath()
      } finally {
        this.$store.commit(`loadingStop`, 'browse-load')
      }
    },
    flattenTree (items, query = '') {
      return _.flatMap(items, item => {
        const titleMatch = _.includes(_.toLower(item.title), query)
        const pathMatch = _.includes(_.toLower(item.path), query)
        const childItems = this.flattenTree(item.children || [], query)
        const isSearching = query.length > 0
        const shouldShowItem = !isSearching || titleMatch || pathMatch || childItems.length > 0
        if (!shouldShowItem) {
          return []
        }
        const visibleItem = {
          ...item,
          depth: item.depth || 0
        }
        if (isSearching || this.isFolderExpanded(item)) {
          return [visibleItem, ...childItems]
        }
        return [visibleItem]
      })
    },
    expandCurrentPath () {
      const walk = items => {
        for (const item of items) {
          const isCurrent = item.path === this.path
          const childHasCurrent = walk(item.children || [])
          if (item.isFolder && (childHasCurrent || (this.path && _.startsWith(this.path, `${item.path}/`)))) {
            this.$set(this.expandedFolders, item.id, true)
          }
          if (item.isFolder && item.depth === 0) {
            this.$set(this.expandedFolders, item.id, true)
          }
          if (isCurrent || childHasCurrent) {
            return true
          }
        }
        return false
      }
      walk(this.treeItems)
    },
    toggleFolder (item) {
      this.$set(this.expandedFolders, item.id, !this.isFolderExpanded(item))
    },
    isFolderExpanded (item) {
      return this.normalizedSidebarFilter.length > 0 || this.expandedFolders[item.id] === true
    },
    isFolderInCurrentPath (item) {
      return this.path && item.path && _.startsWith(this.path, `${item.path}/`)
    },
    treeRowStyle (depth = 0) {
      return {
        paddingLeft: `${10 + (depth * 17)}px`,
        '--reader-tree-indent': `${10 + (depth * 17)}px`
      }
    },
    async loadFromCurrentPath() {
      return this.loadFullTree()
    },
    goHome () {
      window.location.assign(siteLangs.length > 0 ? `/${this.locale}/home` : '/')
    },
    goSettings () {
      window.location.assign('/a/general')
    },
    goHistory () {
      window.location.assign(`/h/${this.locale}/${this.path || 'home'}`)
    },
    goAccount () {
      window.location.assign('/p/profile')
    },
    pageNew () {
      window.location.assign(`/e/${this.locale}/new-page`)
    },
    isHomeItem (item) {
      return item && item.k === 'link' && (item.t === '/' || _.endsWith(item.t, '/home') || item.l === '首页' || _.toLower(item.l) === 'home')
    }
  },
  mounted () {
    this.currentParent.title = `/ ${this.$t('common:sidebar.root')}`
    this.currentMode = 'browse'
    this.loadFullTree()
  }
}
</script>
