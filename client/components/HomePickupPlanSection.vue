<template>
  <div class="py-10">
    <div class="max-w-6xl mx-auto px-2">
      <h2 class="font-semibold text-center text-xl text-gray-800 lg:text-3xl">
        <font-awesome-icon :icon="['fas', 'seeding']" class="mr-1" />
        ピックアップ
      </h2>
      <p class="text-center text-xs text-gray-700 lg:text-sm">
        質問は<nuxt-link to="/contact" class="text-blue-500"
          >問い合わせ</nuxt-link
        >からご連絡ください
      </p>
      <div class="flex flex-wrap mt-10">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="flex w-full lg:w-1/2 mb-4"
          :class="{ 'pr-2': index % 2 == 0, 'pl-2': index % 2 == 1 }"
        >
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
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Plan } from '../../core/entities/Plan'
import ProfileIcon from './ProfileIcon.vue'
import PlanCard from './PlanCard.vue'

export default Vue.extend({
  components: {
    ProfileIcon,
    PlanCard,
  },
  props: {
    plans: {
      type: Array,
      required: true,
      default: () => [],
    } as PropOptions<Plan[]>,
  },
})
</script>
