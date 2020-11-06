<template>
  <div class="overflow-x-auto">
    <div class="py-2 inline-block min-w-full">
      <div class="overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                決済日時
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                金額
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                ステータス
              </th>
              <th class="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(charge, index) in charges" :key="index">
              <td class="px-6 py-4 whitespace-no-wrap">
                <div class="text-sm leading-5 font-medium text-gray-900">
                  {{ $dayjs(charge.created * 1000).format('YYYY/MM/DD') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap">
                <div class="text-sm leading-5 text-gray-900">
                  <span class="mr-1">¥</span>
                  <span v-text="charge.amount.toLocaleString()" />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap">
                <span
                  v-if="charge.paid"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >
                  支払済
                </span>
                <span
                  v-else
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                >
                  エラー
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium"
              >
                <a
                  :href="charge.receiptUrl"
                  class="flex flex-col items-center text-indigo-600 hover:text-indigo-900"
                  target="_blank"
                >
                  <font-awesome-icon :icon="[`fas`, `receipt`]" />
                  <span class="text-xs">レシート</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Charge } from '../../core/entities/Charge'

export default Vue.extend({
  props: {
    charges: {
      type: Array,
      required: false,
      default: null,
    } as PropOptions<Charge[]>,
  },
})
</script>
