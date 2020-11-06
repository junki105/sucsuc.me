<template>
  <nuxt-link
    :to="`/user/${author.slug}`"
    class="border-b p-2 flex items-center lg:border lg:rounded lg:shadow-xl"
  >
    <profile-icon
      :src="author.profilePicture"
      :alt="author.title"
      class="h-10 w-10"
    />
    <div>
      <p
        class="ml-2 font-semibold text-xs text-gray-800"
        v-text="author.title"
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
import { Author } from '../../core/entities/Author'
import ProfileIcon from './ProfileIcon.vue'

export default Vue.extend({
  components: {
    ProfileIcon,
  },
  props: {
    author: { type: Object, required: true, default: null } as PropOptions<
      Author
    >,
  },
})
</script>
