<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="openBankForm"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'university']" />
      </span>
      銀行登録
    </a>
    <portal to="modal">
      <modal ref="retrieveBank" title="銀行情報" close-text="閉じる">
        <bank-item-list v-if="bank" :bank="bank" />
      </modal>
      <modal ref="createBank" title="銀行情報を登録" close-text="キャンセル">
        <bank-register-form :handle-submit="submitBankModal" />
      </modal>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Modal from '@/components/molecules/Modal.vue'
import BankRegisterForm, {
  BankForm,
} from '@/components/molecules/BankRegisterForm.vue'
import BankItemList from '@/components/molecules/BankItemList.vue'

import { Bank } from '../../../../core/entities/Bank'

interface DataType {
  bank: Bank | null
}

interface MethodType {
  openBankForm(event: Event): void
  submitBankModal(event: Event, form: BankForm): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    Modal,
    BankRegisterForm,
    BankItemList,
  },
  data(): DataType {
    return {
      bank: null,
    }
  },
  methods: {
    async openBankForm(event: Event): Promise<void> {
      event.preventDefault()
      this.$nuxt.$loading.start()
      try {
        const token = await this.$store.dispatch('auth/refresh')
        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.bank = await this.$axios.$post('/.netlify/functions/retrieve_bank')
        this.bank
          ? (this.$refs as any).retrieveBank.show()
          : (this.$refs as any).createBank.show()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
    async submitBankModal(event: Event, form: BankForm): Promise<void> {
      event.preventDefault()
      this.$nuxt.$loading.start()
      const token = await this.$store.dispatch('auth/refresh')
      this.$axios.setHeader('Authorization', `Bearer ${token}`)
      try {
        await this.$axios.$post('/.netlify/functions/create_bank', {
          account_holder_name: form.accountHolderName,
          account_number: form.accountNumber,
          routing_number: `${form.bankCode}${form.branchCode}`,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        ;(this.$refs as any).createBank.hide()
        this.$nuxt.$loading.finish()
      }
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
