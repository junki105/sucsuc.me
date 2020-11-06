<template>
  <header class="header">
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
          <nuxt-link to="/search" class="search-icon mr-6">
            <svg
              class="fill-current pointer-events-none text-gray-600 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
              ></path>
            </svg>
          </nuxt-link>
          <client-only placeholder="Loading...">
            <template v-if="user.email">
              <dropdown-menu :user="user" @logout="$emit('logout')">
              </dropdown-menu>
            </template>
            <template v-else>
              <a
                href="#"
                class="px-4 py-2 bg-indigo-600 text-white rounded-full mr-2"
                @click.prevent="$emit('login')"
              >
                Login
              </a>
              <a
                href="#"
                class="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full mr-2"
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
import { User } from 'netlify-identity-widget'
import Logo from '../../elements/Logo.vue'
import DropdownMenu from '../../components/DropdownMenu.vue'
export default Vue.extend({
  components: {
    Logo,
    DropdownMenu,
  },
  props: {
    user: { type: Object, required: true, deafult: null } as PropOptions<User>,
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
