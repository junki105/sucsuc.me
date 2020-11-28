<template>
  <component
    :is="tagName"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
    class="inline-flex items-center bg-gray-300 rounded-full font-bold text-gray-800 text-xs px-4 py-1 hover:shadow-xl"
    @click.prevent="onClick"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    tagName: {
      type: String,
      required: false,
      default: 'span',
    },
    to: {
      type: String,
      required: false,
      default: null,
    },
    href: {
      type: String,
      required: false,
      default: null,
    },
    target: {
      type: String,
      required: false,
      default: null,
    },
    rel: {
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    onClick(): void {
      this.$emit('click')
    },
  },
})
</script>
