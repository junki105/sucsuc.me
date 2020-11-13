<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="goToBillingPortal"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'money-check']" />
      </span>
      定期決済を確認する
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
  goToBillingPortal(event: Event): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  methods: {
    async goToBillingPortal(event: Event): Promise<void> {
      event.preventDefault()

      this.$nuxt.$loading.start()
      let url = null
      try {
        const token = await this.$store.dispatch('auth/refresh')
        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        url = await this.$axios.$post('/.netlify/functions/create_manage_link')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      if (url) {
        location.href = url
      } else {
        alert('定期決済の購入がない為、画面を表示することができませんでした')
      }
      this.$nuxt.$loading.finish()
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
