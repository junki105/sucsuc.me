<template>
  <img
    :src="url"
    :alt="alt"
    class="block rounded-full"
    @error="setFallbackImageUrl()"
  />
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    src: { type: String, required: false, default: null } as PropOptions<
      String
    >,
    alt: { type: String, required: false, default: '' } as PropOptions<String>,
  },
  data() {
    return {
      url: this.src || require('~/assets/img/noimage.jpg'),
    }
  },
  methods: {
    setFallbackImageUrl(): void {
      this.url = require('~/assets/img/noimage.jpg')
    },
  },
})
</script>
