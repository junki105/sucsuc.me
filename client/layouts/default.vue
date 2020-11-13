<template>
  <div>
    <div class="flex flex-col">
      <div class="wrap-parent min-h-screen flex flex-col">
        <default-header
          :user="user || {}"
          :profile="profile || {}"
          @signup="openSignup"
          @login="openLogin"
          @logout="onLogout"
        />
        <div class="flex flex-grow">
          <div class="w-full">
            <div
              v-if="showPageTitle"
              class="w-full bg-gray-900 text-white text-center"
            >
              <div class="relative max-w-6xl mx-auto px-4 py-16">
                <div
                  v-if="breadcrumbs.length > 0"
                  class="absolute inset-0 mt-4"
                >
                  <breadcrumb :breadcrumbs="breadcrumbs" />
                </div>
                <div class="absolute bottom-0 right-0 mt-4 mr-4 opacity-25">
                  <font-awesome-icon :icon="['fas', 'seedling']" size="10x" />
                </div>
                <div class="flex items-center justify-center">
                  <profile-icon
                    v-if="pageImage"
                    :src="pageImage"
                    :alt="pageTitle"
                    class="h-24 w-24 mr-10"
                  />
                  <div class="w-auto">
                    <h1 class="text-xl lg:text-3xl" v-text="pageTitle" />
                    <p
                      v-if="pageDescription"
                      class="text-xs mt-4"
                      v-text="pageDescription"
                    />
                  </div>
                </div>
              </div>
            </div>
            <nuxt />
          </div>
        </div>
        <default-footer />
      </div>
    </div>
    <portal-target name="modal" multiple></portal-target>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/molecules/Breadcrumb.vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import DefaultHeader from '@/layouts/DefaultLayout/DefaultHeader.vue'
import DefaultFooter from '@/layouts/DefaultLayout/DefaultFooter.vue'

import { User } from 'netlify-identity-widget'
import { Profile } from '../../core/entities/Profile'

export default Vue.extend({
  components: {
    DefaultHeader,
    DefaultFooter,
    Breadcrumb,
    ProfileIcon,
  },
  computed: {
    showPageTitle() {
      return this.$route.name !== 'search'
    },
    user(): User {
      return this.$store.getters['auth/user']
    },
    profile(): Profile {
      return this.$store.getters['auth/profile']
    },
    ...mapGetters({
      pageTitle: 'pageTitle',
      pageDescription: 'pageDescription',
      pageImage: 'pageImage',
      breadcrumbs: 'breadcrumbs',
    }),
  },
  methods: {
    onLogout() {
      this.$store.dispatch('auth/logout')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
    ...mapActions({
      openLogin: 'auth/openLogin',
      openSignup: 'auth/openSignup',
    }),
  },
})
</script>

<style></style>
