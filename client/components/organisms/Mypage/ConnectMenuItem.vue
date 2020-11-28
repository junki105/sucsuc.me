<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="goToStripeConnect"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'key']" />
      </span>
      本人確認（Stripe連携）
      <sup class="text-xs">
        <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
      </sup>
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface DataType {}

interface MethodType {
  goToStripeConnect(event: Event): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  methods: {
    async goToStripeConnect(event: Event): Promise<void> {
      event.preventDefault()
      let url = null
      this.$nuxt.$loading.start()
      try {
        const token = await this.$store.dispatch('auth/refresh')
        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        url = await this.$axios.$post('/.netlify/functions/connect_sessions')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      if (url) {
        location.href = url
      } else {
        alert('本人確認ページに遷移することができません')
      }
      this.$nuxt.$loading.finish()
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
