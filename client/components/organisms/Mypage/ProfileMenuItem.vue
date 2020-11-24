<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="openProfileModal"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'edit']" />
      </span>
      プロフィール編集
    </a>
    <portal to="modal">
      <modal ref="modal" title="プロフィール編集" close-text="キャンセル">
        <profile-form
          v-if="profile"
          :profile="profile"
          :categories="categories"
          :handle-submit="submitPostProfile"
        />
      </modal>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Modal from '@/components/molecules/Modal.vue'
import ProfileForm from '@/components/molecules/ProfileForm.vue'

import { Category } from '../../../../core/entities/Category'
import { Profile } from '../../../../core/entities/Profile'

interface DataType {}

interface MethodType {
  openProfileModal(): void
  submitPostProfile(event: Event, profile: Profile): void
}

interface ComputedType {
  profile(): Profile
  categories(): Category[]
}
interface PropType {}

export default Vue.extend({
  components: {
    Modal,
    ProfileForm,
  },
  computed: {
    profile(): Profile {
      return this.$store.getters['auth/profile']
    },
    categories(): Category[] {
      return this.$store.getters['category/categories']
    },
  },
  methods: {
    async openProfileModal(): Promise<void> {
      await this.$store.dispatch('auth/fetchProfile')
      ;(this.$refs as any).modal.show()
    },
    async submitPostProfile(event: Event, profile: Profile): Promise<void> {
      event.preventDefault()
      this.$nuxt.$loading.start()
      try {
        await this.$store.dispatch('auth/updateProfile', profile)

        // @ts-ignore : 要検討
        this.$toast.success('プロフィールを編集しました')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
