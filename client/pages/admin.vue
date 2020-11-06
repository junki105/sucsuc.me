<template>
  <span />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  layout: 'admin',
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  mounted() {
    if (
      !this.user ||
      !this.user.app_metadata.roles ||
      !this.user.app_metadata.roles.includes('Mentor')
    ) {
      this.$router.push('/')
      return
    }

    const CMS = require('netlify-cms-app')
    const { ja } = require('netlify-cms-locales')
    const { UuidControl, UuidPreview } = require('netlify-cms-widget-uuid')
    CMS.registerLocale('ja', ja)
    CMS.registerWidget('uuid', UuidControl, UuidPreview)
    CMS.init()
  },
  head() {
    return {
      script: [
        {
          src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
        },
      ],
    }
  },
})
</script>
