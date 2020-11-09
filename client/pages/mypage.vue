<template>
  <div class="max-w-xl mx-auto px-2">
    <div class="flex flex-col md:flex-row">
      <div class="w-full py-4 md:px-4">
        <client-only placeholder="Loading...">
          <nav v-if="menu" class="bg-white border">
            <div v-for="(item, index) in menu()" :key="index">
              <mypage-menu-item
                v-if="item.show"
                :tag-name="item.tagName"
                :href="item.href"
                :to="item.to"
                :label="item.label"
                :icon="item.icon"
                :external="item.external"
                @click="item.handleClick"
              />
            </div>
          </nav>
        </client-only>
      </div>
    </div>
    <portal to="modal">
      <modal ref="chargeList" title="課金履歴" close-text="閉じる">
        <div class="flex flex-col">
          <charge-table :charges="charges" />
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
import { Context } from '@nuxt/types'
import { User } from 'netlify-identity-widget'
import { Breadcrumb } from '../../core/entities/Breadcrumb'
import Modal from '../components/Modal.vue'
import MypageMenuItem from '../components/MypageMenuItem.vue'
import BankItemList from '../components/BankItemList.vue'
import BankRegisterForm, { BankForm } from '../components/BankRegisterForm.vue'
import ChargeTable from '../components/ChargeTable.vue'
import { ChargeList, Charge } from '../../core/entities/Charge'
import { Bank } from '../../core/entities/Bank'

const title = 'マイページ'

interface DataType {
  charges: Charge[]
  hasMoreCharges: boolean
  bank: Bank | null
}

interface MethodType {
  menu(): Array<any>
  fetchCharges(event: Event, next: boolean): void
  goToBillingPortal(event: Event): void
  goToStripeConnect(event: Event): void
  openBankForm(event: Event): void
  submitBankModal(event: Event, form: BankForm): void
  onLogout(event: Event): void
}

interface ComputedType {
  user(): User
  isMentor(): boolean
}
interface PropType {}

export default Vue.extend({
  components: {
    BankItemList,
    BankRegisterForm,
    ChargeTable,
    Modal,
    MypageMenuItem,
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
  data(): DataType {
    return {
      charges: [] as Charge[],
      hasMoreCharges: false,
      bank: null as Bank | null,
    }
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
  methods: {
    menu(): Array<any> {
      return [
        {
          tagName: 'a',
          href: '#',
          label: '課金履歴を確認する',
          icon: 'money-check',
          show: true,
          handleClick: this.fetchCharges,
        },
        {
          tagName: 'a',
          href: '#',
          label: '定期決済を確認する',
          icon: 'money-check',
          external: true,
          show: true,
          handleClick: this.goToBillingPortal,
        },
        {
          tagName: 'a',
          href: '/admin/',
          label: 'CMSを開く',
          icon: 'laptop-code',
          external: true,
          show: this.isMentor,
          handleClick: () => {},
        },
        {
          tagName: 'a',
          href: '#',
          label: '本人確認（Stripe連携）',
          icon: 'key',
          external: true,
          show: this.isMentor,
          handleClick: this.goToStripeConnect,
        },
        {
          tagName: 'a',
          href: '#',
          label: '銀行登録',
          icon: 'university',
          show: this.isMentor,
          handleClick: this.openBankForm,
        },
        {
          tagName: 'nuxt-link',
          to: '/contact',
          label: '問い合わせ',
          icon: 'envelope',
          show: true,
          handleClick: () => {},
        },
        {
          tagName: 'a',
          href: '#',
          label: 'ログアウト',
          icon: 'sign-out-alt',
          show: true,
          handleClick: this.onLogout,
        },
      ]
    },
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
          '/.netlify/functions/fetch_charges',
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
    async goToBillingPortal(event: Event): Promise<void> {
      event.preventDefault()

      this.$nuxt.$loading.start()
      let url = null
      try {
        const token = await this.$store.dispatch('auth/refresh')
        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        url = await this.$axios.$post('/.netlify/functions/create_manage_link')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      if (url) {
        location.href = url
      } else {
        alert('定期決済の購入がない為、画面を表示することができませんでした')
      }
      this.$nuxt.$loading.finish()
    },
    async goToStripeConnect(event: Event): Promise<void> {
      event.preventDefault()
      if (!this.isMentor) {
        return
      }
      let url = null
      this.$nuxt.$loading.start()
      try {
        const token = await this.$store.dispatch('auth/refresh')
        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        url = await this.$axios.$post('/.netlify/functions/connect_sessions')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      if (url) {
        location.href = url
      } else {
        alert('本人確認ページに遷移することができません')
      }
      this.$nuxt.$loading.finish()
    },
    async openBankForm(event: Event): Promise<void> {
      event.preventDefault()
      if (!this.isMentor) {
        return
      }
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
      if (!this.isMentor) {
        return
      }
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
    onLogout(event: Event): void {
      event.preventDefault()
      this.$store.dispatch('auth/logout')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
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
