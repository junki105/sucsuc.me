<template>
  <nuxt-link
    :to="`/user/${author._id}`"
    class="border-b p-2 flex items-center lg:border lg:rounded lg:shadow-xl"
  >
    <profile-icon
      :src="author.profileImage"
      :alt="author.name"
      class="h-10 w-10"
    />
    <div>
      <p
        class="ml-2 font-semibold text-xs text-gray-800"
        v-text="author.name"
      />
      <p
        class="ml-2 font-semibold text-xs text-gray-800"
        v-text="`@${author.username}`"
      />
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import { Profile } from '../../../core/entities/Profile'

export default Vue.extend({
  components: {
    ProfileIcon,
  },
  props: {
    author: { type: Object, required: true, default: null } as PropOptions<
      Profile
    >,
  },
})
</script>
