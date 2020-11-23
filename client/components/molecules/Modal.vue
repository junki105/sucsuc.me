<template>
  <transition v-if="open" name="modal">
    <div
      class="z-20 fixed w-full h-full top-0 left-0 flex items-center justify-center"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        @click.prevent="hide"
      />
      <div
        class="absolute cursor-pointer top-0 right-0 mr-4 mt-4 z-50 hover:opacity-75"
        @click.prevent="hide"
      >
        <div
          class="flex items-center justify-center rounded-full h-10 w-10 bg-gray-800 text-white"
        >
          <font-awesome-icon :icon="['fas', 'times']" size="lg" />
        </div>
      </div>
      <div
        class="bg-white w-full mx-auto rounded shadow-lg z-40"
        :class="[modalSize]"
      >
        <div
          class="min-h-screen lg:min-h-0 max-h-screen flex flex-col px-2 py-20 text-left lg:px-6 lg:py-8"
        >
          <div
            v-show="title"
            class="flex justify-center items-center border-b-2 pb-3"
          >
            <slot name="header">
              <p class="text-2xl font-bold">{{ title }}</p>
            </slot>
          </div>

          <div class="flex flex-grow overflow-y-auto">
            <div class="w-full">
              <slot />
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 right-0 mr-4 mb-4 flex justify-end pt-2 z-50"
      >
        <button
          v-if="actionText"
          class="inline-flex items-center bg-orange-500 rounded font-bold text-white text-md px-8 py-2 mr-2 hover:shadow-xl lg:mr-4 lg:text-xl lg:px-10 lg:py-2"
          @click="handleActionModal"
        >
          {{ actionText }}
        </button>
        <button
          class="inline-flex items-center bg-black rounded font-bold text-white text-md px-8 py-2 mr-2 hover:shadow-xl lg:text-xl lg:px-10 lg:py-2"
          @click="hide"
        >
          {{ closeText }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    } as PropOptions<String>,
    size: {
      type: String,
      required: false,
      default: 'md',
    } as PropOptions<String>,
    actionText: {
      type: String,
      required: false,
      default: '',
    } as PropOptions<String>,
    closeText: {
      type: String,
      required: true,
      default: 'Close',
    } as PropOptions<String>,
    handleActionModal: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
    handleCloseModal: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    modalSize(): String {
      return this.size === 'md' ? 'lg:max-w-3xl' : 'lg:max-w-3xl'
    },
  },
  methods: {
    show() {
      this.open = true
      document.body.classList.add('overflow-hidden')
    },
    hide() {
      this.open = false
      if (this.handleCloseModal) {
        this.handleCloseModal()
      }
      document.body.classList.remove('overflow-hidden')
    },
  },
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
