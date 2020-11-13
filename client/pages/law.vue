<template>
  <div class="max-w-4xl mx-auto py-4">
    <div class="bg-white rounded-xl p-6 text-sm text-gray-800">
      <document :html="law" />
      <nuxt-link
        to="/contact"
        class="bg-orange-500 text-white rounded-full px-4 py-2 hover:opacity-75"
      >
        問い合わせ
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import Document from '@/components/atoms/Document.vue'
import { Breadcrumb } from '../../core/entities/Breadcrumb'

const title = '特定商取引法に基づく表記'

export default Vue.extend({
  components: {
    Document,
  },
  asyncData(context: Context): { law: string } {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      {
        name: title,
        color: 'text-gray-100',
      } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', { title, breadcrumbs })
    const law = context.store.getters['law/document']
    return { law }
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
