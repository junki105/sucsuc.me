<template>
  <div class="max-w-4xl mx-auto">
    <div class="w-full flex flex-wrap py-4">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="w-full border-b lg:border-b-none lg:p-2"
      >
        <product-card :product="product">
          <template v-slot:header>
            <nuxt-link
              :to="`/user/${product.author._id}`"
              class="flex items-center mb-2"
            >
              <profile-icon
                :src="product.author.profileImage"
                :alt="product.author.name"
                class="h-6 w-6"
              />
              <p
                class="ml-2 font-semibold text-xs text-gray-800"
                v-text="product.author.name"
              />
            </nuxt-link>
          </template>
        </product-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Context } from '@nuxt/types'
import ProductCard from '@/components/molecules/ProductCard.vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import { Breadcrumb } from '../../../../core/entities/Breadcrumb'
import { Product } from '../../../../core/entities/Product'
import { Hashtag } from '../../../../core/entities/Hashtag'

interface DataType {
  tag: Hashtag
  products: Product[]
}

interface MethodType {}
interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    ProductCard,
    ProfileIcon,
  },
  validate(context: Context): boolean {
    const slug = context.params.slug
    const hashtags = context.store.getters['hashtag/hashtags'] || []
    return hashtags.find((h: Hashtag) => h.value === slug)
  },
  asyncData(context: Context): DataType {
    let data = null
    if (context.payload) {
      data = context.payload as { tag: Hashtag; products: Product[] }
    } else {
      const slug = context.params.slug
      const hashtags = context.store.getters['hashtag/hashtags'] || []
      const tag = hashtags.find((h: Hashtag) => h.value === slug)
      const products = context.store.getters[
        'product/products'
      ].filter((p: Product) =>
        (p.hashtags as Hashtag[])
          .map((h: Hashtag) => h.value)
          .includes(tag.value)
      )
      data = { tag, products }
    }
    context.store.dispatch('setPageInfo', {
      title: data.tag.label,
      description: `${data.tag.label}に関する投稿を表示します`,
      breadcrumbs: [
        {
          to: '/',
          icon: ['fas', 'laptop-code'],
          color: 'text-gray-100',
        } as Breadcrumb,
        { name: data.tag.label, color: 'text-gray-100' } as Breadcrumb,
      ],
    })

    return {
      ...data,
    }
  },
  data(): DataType {
    return {
      tag: {} as Hashtag,
      products: [] as Product[],
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title: this.tag.label,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.tag.label}に関する投稿を表示します`,
        },
      ],
    }
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
