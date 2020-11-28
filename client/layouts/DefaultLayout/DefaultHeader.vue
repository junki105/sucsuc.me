<template>
  <header class="header px-2 lg:px-0">
    <nav class="nav">
      <div class="flex items-center justify-between">
        <div class="">
          <nuxt-link to="/" class="block p-3 lg:text-left hover:opacity-75">
            <h1 class="text-2xl font-leckerli-one">
              <logo>
                <img
                  src="~/assets/img/favicon-32x32.png"
                  alt="SUCSUC"
                  class="w-6 mr-2"
                />
                SUCSUC
              </logo>
            </h1>
          </nuxt-link>
        </div>
        <div class="flex items-center text-right">
          <nuxt-link to="/search" class="text-gray-600 mr-6">
            <font-awesome-icon :icon="['fas', 'search']" />
          </nuxt-link>
          <client-only placeholder="Loading...">
            <template v-if="user.email">
              <dropdown-menu
                :user="user"
                :profile="profile"
                @logout="$emit('logout')"
              >
              </dropdown-menu>
            </template>
            <template v-else>
              <a
                href="#"
                class="px-4 py-2 bg-brand text-white rounded-full mr-2"
                @click.prevent="$emit('login')"
              >
                Login
              </a>
              <a
                href="#"
                class="px-4 py-2 border border-brand text-brand rounded-full mr-2"
                @click.prevent="$emit('signup')"
              >
                Sign up
              </a>
            </template>
          </client-only>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Logo from '@/components/atoms/Logo.vue'
import DropdownMenu from '@/components/molecules/DropdownMenu.vue'

import { User } from 'netlify-identity-widget'
import { Profile } from '../../../core/entities/Profile'

export default Vue.extend({
  components: {
    Logo,
    DropdownMenu,
  },
  props: {
    user: { type: Object, required: true, default: null } as PropOptions<User>,
    profile: { type: Object, required: true, default: null } as PropOptions<
      Profile
    >,
  },
})
</script>

<style lang="postcss" scoped>
.header {
  @apply w-full bg-white z-10;

  & > .nav {
    @apply max-w-6xl mx-auto items-center justify-between flex-wrap;
  }
}

.search-icon.nuxt-link-exact-active.nuxt-link-active {
  @apply hidden;
}
</style>
