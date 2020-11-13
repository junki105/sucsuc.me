<template>
  <div class="max-w-4xl mx-auto px-2">
    <div class="w-full flex flex-wrap p-4">
      <div v-for="(plan, index) in planPosts" :key="index" class="w-full p-2">
        <plan-card :plan="plan">
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
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Context } from '@nuxt/types'
import PlanCard from '@/components/molecules/PlanCard.vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import { Breadcrumb } from '../../../../core/entities/Breadcrumb'
import { Plan } from '../../../../core/entities/Plan'
import { Hashtag } from '../../../../core/entities/Hashtag'

interface DataType {
  tag: Hashtag
  planPosts: Plan[]
}

interface MethodType {}
interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    PlanCard,
    ProfileIcon,
  },
  validate(context: Context): boolean {
    const slug = context.params.slug
    const hashtags = context.store.getters['hashtag/hashtags'] || []
    return hashtags.find((h: Hashtag) => h.value === slug)
  },
  asyncData(context: Context): DataType {
    let data = null
    if (context.payload) {
      data = context.payload as { tag: Hashtag; planPosts: Plan[] }
    } else {
      const slug = context.params.slug
      const hashtags = context.store.getters['hashtag/hashtags'] || []
      const tag = hashtags.find((h: Hashtag) => h.value === slug)
      const planPosts = context.store.getters['plan/plans'].filter((p: Plan) =>
        p.hashtags.map((h: Hashtag) => h.value).includes(tag.value)
      )
      data = { tag, planPosts }
    }
    context.store.dispatch('setPageInfo', {
      title: data.tag.label,
      description: `${data.tag.label}に関する投稿を表示します`,
      breadcrumbs: [
        {
          to: '/',
          icon: ['fas', 'laptop-code'],
          color: 'text-gray-100',
        } as Breadcrumb,
        { name: data.tag.label, color: 'text-gray-100' } as Breadcrumb,
      ],
    })

    return {
      ...data,
    }
  },
  data(): DataType {
    return {
      tag: {} as Hashtag,
      planPosts: [] as Plan[],
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title: this.tag.label,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.tag.label}に関する投稿を表示します`,
        },
      ],
    }
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
