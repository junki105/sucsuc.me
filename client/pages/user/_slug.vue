<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row">
      <div class="w-full md:w-5/12 py-4">
        <div class="bg-gray-100 p-4 mb-4">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            class="app-markdown text-sm mb-2"
            v-html="$md.render(author.body)"
          />
          <div
            v-if="author.categories.length > 0"
            class="flex items-center text-xs mb-2"
          >
            <div class="text-gray-600 mr-2">
              <font-awesome-icon :icon="['fas', 'briefcase']" />
            </div>
            <ul class="flex items-center">
              <li
                v-for="category in author.categories"
                :key="category.value"
                class="mr-1"
                v-text="category.label"
              />
            </ul>
          </div>
          <div class="flex">
            <a
              v-if="author.twitter"
              :href="`https://twitter.com/${author.twitter}`"
              target="_blank"
              rel="noopener noreferrer"
              class="mr-2 hover:opacity-75"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" size="lg" />
            </a>
            <a
              v-if="author.facebook"
              :href="`https://www.facebook.com/${author.facebook}`"
              target="_blank"
              rel="noopener noreferrer"
              class="mr-2 hover:opacity-75"
            >
              <font-awesome-icon :icon="['fab', 'facebook']" size="lg" />
            </a>
            <a
              v-if="author.instagram"
              :href="`https://www.instagram.com/${author.instagram}`"
              target="_blank"
              rel="noopener noreferrer"
              class="mr-2 hover:opacity-75"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" size="lg" />
            </a>
            <a
              v-if="author.github"
              :href="`https://github.com/${author.github}`"
              target="_blank"
              rel="noopener noreferrer"
              class="mr-2 hover:opacity-75"
            >
              <font-awesome-icon :icon="['fab', 'github']" size="lg" />
            </a>
            <a
              v-if="author.website"
              :href="author.website"
              target="_blank"
              rel="noopener noreferrer"
              class="mr-2 hover:opacity-75"
            >
              <font-awesome-icon :icon="['fas', 'link']" size="lg" />
            </a>
          </div>
        </div>

        <div class="bg-gray-100 p-4 mb-4">
          <p class="font-bold text-xl mb-2">Share</p>
          <div class="flex">
            <a
              :href="`https://twitter.com/intent/tweet?url=${url}&text=${shareText}`"
              class="inline-block w-1/2 p-2 bg-twitter rounded text-white text-center mr-1 hover:opacity-75"
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a
              :href="`https://www.facebook.com/share.php?u=${url}`"
              class="inline-block w-1/2 p-2 bg-facebook rounded text-white text-center ml-1 hover:opacity-75"
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'facebook']" />
            </a>
          </div>
        </div>
      </div>
      <div class="w-full py-4 md:px-4">
        <div class="w-full mb-6">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="w-full md:pb-2 md:px-2"
          >
            <product-card :product="product" class="border-b" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="author.email"
      class="fixed right-0 bottom-0 mr-6 mb-32 lg:mr-10 lg:mb-10"
    >
      <a
        :href="`mailto:${author.email}`"
        class="rounded-full bg-black text-white px-6 py-4 hover:opacity-75"
      >
        <span class="mr-2">
          <font-awesome-icon :icon="['fas', 'envelope']" />
        </span>
        CONTACT
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Context } from '@nuxt/types'
import ProductCard from '@/components/molecules/ProductCard.vue'
import { Profile } from '../../../core/entities/Profile'
import { Breadcrumb } from '../../../core/entities/Breadcrumb'
import { Product } from '../../../core/entities/Product'

interface DataType {
  url: string
  shareText: string
  author: Profile
  products: Product[]
}

interface MethodType {}
interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    ProductCard,
  },
  watchQuery: ['t'],
  validate(context: Context): boolean {
    const slug = context.params.slug
    const authors = context.store.getters['author/authors'] || []
    return authors.find((a: Profile) => (a._id as Number).toString() === slug)
  },
  asyncData(context: Context): DataType {
    let data = null
    if (context.payload) {
      const { author } = context.payload as { author: Profile }
      const products = author.products
      data = { author, products }
    } else {
      const slug = context.params.slug
      const authors = context.store.getters['author/authors'] || []
      const author = authors.find(
        (a: Profile) => (a._id as Number).toString() === slug
      )
      const products = author.products
      data = { author, products }
    }
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: data.author.name, color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', {
      title: data.author.name,
      description: `@${data.author.username}`,
      image: data.author.profileImage,
      breadcrumbs,
    })
    return {
      url: '',
      shareText: '',
      ...data,
    }
  },
  data(): DataType {
    return {
      url: `${process.env.baseUrl}${this.$nuxt.$route.path}`,
      shareText: '',
      author: {} as Profile,
      products: [] as Product[],
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title: this.author.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.author.name}に関するページを表示します`,
        },
      ],
    }
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
