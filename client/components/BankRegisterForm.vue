<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }">
    <form method="post" class="pt-6 pb-8" @submit.prevent="handleSubmit($event, form)">
      <div class="flex flex-wrap mx-3 mb-6">
        <p class="w-full px-3 mb-2 text-xs">
          銀行コード・支店コードは
          <a href="https://zengin.ajtw.net/" class="text-blue-500" target="_blank">
            こちら
              <sup class="text-xs">
              <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
            </sup>
          </a>
          から検索してください。
        </p>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold"
            for="name"
          >
            銀行コード
          </label>
          <p class="text-gray-600 text-xs mb-2">
            銀行コードは<span class="font-bold">半角数字4文字</span>で入力ください
          </p>
          <ValidationProvider
            :rules="{ required: true, regex: /^[0-9]{4}$/ }"
            v-slot="{ errors }"
            name="銀行コード"
          >
            <input
              v-model="form.bankCode"
              type="text"
              placeholder="銀行コード"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold"
            for="email"
          >
            支店コード
          </label>
          <p class="text-gray-600 text-xs mb-2">
            支店コードは<span class="font-bold">半角数字3文字</span>で入力ください
          </p>
          <ValidationProvider
            :rules="{ required: true, regex: /^[0-9]{3}$/ }"
            v-slot="{ errors }"
            name="支店コード"
          >
            <input
              v-model="form.branchCode"
              type="text"
              placeholder="支店コード"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold"
            for="email"
          >
            口座番号
          </label>
          <p class="text-gray-600 text-xs mb-2">
            口座番号は<span class="font-bold">半角7桁の数値</span>で入力ください。ゆうちょ銀行の場合<span class="font-bold">半角8桁の数値</span>になります。
          </p>
          <ValidationProvider
            :rules="{ required: true, regex: /^[0-9]{7,8}$/ }"
            v-slot="{ errors }"
            name="口座番号"
          >
            <input
              v-model="form.accountNumber"
              type="text"
              placeholder="口座番号"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-2">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold"
            for="email"
          >
            口座名義
          </label>
          <p class="text-gray-600 text-xs mb-2">
            口座名義は<span class="font-bold">全角カナ（姓・名の間に全角スペースが必要）</span>で入力ください。
          </p>
          <ValidationProvider
            :rules="{ required: true, regex: /^[ァ-ンヴー]+　[ァ-ンヴー]+$/ }"
            v-slot="{ errors }"
            name="口座名義"
          >
            <input
              v-model="form.accountHolderName"
              type="text"
              placeholder="口座名義"
              class="block w-full bg-gray-200 text-gray-600 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              :class="{ 'border-red': false }"
            />
            <p
              v-if="errors.length > 0"
              class="text-red-500 text-xs italic"
              v-text="errors[0]"
            />
          </ValidationProvider>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-orange-500 text-lg text-white font-bold py-4 px-8 border-b-4 border-orange-600 rounded-full"
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

export interface BankForm {
    accountHolderName: String;
    accountNumber: String;
    bankCode: String;
    branchCode: String;
}

export default Vue.extend({
  props: {
    handleSubmit: {
      type: Function,
      required: false,
      default: () => {},
    } as PropOptions<Function>
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
