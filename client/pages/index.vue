<template>
  <div clas="w-full">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row"></div>
    </div>
    <home-pickup-plan-section :plans="pickupPlans" />
    <home-faq-section />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import HomeFaqSection from '@/components/organisms/Home/HomeFaqSection.vue'
import HomePickupPlanSection from '@/components/organisms/Home/HomePickupPlanSection.vue'
import { Plan } from '../../core/entities/Plan'
import { shuffle } from '../../core/utils/array'

const title = 'ユーザー同士が課題解決し成長し合えるコミュニティ「SUCSUC」'
const description =
  'あなたの課題や問題を解決し成長というゴールに導くスクスク（SUCSUC）を探しましょう'

export default Vue.extend({
  components: {
    HomeFaqSection,
    HomePickupPlanSection,
  },
  asyncData(context: Context): { plans: Plan[] } {
    context.store.dispatch('setPageInfo', { title, description })
    return {
      plans: context.store.getters['plan/plans'],
    }
  },
  data(): { plans: Plan[] } {
    return {
      plans: [],
    }
  },
  computed: {
    pickupPlans(): Plan[] {
      return shuffle(this.plans).slice(2)
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
})
</script>
