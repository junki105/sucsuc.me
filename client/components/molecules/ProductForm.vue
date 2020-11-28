<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }">
    <form
      method="post"
      class="pt-6 pb-8"
      @submit.prevent="handleSubmit($event, form)"
    >
      <div class="flex flex-wrap mb-6">
        <div class="w-full px-3 mb-2">
          <input-label for-input="title"> タイトル </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, max: 40, min: 8 }"
            name="タイトル"
          >
            <input
              v-model="form.title"
              type="text"
              placeholder="タイトル"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="w-full px-3 mb-2">
          <input-label for-input="description"> 説明 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, max: 80, min: 10 }"
            name="説明"
          >
            <input
              v-model="form.description"
              type="text"
              placeholder="説明"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="w-full px-3 mb-2">
          <input-label for-input="body"> 内容 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, max: 3000, min: 40 }"
            name="内容"
          >
            <form-textarea v-model="form.body" :errors="errors" />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="hashtag" :required="false">
            タグ
          </input-label>
          <multiselect
            v-model="form.hashtags"
            :options="hashtags"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="選択して下さい"
            label="label"
            track-by="label"
            :preselect-first="false"
          />
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="price"> 金額 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, regex: /^[0-9]*$/ }"
            name="金額"
          >
            <input
              v-model="form.price"
              type="number"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="interval"> 課金サイクル </input-label>
          <select
            v-model="form.interval"
            class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
          >
            <option
              v-for="(item, index) in intervalOptions"
              :key="index"
              :value="item.value"
              v-text="item.label"
            />
          </select>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="status"> ステータス </input-label>
          <select
            v-model="form.status"
            class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
          >
            <option
              v-for="(item, index) in statusOptions"
              :key="index"
              :value="item.value"
              v-text="item.label"
            />
          </select>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-yellow-500 text-lg text-white font-bold py-4 px-8 border-b-4 border-yellow-600 rounded-full"
          :class="{ 'opacity-75 cursor-not-allowed': invalid }"
          :disabled="invalid"
        >
          保存する
        </button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

import InputLabel from '@/components/atoms/InputLabel.vue'
import FormTextarea from '@/components/atoms/FormTextarea.vue'
import Multiselect from 'vue-multiselect'

import { Hashtag } from '../../../core/entities/Hashtag'
import {
  Product,
  intervalOptions,
  statusOptions,
} from '../../../core/entities/Product'

interface DataType {
  intervalOptions: Array<{ label: string; value: string }>
  statusOptions: Array<{ label: string; value: string }>
  form: Product
}
interface MethodType {}
interface ComputedType {}
interface PropType {
  hashtags: Hashtag[]
  product: Product | null
  handleSubmit: Function
}

export default Vue.extend({
  components: {
    InputLabel,
    FormTextarea,
    Multiselect,
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: null,
    } as PropOptions<Product>,
    hashtags: {
      type: Array,
      required: true,
      default: null,
    } as PropOptions<Hashtag[]>,
    handleSubmit: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
  },
  data() {
    return {
      intervalOptions,
      statusOptions,
      form: { ...this.product } as Product,
    }
  },
  watch: {
    product(val) {
      this.form = { ...val } as Product
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
