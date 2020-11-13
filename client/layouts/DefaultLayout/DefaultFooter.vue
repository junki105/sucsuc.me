<template>
  <footer class="bg-gray-800 py-6">
    <div
      class="max-w-6xl mx-auto flex flex-wrap justify-between text-white px-2 py-3"
    >
      <div class="w-full mb-10 lg:w-3/5">
        <p class="text-2xl font-leckerli-one mb-2">
          <logo>
            <img
              src="~/assets/img/favicon-32x32.png"
              alt="SUCSUC"
              class="w-6 mr-2"
            />
            SUCSUC
          </logo>
        </p>
        <div class="mt-1 flex text-xs">
          ユーザー同士が課題解決し成長し合えるコミュニティ「SUCSUC」<br />
          ユーザーの課題や問題を解決する成長プラットフォームとなります
        </div>
      </div>
      <div class="w-full mb-10 lg:w-1/5">
        <p class="font-bold text-gray-400 mb-2">Legal</p>
        <ul>
          <li class="my-1">
            <nuxt-link to="/terms" class="hover:opacity-75">
              利用規約
            </nuxt-link>
          </li>
          <li class="my-1">
            <nuxt-link to="/privacy/policy" class="hover:opacity-75">
              プライバシーポリシー
            </nuxt-link>
          </li>
          <li class="my-1">
            <nuxt-link to="/law" class="hover:opacity-75">
              特定商取引法に基づく表記
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div class="w-full lg:w-1/5">
        <p class="font-bold text-gray-400 mb-2">Links</p>
        <ul>
          <li class="my-1">
            <nuxt-link to="/plans" class="hover:opacity-75">
              みんなのプラン
            </nuxt-link>
          </li>
          <li class="my-1">
            <nuxt-link to="/contact" class="hover:opacity-75">
              問い合わせ
            </nuxt-link>
          </li>
          <li class="my-1">
            <nuxt-link to="/sitemap" class="hover:opacity-75">
              サイトマップ
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '@/components/atoms/Logo.vue'

export default Vue.extend({
  components: {
    Logo,
  },
})
</script>
