<template>
  <div class="max-w-4xl mx-auto py-4">
    <div class="flex flex-wrap border-t lg:border-none">
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `home`]" />
          </span>
          <span class="font-semibold text-sm"> HOME </span>
        </sitemap-card>
      </div>
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/search" class="border-l-none">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `search`]" />
          </span>
          <span class="font-semibold text-sm"> 検索 </span>
        </sitemap-card>
      </div>
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/plans" class="border-l-none">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `seedling`]" />
          </span>
          <span class="font-semibold text-sm"> みんなのプラン </span>
        </sitemap-card>
      </div>
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/contact" class="border-l-none">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `envelope`]" />
          </span>
          <span class="font-semibold text-sm"> 問い合わせ </span>
        </sitemap-card>
      </div>
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/terms" class="border-l-none">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `file`]" />
          </span>
          <span class="font-semibold text-sm"> 利用規約 </span>
        </sitemap-card>
      </div>
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/privacy/policy" class="border-l-none">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `file`]" />
          </span>
          <span class="font-semibold text-sm"> プライバシーポリシー </span>
        </sitemap-card>
      </div>
      <div class="w-full lg:w-1/2">
        <sitemap-card to="/law" class="border-l-none">
          <span
            class="inline-flex items-center justify-center bg-indigo-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `file`]" />
          </span>
          <span class="font-semibold text-sm"> 特定商取引法に基づく表記 </span>
        </sitemap-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import SitemapCard from '@/components/atoms/SitemapCard.vue'
import { Breadcrumb } from '../../core/entities/Breadcrumb'

const title = 'サイトマップ'

export default Vue.extend({
  components: {
    SitemapCard,
  },
  asyncData(context: Context): void {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: title, color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', { title, breadcrumbs })
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title,
    }
  },
})
</script>
