<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="fetchCharges"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'money-check']" />
      </span>
      課金履歴を確認する
    </a>
    <portal to="modal">
      <modal ref="chargeList" title="課金履歴" close-text="閉じる">
        <div class="flex flex-col">
          <charge-table v-if="charges.length" :charges="charges" />
          <alert-box
            v-else
            type="warning"
            message="課金履歴が見つかりませんでした"
            class="mt-6"
          />
          <div v-if="hasMoreCharges" class="mt-6 mx-auto">
            <a
              href="#"
              class="p-4 bg-orange-500 text-white rounded-full"
              @click.prevent="fetchCharges($event, true)"
            >
              もっと見る
            </a>
          </div>
        </div>
      </modal>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import AlertBox from '@/components/molecules/AlertBox.vue'
import ChargeTable from '@/components/molecules/ChargeTable.vue'
import Modal from '@/components/molecules/Modal.vue'

import { ChargeList, Charge } from '../../../../core/entities/Charge'

interface DataType {
  charges: Charge[]
  hasMoreCharges: boolean
}

interface MethodType {
  fetchCharges(event: Event, next: boolean): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    AlertBox,
    ChargeTable,
    Modal,
  },
  data(): DataType {
    return {
      charges: [],
      hasMoreCharges: false,
    }
  },
  methods: {
    async fetchCharges(event: Event, next = false): Promise<void> {
      event.preventDefault()
      if (this.charges.length > 0 && !next) {
        ;(this.$refs as any).chargeList.show()
        return
      }
      this.$nuxt.$loading.start()
      try {
        const token = await this.$store.dispatch('auth/refresh')
        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        const params = next
          ? { startingAfter: this.charges[this.charges.length - 1].id }
          : {}
        const chargeData: ChargeList = await this.$axios.$post(
          '/.netlify/functions/charge-list',
          params
        )
        this.hasMoreCharges = chargeData.hasMore
        this.charges = [...this.charges, ...chargeData.data] as Charge[]
        ;(this.$refs as any).chargeList.show()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        alert('決済データは見つかりませんでした')
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
