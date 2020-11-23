<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row">
      <div class="w-full py-4 md:px-4">
        <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
          <li class="-mb-px md:mr-2 last:mr-0 flex-auto text-center">
            <a
              class="text-xs font-bold uppercase px-5 py-3 shadow-lg border-r md:border-none md:rounded block leading-normal"
              :class="{
                'text-brand bg-white': openTab !== 1,
                'text-white bg-brand': openTab === 1,
              }"
              @click.prevent="toggleTabs(1)"
            >
              Profile
            </a>
          </li>
          <li class="-mb-px md:mr-2 last:mr-0 flex-auto text-center">
            <a
              class="text-xs font-bold uppercase px-5 py-3 shadow-lg border-r md:border-none md:rounded block leading-normal"
              :class="{
                'text-brand bg-white': openTab !== 2,
                'text-white bg-brand': openTab === 2,
              }"
              @click.prevent="toggleTabs(2)"
            >
              Plan
            </a>
          </li>
        </ul>
        <div class="w-full mb-6">
          <div class="tab-content tab-space">
            <div :class="{ hidden: openTab !== 1, block: openTab === 1 }">
              <div class="bg-white shadow-md rounded-lg p-4 mb-6">
                <div>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="app-markdown" v-html="$md.render(author.body)" />
                </div>
              </div>
            </div>
            <div :class="{ hidden: openTab !== 2, block: openTab === 2 }">
              <div
                v-for="(product, index) in products"
                :key="index"
                class="w-full md:pb-2 md:px-2"
              >
                <product-card :product="product" class="border-b" />
              </div>
            </div>
            <div :class="{ hidden: openTab !== 3, block: openTab === 3 }"></div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-5/12 py-4">
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
  openTab: number
  url: string
  shareText: string
  author: Profile
  products: Product[]
}

interface MethodType {
  toggleTabs(tab: number): void
}

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
      data = context.payload as { author: Profile; products: Product[] }
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
      openTab: 1,
      url: '',
      shareText: '',
      ...data,
    }
  },
  data(): DataType {
    return {
      openTab: 1,
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
  mounted() {
    const route = this.$route as any
    if (route.query && route.query.t && parseInt(route.query.t) === 2) {
      this.openTab = parseInt(route.query.t)
    }
  },
  methods: {
    toggleTabs(tab: number): void {
      this.openTab = tab
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
