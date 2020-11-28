<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="onLogout"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'sign-out-alt']" />
      </span>
      ログアウト
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface DataType {}

interface MethodType {
  onLogout(event: Event): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  methods: {
    onLogout(): void {
      this.$store.dispatch('auth/logout')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
