<template>
  <div class="max-w-4xl mx-auto py-4">
    <div class="bg-white rounded-xl p-6 text-sm text-gray-800">
      <document :html="primaryPolicy" />
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
import { Breadcrumb } from '../../../core/entities/Breadcrumb'

const title = 'プライバシーポリシー'

export default Vue.extend({
  components: {
    Document,
  },
  asyncData(context: Context): { primaryPolicy: string } {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: title, color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', {
      title: 'プライバシーポリシー',
      breadcrumbs,
    })
    const primaryPolicy = context.store.getters['privacy/document']
    return { primaryPolicy }
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
