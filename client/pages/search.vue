<template>
  <div class="h-full bg-white">
    <div class="max-w-6xl mx-auto pt-2 pb-6 lg:pt-16">
      <div
        class="w-full relative flex justify-end items-center mb-4 px-2 lg:px-0"
      >
        <input
          v-model="q"
          type="text"
          class="w-full text-xl border-b form-input p-3 pl-4 pr-6 focus:outline-none lg:text-3xl"
          placeholder="Search..."
          @input="search"
        />
        <span class="absolute mr-3 text-gray-600">
          <font-awesome-icon :icon="['fas', 'search']" />
        </span>
      </div>
      <div v-if="authors.length > 0" class="mb-10">
        <h3 class="flex items-center font-bold px-2 mb-4 text-xl">
          <span
            class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-10 h-10 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `users`]" />
          </span>
          <div>
            <p class="text-base text-gray-800">スクスク（SUCSUC）</p>
            <p class="text-xs text-gray-700">
              ユーザーの課題や問題を解決するサポーター
            </p>
          </div>
        </h3>
        <div class="flex flex-wrap border-t lg:border-none lg:px-1">
          <div
            v-for="(author, index) in authors"
            :key="index"
            class="w-full lg:w-1/3 lg:mb-2 lg:px-1"
          >
            <author-card :author="author" />
          </div>
        </div>
      </div>
      <div v-if="plans.length > 0" class="">
        <h3 class="flex items-center font-bold px-2 mb-4 text-xl">
          <span
            class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-10 h-10 mr-2"
          >
            <font-awesome-icon :icon="[`fas`, `seedling`]" />
          </span>
          <div>
            <p class="text-base text-gray-800">プラン</p>
            <p class="text-xs text-gray-700">
              課題/問題を解決するプランを見つけよう
            </p>
          </div>
        </h3>
        <div v-for="(plan, index) in plans" :key="index" class="mb-2">
          <plan-card :plan="plan" class="border-b">
            <template v-slot:header>
              <nuxt-link
                :to="`/user/${plan.author.slug}`"
                class="flex items-center mb-2"
              >
                <profile-icon
                  :src="plan.author.profilePicture"
                  :alt="plan.author.title"
                  class="h-6 w-6"
                />
                <p
                  class="ml-2 font-semibold text-xs text-gray-800"
                  v-text="plan.author.title"
                />
              </nuxt-link>
            </template>
          </plan-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Context } from '@nuxt/types'
import AuthorCard from '@/components/molecules/AuthorCard.vue'
import PlanCard from '@/components/molecules/PlanCard.vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import { Author } from '../../core/entities/Author'
import { Plan } from '../../core/entities/Plan'

const title = 'スクスク（SUCSUC）、プラン検索'
const description =
  'あなたのの課題や問題を解決し成長というゴールに導くスクスク（SUCSUC）、プランを探しましょう'

interface DataType {
  q: string
  authors: Author[]
  plans: Plan[]
}

interface MethodType {
  search(): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    AuthorCard,
    PlanCard,
    ProfileIcon,
  },
  asyncData(context: Context): DataType {
    context.store.dispatch('setPageInfo', { title, description })
    return {
      q: '',
      authors: [],
      plans: [],
    }
  },
  data(): DataType {
    return {
      q: '',
      authors: [],
      plans: [],
    }
  },
  methods: {
    search(): void {
      this.$store
        .dispatch('author/search', this.q)
        .then((res: Author[]) => (this.authors = res))
      this.$store
        .dispatch('plan/search', this.q)
        .then((res: Plan[]) => (this.plans = res))
    },
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
      ],
    }
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>

<style></style>
