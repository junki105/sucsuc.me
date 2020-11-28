<template>
  <div
    v-if="message"
    class="px-4 py-3 rounded relative"
    role="alert"
    :class="[`alert-${type}`]"
  >
    <strong class="font-bold uppercase">{{ type }}!</strong>
    <span class="block text-sm sm:inline md:text-base" v-text="message" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface DataType {}
interface MethodType {}
interface ComputedType {}
interface PropType {
  type: String
  message: String
}

const types = ['success', 'info', 'warning', 'danger']

export default Vue.extend({
  props: {
    type: {
      type: String,
      required: false,
      default: 'info',
      validator: (value: string) => types.includes(value),
    },
    message: {
      type: String,
      required: true,
      default: '',
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>

<style scoped lang="postcss">
.alert-success {
  @apply bg-green-100 border border-green-400 text-green-700;
}
.alert-info {
  @apply bg-blue-100 border border-blue-400 text-blue-700;
}
.alert-warning {
  @apply bg-yellow-100 border border-yellow-400 text-yellow-700;
}
.alert-danger {
  @apply bg-red-100 border border-red-400 text-red-700;
}
</style>
