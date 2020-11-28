<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }">
    <form
      method="post"
      class="pt-6 pb-8"
      @submit.prevent="handleSubmit($event, form)"
    >
      <div class="flex flex-wrap mx-3 mb-6">
        <div class="w-full flex items-center justify-center mb-4">
          <div class="relative">
            <div
              v-show="form.profileImage"
              class="absolute cursor-pointer top-0 right-0 mr-1 mt-1 hover:opacity-75"
              @click.prevent="form.profileImage = null"
            >
              <div
                class="flex items-center justify-center rounded-full h-6 w-6 bg-red-600 text-white"
              >
                <font-awesome-icon :icon="['fas', 'times']" size="lg" />
              </div>
            </div>
            <div
              class="w-32 h-32 flex items-center justify-center bg-gray-100 border rounded-full cursor-pointer bg-cover bg-no-repeat bg-center"
              :style="profileImageStyle"
              @click.prevent="$refs.file.click()"
            >
              <font-awesome-icon
                v-show="!form.profileImage"
                :icon="['fas', 'image']"
                size="2x"
                class="text-gray-800"
              />
            </div>
          </div>
          <input
            ref="file"
            type="file"
            class="w-0 opacity-0"
            accept="image/*"
            @change="uploadImage"
          />
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="username"> ユーザー名 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, regex: /^[a-z0-9]*$/, max: 40, min: 2 }"
            name="ユーザー名"
          >
            <form-input
              v-model="form.username"
              placeholder="ユーザー名"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            ユーザー名は<span class="font-bold">半角小文字の英数字</span
            >で入力ください
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="name"> 表示名 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, max: 40, min: 2 }"
            name="表示名"
          >
            <form-input
              v-model="form.name"
              placeholder="表示名"
              :errors="errors"
            />
          </ValidationProvider>
        </div>
        <div class="w-full px-3 mb-2">
          <input-label for-input="body"> 自己紹介 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, max: 3000, min: 40 }"
            name="自己紹介"
          >
            <form-textarea v-model="form.body" :errors="errors" />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="website" :required="false">
            カテゴリー
          </input-label>
          <multiselect
            v-model="form.categories"
            :options="categories"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="選択して下さい"
            label="label"
            track-by="label"
            :preselect-first="false"
          />
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="website" :required="false">
            WebサイトURL
          </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{
              regex: /^https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/,
            }"
            name="WebサイトURL"
          >
            <form-input
              v-model="form.website"
              placeholder="WebサイトURL"
              :errors="errors"
            />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="twitter" :required="false">
            Twitter
          </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ regex: /^[a-zA-Z0-9_]*$/, max: 60 }"
            name="Twitter"
          >
            <form-input
              v-model="form.twitter"
              placeholder="Twitter"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            Twitterのユーザー名を<span class="font-bold"
              >半角英数字(一部記号可)</span
            >で入力ください
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="facebook" :required="false">
            Facebook
          </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ regex: /^[a-zA-Z0-9.]*$/, max: 60 }"
            name="facebook"
          >
            <form-input
              v-model="form.facebook"
              placeholder="Facebook"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            Facebookのユーザー名を<span class="font-bold"
              >半角英数字(一部記号可)</span
            >で入力ください
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="instagram" :required="false">
            Instagram
          </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ regex: /^[a-zA-Z0-9_]*$/, max: 60 }"
            name="Instagram"
          >
            <form-input
              v-model="form.instagram"
              placeholder="Instagram"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            Instagramのユーザー名を<span class="font-bold"
              >半角英数字(一部記号可)</span
            >で入力ください
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="github" :required="false">
            Github
          </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ regex: /^[a-zA-Z0-9_]*$/, max: 60 }"
            name="Github"
          >
            <form-input
              v-model="form.github"
              placeholder="Github"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            Githubのユーザー名を<span class="font-bold"
              >半角英数字(一部記号可)</span
            >で入力ください
          </p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-yellow-500 text-lg text-white font-bold py-4 px-8 border-b-4 border-yellow-600 rounded-full"
          :class="{ 'opacity-75 cursor-not-allowed': invalid }"
          :disabled="invalid"
        >
          保存する
        </button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

import InputLabel from '@/components/atoms/InputLabel.vue'
import FormInput from '@/components/atoms/FormInput.vue'
import FormTextarea from '@/components/atoms/FormTextarea.vue'
import Multiselect from 'vue-multiselect'

import { Category } from '../../../core/entities/Category'
import { Profile } from '../../../core/entities/Profile'

interface DataType {
  form: Profile
}
interface MethodType {
  uploadImage(event: Event): void
}
interface ComputedType {
  profileImageStyle: Object
}
interface PropType {
  categories: Category[]
  profile: Profile | null
}

export default Vue.extend({
  components: {
    InputLabel,
    FormInput,
    FormTextarea,
    Multiselect,
  },
  props: {
    profile: {
      type: Object,
      required: true,
      default: null,
    } as PropOptions<Profile>,
    categories: {
      type: Array,
      required: true,
      default: null,
    } as PropOptions<Category[]>,
    handleSubmit: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
  },
  data() {
    return {
      form: { ...this.profile } as Profile,
    }
  },
  computed: {
    profileImageStyle() {
      return this.form.profileImage
        ? {
            backgroundImage: `url(${this.form.profileImage})`,
          }
        : {}
    },
  },
  methods: {
    uploadImage(event: Event): void {
      event.preventDefault()
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      Array.from(files).forEach((file: File) => {
        const reader: FileReader = new FileReader()
        reader.onload = () => {
          this.form.profileImage = reader.result as string
        }
        reader.readAsDataURL(file)
      })
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
