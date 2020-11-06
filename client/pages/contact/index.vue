<template>
  <div class="max-w-4xl mx-auto px-2">
    <div class="flex flex-col md:flex-row">
      <div class="w-full py-4 md:px-4">
        <client-only placeholder="Loading...">
          <ValidationObserver ref="observer" v-slot="{ invalid }">
            <form
              name="contact"
              action="/contact/thanks"
              method="post"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              class="bg-white border shadow-md rounded lg:px-8 pt-6 pb-8 mt-5 mb-10"
            >
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="id" :value="user && user.id" />
              <div class="flex flex-wrap mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    class="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                    for="name"
                  >
                    名前
                  </label>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="お名前"
                    rules="required|max:40"
                  >
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      name="name"
                      placeholder="山田 太郎"
                      class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
                      :class="{ 'border-red': false }"
                    />
                    <p
                      v-if="errors.length > 0"
                      class="text-red-500 text-xs italic"
                      v-text="errors[0]"
                    />
                  </ValidationProvider>
                </div>
                <div class="w-full md:w-1/2 px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                    for="email"
                  >
                    メールアドレス
                  </label>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="メールアドレス"
                    rules="required|email|max:40"
                  >
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      name="email"
                      placeholder="example@nnn.com"
                      class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      :class="{ 'border-red': false }"
                    />
                    <p
                      v-if="errors.length > 0"
                      class="text-red-500 text-xs italic"
                      v-text="errors[0]"
                    />
                  </ValidationProvider>
                </div>
              </div>
              <div class="mx-3 mb-6 px-3">
                <label
                  class="block text-gray-600 text-sm font-bold mb-2"
                  for="category"
                >
                  問い合わせ種別
                </label>
                <ValidationProvider v-slot="{ errors }" name="問い合わせ種別">
                  <div class="relative">
                    <select
                      v-model="form.category"
                      name="category"
                      class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option
                        v-for="(cateogry, index) in categories"
                        :key="index"
                        :value="cateogry"
                      >
                        {{ cateogry }}
                      </option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    >
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p
                    v-if="errors.length > 0"
                    class="text-red-500 text-xs italic"
                    v-text="errors[0]"
                  />
                </ValidationProvider>
              </div>
              <div class="mx-3 mb-6 px-3">
                <label
                  class="block text-gray-600 text-sm font-bold mb-2"
                  for="content"
                >
                  問い合わせ内容
                </label>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="問い合わせ内容"
                  rules="required|max:2000"
                >
                  <textarea
                    v-model="form.content"
                    name="content"
                    rows="6"
                    class="shadow border rounded w-full py-2 px-3 text-gray-600 mb-3 bg-gray-200 focus:outline-none focus:bg-white"
                    :class="{ 'border-red': false }"
                  ></textarea>
                  <p
                    v-if="errors.length > 0"
                    class="text-red-500 text-xs italic"
                    v-text="errors[0]"
                  />
                </ValidationProvider>
              </div>
              <p
                v-if="invalid"
                class="text-center font-bold text-xs text-red-500 mb-2"
              >
                全ての情報を入力してから送信してください
              </p>
              <div class="flex items-center justify-center">
                <button
                  type="submit"
                  class="bg-blue-600 text-lg text-white font-bold py-4 px-8 border-b-4 border-blue-700 rounded"
                  :class="{ 'opacity-75 cursor-not-allowed': invalid }"
                  :disabled="invalid"
                >
                  送信する
                </button>
              </div>
            </form>
          </ValidationObserver>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import { mapGetters } from 'vuex'
import { Breadcrumb } from '../../../core/entities/Breadcrumb'

const categories: String[] = [
  'サービスの詳細を知りたい',
  'サポーターとして活動したい',
  '不具合報告',
  'その他',
]

const title = '問い合わせ'
const description = 'サービスへのお問い合わせはこちらから'

export default Vue.extend({
  fetch(context: Context) {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: title, color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', { title, description, breadcrumbs })
  },
  data() {
    return {
      categories,
      form: {
        name: '',
        email: '',
        category: categories[0],
        content: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  mounted() {
    if (this.user) {
      this.form.name = this.user.user_metadata.full_name
      this.form.email = this.user.email
    }
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
