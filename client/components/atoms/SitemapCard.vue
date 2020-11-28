<template>
  <component
    :is="tagName"
    :to="to"
    class="bg-white border-b p-2 flex items-center lg:border"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    tagName: {
      type: String,
      required: false,
      default: 'nuxt-link',
    } as PropOptions<String>,
    to: { type: String, required: false, default: null } as PropOptions<String>,
  },
})
</script>
