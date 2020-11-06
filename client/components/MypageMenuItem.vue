<template>
  <component
    :is="tagName"
    :to="to"
    :href="href"
    class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
    @click="$emit('click', $event)"
  >
    <span
      class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
    >
      <font-awesome-icon v-if="icon" :icon="[`fas`, icon]" />
    </span>
    {{ label }}
    <sup v-if="external" class="text-xs">
      <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
    </sup>
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
    href: { type: String, required: false, default: null } as PropOptions<
      String
    >,
    icon: { type: String, required: false, default: null } as PropOptions<
      String
    >,
    label: { type: String, required: false, default: null } as PropOptions<
      String
    >,
    external: { type: Boolean, required: false, default: false } as PropOptions<
      Boolean
    >,
  },
})
</script>
