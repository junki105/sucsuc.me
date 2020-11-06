<template>
  <div class="max-w-4xl mx-auto px-2">
    <div class="flex flex-col md:flex-row">
      <div class="w-full py-4 md:px-4">
        <div
          class="bg-white border shadow-md rounded lg:px-8 pt-6 pb-8 mt-5 mb-10"
        >
          <p class="text-center">
            お問い合わせありがとうございます。<br />
            問い合わせで入力頂いたメールアドレスにて返答させて頂きます。
          </p>
          <img
            src="~/assets/img/undraw_mailbox_re_dvds.png"
            alt=""
            class="w-64 mx-auto my-6"
          />
          <div>
            <nuxt-link
              to="/"
              class="block w-full lg:w-1/2 mx-auto bg-orange-500 text-xl text-white text-center p-3 rounded-full mb-4 hover:opacity-75"
            >
              トップページへ
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import { Breadcrumb } from '../../../core/entities/Breadcrumb'

const title = '問い合わせ完了'
const description = 'お問い合わせが完了しました。'

export default Vue.extend({
  fetch(context: Context) {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      {
        to: '/contact',
        name: '問い合わせ',
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: '完了', color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', { title, breadcrumbs })
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
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
})
</script>

<style></style>
