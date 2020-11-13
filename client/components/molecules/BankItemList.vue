<template>
  <div v-if="bank" class="py-4 text-center max-w-lg mx-auto">
    <div class="font-bold bg-gray-300 border p-2">銀行名</div>
    <div class="border border-t-none p-2">
      {{ bank.bankName }}
    </div>
    <div class="font-bold bg-gray-300 border border-t-none p-2">
      口座番号下４桁
    </div>
    <div class="border border-t-none p-2">
      {{ bank.last4 }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Bank } from '../../../core/entities/Bank'

export default Vue.extend({
  props: {
    bank: {
      type: Object,
      required: false,
      default: null,
    } as PropOptions<Bank>,
  },
})
</script>
