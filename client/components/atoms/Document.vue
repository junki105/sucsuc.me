<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="doc-content lg:doc-content" v-html="html" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    html: {
      type: String,
      required: true,
      default: '',
    },
  },
})
</script>

<style lang="postcss">
.doc-content h2 {
  @apply mt-10 mb-2 font-bold text-xl;
}
.doc-content p {
  @apply leading-6 mb-4;
}
.doc-content ol {
  @apply leading-6 list-decimal pl-5 mb-4;
}
.doc-content ul {
  @apply leading-6 list-disc pl-5 mb-4;
}
.doc-content a {
  @apply text-blue-500;
}
@screen lg {
  .doc-content h2 {
    @apply text-2xl;
  }
}
</style>
