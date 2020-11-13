<template>
  <div class="max-w-xl mx-auto px-2">
    <div class="flex flex-col md:flex-row">
      <div class="w-full py-4 md:px-4">
        <client-only placeholder="Loading...">
          <nav class="bg-white border">
            <profile-menu-item />
            <charge-menu-item />
            <subscription-menu-item />
            <cms-menu-item v-if="isMentor" />
            <connect-menu-item v-if="isMentor" />
            <bank-menu-item v-if="isMentor" />
            <contact-menu-item />
            <logout-menu-item />
          </nav>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Context } from '@nuxt/types'
import { User } from 'netlify-identity-widget'
import BankMenuItem from '@/components/organisms/Mypage/BankMenuItem.vue'
import ChargeMenuItem from '@/components/organisms/Mypage/ChargeMenuItem.vue'
import CmsMenuItem from '@/components/organisms/Mypage/CmsMenuItem.vue'
import ConnectMenuItem from '@/components/organisms/Mypage/ConnectMenuItem.vue'
import ContactMenuItem from '@/components/organisms/Mypage/ContactMenuItem.vue'
import ProfileMenuItem from '@/components/organisms/Mypage/ProfileMenuItem.vue'
import LogoutMenuItem from '@/components/organisms/Mypage/LogoutMenuItem.vue'
import SubscriptionMenuItem from '@/components/organisms/Mypage/SubscriptionMenuItem.vue'

import { Breadcrumb } from '../../core/entities/Breadcrumb'

const title = 'マイページ'

interface DataType {}
interface MethodType {}

interface ComputedType {
  user(): User
  isMentor(): boolean
}
interface PropType {}

export default Vue.extend({
  components: {
    BankMenuItem,
    ChargeMenuItem,
    CmsMenuItem,
    ConnectMenuItem,
    ContactMenuItem,
    ProfileMenuItem,
    LogoutMenuItem,
    SubscriptionMenuItem,
  },
  fetch(context: Context) {
    const breadcrumbs = [
      {
        to: '/',
        icon: ['fas', 'laptop-code'],
        color: 'text-gray-100',
      } as Breadcrumb,
      { name: title, color: 'text-gray-100' } as Breadcrumb,
    ]
    context.store.dispatch('setPageInfo', { title, breadcrumbs })
  },
  computed: {
    user(): User {
      return this.$store.getters['auth/user']
    },
    isMentor(): boolean {
      return this.$store.getters['auth/isMentor']
    },
  },
  mounted() {
    if (!this.user) {
      this.$router.push('/')
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title,
    }
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
