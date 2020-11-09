<template>
  <div
    class="w-full bg-white md:shadow-md md:hover:shadow-2xl md:rounded-lg px-4 py-2"
  >
    <slot name="header" />
    <div class="pl-8">
      <nuxt-link :to="`/plan/${plan.slug}`">
        <p class="text-lg font-bold hover:text-brand" v-text="plan.title" />
        <p class="text-xs text-gray-700 mb-1" v-text="plan.description" />
      </nuxt-link>
      <div class="mb-2">
        <hashtag
          v-for="hashtag in hashtags"
          :key="hashtag.value"
          tag-name="nuxt-link"
          :to="`/tag/${hashtag.value}`"
          class="mb-1 mr-2"
        >
          <div class="flex items-center justify-center mr-2">
            <img v-if="hashtag.icon" :src="hashtag.icon" class="h-3" />
            <font-awesome-icon v-else :icon="['fas', 'tag']" />
          </div>
          {{ hashtag.label }}
        </hashtag>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span
            v-if="isMonthly"
            class="font-bold bg-blue-100 text-blue-500 text-xs rounded px-4 py-1 mr-2"
            >サブスク</span
          >
          <span
            v-else
            class="font-bold bg-red-100 text-red-500 text-xs rounded px-4 py-1 mr-2"
            >１回のみ</span
          >
          <p class="font-semibold text-xl text-gray-800">
            <span class="mr-1">¥</span>
            <span v-text="plan.price.toLocaleString()" />
            <span v-show="isMonthly" class="text-sm">/ 月</span>
          </p>
        </div>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Hashtag from '../elements/Hashtag.vue'
import { Author } from '../../core/entities/Author'
import { Hashtag as HashtagData } from '../../core/entities/Hashtag'
import { Plan } from '../../core/entities/Plan'

export default Vue.extend({
  components: {
    Hashtag,
  },
  props: {
    plan: { type: Object, required: true, default: null } as PropOptions<Plan>,
  },
  computed: {
    author(): Author {
      return this.plan.author
    },
    hashtags(): HashtagData[] {
      return this.plan.hashtags
    },
    isMonthly(): Boolean {
      return this.plan.interval === 'monthly'
    },
  },
})
</script>
