<template>
  <div class="py-10">
    <div class="max-w-6xl mx-auto px-2">
      <h2
        class="flex justify-center items-center font-semibold text-center text-xl text-gray-800 lg:text-3xl"
      >
        <img
          src="~/assets/img/icons/lightbulb-32x32.png"
          alt="ピックアップ"
          class="mr-2"
        />
        ピックアップ
      </h2>
      <p class="text-center text-xs text-gray-700 lg:text-sm">
        お気に入りのプランを見つけよう！
      </p>
      <div class="flex flex-wrap mt-10">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="flex w-full lg:w-1/2 mb-4"
          :class="{ 'pr-2': index % 2 == 0, 'pl-2': index % 2 == 1 }"
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
      <div class="w-full max-w-lg mx-auto flex justify-center my-6">
        <nuxt-link
          to="/search"
          class="px-8 py-3 bg-brand text-white text-2xl shadow-xl rounded-full hover:opacity-75"
        >
          <font-awesome-icon :icon="['fas', 'search']" class="mr-1" />
          プランを探す
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import ProductCard from '@/components/molecules/ProductCard.vue'
import { Product } from '../../../../core/entities/Product'

export default Vue.extend({
  components: {
    ProfileIcon,
    ProductCard,
  },
  props: {
    products: {
      type: Array,
      required: true,
      default: () => [],
    } as PropOptions<Product[]>,
  },
})
</script>
