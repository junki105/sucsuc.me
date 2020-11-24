<template>
  <div class="mt-6">
    <accordion-card
      v-for="(item, index) in products"
      :key="index"
      :title="(item.copy ? `複製プラン` : item.title) || `新規プラン`"
      class="mb-2"
    >
      <template v-slot:header-right>
        <a
          v-show="(hasNew || hasCopy) && !item._id"
          href="#"
          class="bg-red-500 text-white text-xs rounded-full px-4 py-1 hover:opacity-75"
          @click.stop="handleDelete(index, item)"
        >
          <font-awesome-icon :icon="[`fas`, `trash`]" />
          <span class="hidden md:inline-block">Delete</span>
        </a>
        <a
          v-show="!hasNew && !hasCopy && !!item._id"
          href="#"
          class="bg-orange-500 text-white text-xs rounded-full px-4 py-1 hover:opacity-75"
          @click.stop="handleCopy(item)"
        >
          <font-awesome-icon :icon="[`fas`, `copy`]" />
          <span class="hidden md:inline-block">Copy</span>
        </a>
      </template>
      <product-form
        :product="item"
        :hashtags="hashtags"
        :handle-submit="handleSubmit"
      />
    </accordion-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import AccordionCard from '@/components/molecules/AccordionCard.vue'
import ProductForm from '@/components/molecules/ProductForm.vue'
import { Product } from '../../../../core/entities/Product'
import { Hashtag } from '../../../../core/entities/Hashtag'

interface DataType {}
interface MethodType {}
interface ComputedType {
  hasNew: boolean
  hasCopy: boolean
  hashtags: Hashtag[]
}
interface PropType {
  products: Product[]
  handleSubmit: Function
}

export default Vue.extend({
  components: {
    AccordionCard,
    ProductForm,
  },
  props: {
    products: {
      type: Array,
      required: true,
      default: null,
    } as PropOptions<Product[]>,
    handleSubmit: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
    handleCopy: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
    handleDelete: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
  },
  computed: {
    hasNew(): boolean {
      return this.products.filter((p: Product) => !p._id).length > 0
    },
    hasCopy(): boolean {
      return this.products.filter((p: Product) => p.copy).length > 0
    },
    hashtags(): Hashtag[] {
      return this.$store.getters['hashtag/hashtags']
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
