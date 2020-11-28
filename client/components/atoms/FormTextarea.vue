<template>
  <div>
    <textarea
      ref="textarea"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      :class="{ 'border-red-500': errors.length > 0 }"
      @input="updateInput"
    />
    <p
      v-if="errors.length > 0"
      class="text-red-500 text-xs italic"
      v-text="errors[0]"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface DataType {}
interface MethodType {
  updateInput(event: InputEvent): void
  resize(): void
}
interface ComputedType {}
interface PropType {
  value: string
  placeholder: string
  disabled: boolean
  errors: String[]
}

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    } as PropOptions<string>,
    placeholder: {
      type: String,
      required: false,
      default: '',
    } as PropOptions<string>,
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    } as PropOptions<boolean>,
    errors: {
      type: Array,
      required: false,
      default: () => [],
    } as PropOptions<String[]>,
  },
  async mounted() {
    await this.$nextTick()
    this.resize()
  },
  methods: {
    updateInput(event: InputEvent): void {
      this.$emit('input', (event.target as HTMLInputElement).value)
      this.resize()
    },
    resize(): void {
      const textarea = (this.$refs as any).textarea
      new Promise((resolve) => {
        resolve((textarea.style.height = 'auto'))
      }).then(() => {
        textarea.style.height = textarea.scrollHeight + 'px'
      })
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
