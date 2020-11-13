<template>
  <div>
    <div
      v-show="open"
      class="absolute top-0 right-0 w-full h-full opacity-0"
      @click="open = false"
    />
    <div class="relative">
      <a
        href="#"
        class="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden text-gray-600 hover:bg-blue-100 p-1"
        @click.prevent="open = !open"
      >
        <font-awesome-icon :icon="[`fas`, `align-right`]" />
      </a>
      <div
        v-show="open"
        class="absolute text-left right-0 border mt-2 py-2 w-64 bg-white rounded-lg shadow-full"
      >
        <div class="border-b p-3">
          <p v-if="profile" class="text-sm">
            {{ profile.name }}
          </p>
          <p class="text-xs text-gray-600">
            {{ user.email }}
          </p>
        </div>
        <nuxt-link
          to="/mypage"
          class="block px-4 py-2 text-gray-800 hover:opacity-75"
        >
          <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'user']" />
          </span>
          マイページ
        </nuxt-link>
        <a
          href="#"
          class="block px-4 py-2 text-gray-800 hover:opacity-75"
          @click.prevent="$emit('logout')"
        >
          <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
          </span>
          ログアウト
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from 'netlify-identity-widget'
import { Profile } from '../../../core/entities/Profile'

export default Vue.extend({
  props: {
    user: { type: Object, required: true, default: {} as User } as PropOptions<
      User
    >,
    profile: {
      type: Object,
      required: true,
      default: {} as Profile,
    } as PropOptions<Profile>,
  },
  data() {
    return {
      open: false,
    }
  },
  watch: {
    $route() {
      this.open = false
    },
  },
})
</script>
