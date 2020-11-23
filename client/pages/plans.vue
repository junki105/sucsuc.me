<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row">
      <div class="w-full flex flex-wrap py-4 md:w-9/12 md:px-4">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="w-full md:pb-2 md:px-2"
        >
          <product-card :product="product" class="border-b">
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
      <div class="w-full md:w-3/12 py-4">
        <div class="bg-gray-100 p-4">
          <p class="font-bold text-xl">Tags</p>
          <div class="border-b my-2" />
          <ul>
            <li
              v-for="(hashtag, index) in hashtags"
              :key="index"
              class="font-bold text-gray-800 my-1"
            >
              <hashtag
                tag-name="nuxt-link"
                :to="`/tag/${hashtag.value}`"
                class="mr-2"
              >
                <div class="flex items-center justify-center mr-2">
                  <img v-if="hashtag.icon" :src="hashtag.icon" class="h-3" />
                  <font-awesome-icon v-else :icon="['fas', 'tag']" />
                </div>
                {{ hashtag.label }}
              </hashtag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import Hashtag from '@/components/atoms/Hashtag.vue'
import ProductCard from '@/components/molecules/ProductCard.vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import { Hashtag as HashtagData } from '../../core/entities/Hashtag'
import { Product } from '../../core/entities/Product'
import { Breadcrumb } from '../../core/entities/Breadcrumb'

const title = 'みんなのプラン'
const description = 'あなたの課題や問題を解決するプランを探しましょう'

export default Vue.extend({
  components: {
    Hashtag,
    ProductCard,
    ProfileIcon,
  },
  asyncData(context: Context): { products: Product[] } {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: title, color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', { title, description, breadcrumbs })
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
    hashtags(): HashtagData[] {
      return this.$store.getters['hashtag/hashtags']
    },
  },
})
</script>
