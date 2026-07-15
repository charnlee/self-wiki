<template lang="pug">
  svg.reader-icon(
    :width='size'
    :height='size'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    aria-hidden='true'
    focusable='false'
    )
    template(v-if='name === `archive`')
      rect(x='3', y='4', width='18', height='4', rx='1')
      path(d='M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8')
      path(d='M10 12h4')
    template(v-else-if='name === `chevron-down`')
      path(d='m6 9 6 6 6-6')
    template(v-else-if='name === `clock`')
      circle(cx='12', cy='12', r='9')
      path(d='M12 7v5l3 2')
    template(v-else-if='name === `compass`')
      circle(cx='12', cy='12', r='9')
      path(d='m15 9-2 6-6 2 2-6 6-2z')
    template(v-else-if='name === `edit-3`')
      path(d='M12 20h9')
      path(d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z')
    template(v-else-if='name === `file-text`')
      path(d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z')
      path(d='M14 2v6h6')
      path(d='M8 13h8')
      path(d='M8 17h5')
    template(v-else-if='name === `folder-open`')
      path(d='M6 17h12l3-8H8l-2 8Z')
      path(d='M3 17V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v1')
    template(v-else-if='name === `folder`')
      path(d='M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z')
    template(v-else-if='name === `history`')
      path(d='M3 12a9 9 0 1 0 3-6.7')
      path(d='M3 3v6h6')
      path(d='M12 7v5l4 2')
    template(v-else-if='name === `home`')
      path(d='M3 10.5 12 3l9 7.5')
      path(d='M5 10v10h14V10')
      path(d='M9 20v-6h6v6')
    template(v-else-if='name === `message-square`')
      path(d='M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z')
    template(v-else-if='name === `plus`')
      path(d='M12 5v14')
      path(d='M5 12h14')
    template(v-else-if='name === `search`')
      circle(cx='11', cy='11', r='8')
      path(d='m21 21-4.3-4.3')
    template(v-else-if='name === `settings`')
      path(d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z')
      path(d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 1 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z')
    template(v-else-if='name === `share-2`')
      circle(cx='18', cy='5', r='3')
      circle(cx='6', cy='12', r='3')
      circle(cx='18', cy='19', r='3')
      path(d='m8.6 13.5 6.8 4')
      path(d='m15.4 6.5-6.8 4')
    template(v-else-if='name === `sparkles`')
      path(d='m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z')
      path(d='M5 3v4')
      path(d='M3 5h4')
      path(d='M19 17v4')
      path(d='M17 19h4')
    template(v-else-if='name === `tag`')
      path(d='M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z')
      circle(cx='7.5', cy='7.5', r='.5')
    template(v-else-if='name === `user`')
      path(d='M20 21a8 8 0 0 0-16 0')
      circle(cx='12', cy='7', r='4')
    template(v-else)
      circle(cx='12', cy='12', r='9')
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'file-text'
    },
    size: {
      type: [Number, String],
      default: 18
    }
  }
}
</script>
