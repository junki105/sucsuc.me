<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }">
    <form
      method="post"
      class="pt-6 pb-8"
      @submit.prevent="handleSubmit($event, form)"
    >
      <div class="flex flex-wrap mx-3 mb-6">
        <p class="w-full px-3 mb-2 text-xs">
          銀行コード・支店コードは
          <a
            href="https://zengin.ajtw.net/"
            class="text-blue-500"
            target="_blank"
          >
            こちら
            <sup class="text-xs">
              <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
            </sup>
          </a>
          から検索してください。
        </p>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="bankCode"> 銀行コード </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, regex: /^[0-9]{4}$/ }"
            name="銀行コード"
          >
            <form-input
              v-model="form.bankCode"
              placeholder="銀行コード"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            銀行コードは<span class="font-bold">半角数字4文字</span
            >で入力ください
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="branchCode"> 支店コード </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, regex: /^[0-9]{3}$/ }"
            name="支店コード"
          >
            <form-input
              v-model="form.branchCode"
              placeholder="支店コード"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            支店コードは<span class="font-bold">半角数字3文字</span
            >で入力ください
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="accountNumber"> 口座番号 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{ required: true, regex: /^[0-9]{7,8}$/ }"
            name="口座番号"
          >
            <form-input
              v-model="form.accountNumber"
              placeholder="口座番号"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            口座番号は<span class="font-bold">半角7桁の数値</span
            >で入力ください。ゆうちょ銀行の場合<span class="font-bold"
              >半角8桁の数値</span
            >になります。
          </p>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <input-label for-input="accountNumber"> 口座名義 </input-label>
          <ValidationProvider
            v-slot="{ errors }"
            :rules="{
              required: true,
              regex: /^[ァ-ンヴー]+[\x20\u3000]?[ァ-ンヴー]+$/,
            }"
            name="口座名義"
          >
            <form-input
              v-model="form.accountHolderName"
              placeholder="口座名義"
              :errors="errors"
            />
          </ValidationProvider>
          <p class="text-gray-600 text-xs mb-2">
            口座名義は<span class="font-bold"
              >全角カナ（姓・名の間に全角スペースが必要）</span
            >で入力ください。
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
          登録する
        </button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import InputLabel from '@/components/atoms/InputLabel.vue'
import FormInput from '@/components/atoms/FormInput.vue'

export interface BankForm {
  accountHolderName: String
  accountNumber: String
  bankCode: String
  branchCode: String
}

export default Vue.extend({
  components: {
    InputLabel,
    FormInput,
  },
  props: {
    handleSubmit: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>,
  },
  data() {
    return {
      form: {
        accountHolderName: '',
        accountNumber: '',
        bankCode: '',
        branchCode: '',
      },
    }
  },
})
</script>
