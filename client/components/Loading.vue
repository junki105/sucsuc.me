<template>
  <transition v-if="open" name="loading">
    <div
      class="z-40 fixed w-full h-full top-0 left-0 flex items-center justify-center"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-white opacity-50"
        @click.prevent="hide"
      />
      <div class="w-full mx-auto text-center z-50">
        <font-awesome-icon :icon="['fas', 'spinner']" size="6x" spin />
        <div class="mt-4">Loading...</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      open: false,
    }
  },
  methods: {
    start() {
      this.open = true
      document.body.classList.add('overflow-hidden')
    },
    finish() {
      this.open = false
      document.body.classList.remove('overflow-hidden')
    },
  },
})
</script>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.5s;
}
.loading-enter,
.loading-leave-to {
  opacity: 0;
}
</style>
