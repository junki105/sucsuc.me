<template>
  <div clas="w-full">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row"></div>
    </div>
    <home-pickup-product-section :products="pickupProducts" />
    <home-faq-section />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import HomeFaqSection from '@/components/organisms/Home/HomeFaqSection.vue'
import HomePickupProductSection from '@/components/organisms/Home/HomePickupProductSection.vue'
import { Product } from '../../core/entities/Product'
import { shuffle } from '../../core/utils/array'

const title = 'ユーザー同士が課題解決し成長し合えるコミュニティ「SUCSUC」'
const description =
  'あなたの課題や問題を解決し成長というゴールに導くスクスク（SUCSUC）を探しましょう'

export default Vue.extend({
  components: {
    HomeFaqSection,
    HomePickupProductSection,
  },
  asyncData(context: Context): { products: Product[] } {
    context.store.dispatch('setPageInfo', { title, description })
    return {
      products: context.store.getters['product/products'],
    }
  },
  data(): { products: Product[] } {
    return {
      products: [],
    }
  },
  computed: {
    pickupProducts(): Product[] {
      const array = shuffle(this.products)
      return array.length > 2 ? shuffle(this.products).slice(2) : array
    },
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
      ],
    }
  },
})
</script>
