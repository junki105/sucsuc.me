<template>
  <div class="breadcrumb-nav">
    <nav>
      <ol class="breadcrumb">
        <li v-for="breadcrumb in breadcrumbs" :key="breadcrumb.name">
          <nuxt-link
            v-if="breadcrumb.to"
            :to="breadcrumb.to"
            :class="[breadcrumb.color]"
          >
            <font-awesome-icon v-if="breadcrumb.icon" :icon="breadcrumb.icon" />
            <span v-if="breadcrumb.name">{{ breadcrumb.name }}</span>
          </nuxt-link>
          <span v-else>
            <font-awesome-icon v-if="breadcrumb.icon" :icon="breadcrumb.icon" />
            <span v-if="breadcrumb.name">{{ breadcrumb.name }}</span>
          </span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Breadcrumb } from '../../../core/entities/Breadcrumb'

export default Vue.extend({
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      default: () => [],
    } as PropOptions<Breadcrumb[]>,
  },
})
</script>

<style scoped lang="postcss">
.breadcrumb-nav {
  @apply w-full;
}
.container {
  @apply mx-auto h-full;
}
.breadcrumb {
  @apply whitespace-no-wrap overflow-x-auto flex text-gray-600 px-4 py-2;
}
.breadcrumb::-webkit-scrollbar {
  @apply hidden;
}
.breadcrumb > li {
  @apply flex items-center;
}
.breadcrumb > li + li:before {
  content: '\0227B';
  @apply mx-2;
}
.breadcrumb > li a {
  @apply no-underline;
}
.breadcrumb > li span {
  @apply text-white;
}
</style>
