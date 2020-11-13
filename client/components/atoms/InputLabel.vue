<template>
  <label
    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
    :for="forInput"
  >
    <slot />
    <sup v-show="required" class="text-red-500"> * </sup>
  </label>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface DataType {}
interface MethodType {}
interface ComputedType {}
interface PropType {
  forInput: String
  required: boolean
}

export default Vue.extend({
  props: {
    forInput: {
      type: String,
      required: true,
      default: '',
    } as PropOptions<string>,
    required: {
      type: Boolean,
      required: false,
      default: true,
    } as PropOptions<boolean>,
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
