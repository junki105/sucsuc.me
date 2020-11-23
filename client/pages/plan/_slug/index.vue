<template>
  <div>
    <div class="max-w-6xl mx-auto px-2">
      <div class="flex flex-col md:flex-row">
        <div class="w-full py-4 md:px-4">
          <div class="h-full bg-white shadow-md rounded-lg p-4">
            <div class="w-full">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="app-markdown" v-html="$md.render(product.body)" />
            </div>
          </div>
        </div>
        <div class="w-full md:w-5/12 py-4">
          <div class="bg-gray-100 px-4 py-2 mb-2">
            <nuxt-link
              :to="`/user/${product.author.uuid}`"
              class="flex items-center"
            >
              <profile-icon
                :src="product.author.profileImage"
                :alt="product.author.name"
                class="h-10 w-10"
              />
              <div>
                <p
                  class="ml-2 font-semibold text-xs text-gray-800"
                  v-text="product.author.name"
                />
                <p
                  class="ml-2 font-semibold text-xs text-gray-800"
                  v-text="`@${product.author.username}`"
                />
              </div>
            </nuxt-link>
          </div>
          <div class="bg-gray-100 px-4 py-2">
            <div class="flex justify-between items-center">
              <p>金額</p>
              <p class="font-semibold text-2xl text-gray-800">
                <span class="mr-1">¥</span>
                <span v-text="product.price.toLocaleString()" />
                <span v-show="isMonthly" class="text-sm">/ 月</span>
                <span class="text-gray-800 text-sm">（税込）</span>
              </p>
            </div>
            <div class="border-b my-4" />
            <button
              class="w-full bg-orange-500 rounded font-bold text-white p-4 hover:opacity-75 mb-4"
              @click.prevent="showModal"
            >
              購入する
            </button>
          </div>

          <div class="bg-red-100 shadow-xl border-red-500 mt-6 px-4 py-2">
            <p class="font-bold text-red-600 text-sm mb-2">
              <font-awesome-icon :icon="[`fas`, `exclamation-triangle`]" />
              注意事項
            </p>
            <ul class="pl-4 list-disc text-red-500 text-xs">
              <li class="my-1">
                単発、月額課金は、よくご確認の上でご契約ください。
              </li>
              <li class="my-1">
                二重課金等のこちらの不手際以外は、原則返金対応はいたしません
              </li>
              <li class="my-1">
                契約予定のプラン以外を誤ってご契約しても、返金対応はいたしません。
              </li>
            </ul>
          </div>

          <div class="bg-blue-100 shadow-xl border-blue-500 mt-6 px-4 py-2">
            <p class="font-bold text-blue-600 text-sm mb-2">
              <font-awesome-icon :icon="[`fas`, `money-check-alt`]" />
              支払い方法
            </p>
            <ul class="pl-4 list-disc text-blue-500 text-xs mb-2">
              <li class="my-1">
                Stripeを利用してクレジットカード決済となります。
              </li>
            </ul>
            <div class="flex items-center ml-4">
              <img
                src="~/assets/img/creditcard/visa.png"
                alt="VISA"
                class="w-12 mr-2"
              />
              <img
                src="~/assets/img/creditcard/mastercard.png"
                alt="MasterCard"
                class="w-12 mr-2"
              />
              <img
                src="~/assets/img/creditcard/amex.png"
                alt="American Express"
                class="w-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 bg-indigo-100 border-t p-4">
      <div class="w-full flex justify-between lg:justify-end">
        <p class="font-semibold text-2xl text-gray-800 mr-5">
          <span class="mr-1">¥</span>
          <span v-text="product.price.toLocaleString()" />
          <span v-show="isMonthly" class="text-sm">/ 月</span>
          <span class="text-gray-800 text-sm">（税込）</span>
        </p>
        <button
          class="bg-orange-500 rounded font-bold text-white px-4 py-2 hover:opacity-75"
          @click.prevent="showModal"
        >
          購入する
        </button>
      </div>
    </div>
    <portal to="modal">
      <modal
        ref="authModal"
        title="ログインが必要になります。"
        close-text="閉じる"
      >
        <div class="p-4">
          <p class="max-w-lg mx-auto text-center text-gray-600 text-xs">
            購入手続きを進めるにはログインが必要になります。
          </p>
          <div class="w-full mt-6 lg:w-1/2 lg:mx-auto">
            <button
              class="w-full bg-indigo-700 rounded font-bold text-white p-4 hover:opacity-75"
              @click.prevent="goToLogin"
            >
              ログイン
            </button>
          </div>
        </div>
      </modal>
      <modal
        ref="warningModal"
        title="プランを購入することはできません"
        close-text="閉じる"
      >
        <div class="p-4">
          <p class="max-w-lg mx-auto text-center text-gray-600 text-xs">
            あなたが作成したプランです。自分のプランを購入することはできません。
          </p>
        </div>
      </modal>
      <modal
        ref="checkoutConfirmModal"
        title="Stripeの購入画面に遷移します"
        close-text="閉じる"
      >
        <div class="py-4 md:px-4">
          <p class="max-w-xl mx-auto text-center text-gray-700 text-xs mb-4">
            本サービスでは
            <a
              href="https://stripe.com/ja-hk/payments/checkout"
              target="_blank"
              class="text-blue-500 underline"
            >
              Stripe Checkout
              <sup>
                <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
              </sup>
            </a>
            を利用して購入手続きを行います。
            決済データや個人情報はStripeにて安全に管理され、運営が確認できるデータも制限されます。
            詳細は、Stripeの
            <a
              href="https://stripe.com/jp/privacy"
              target="_blank"
              class="text-blue-500 underline"
            >
              プライバシーポリシー
              <sup>
                <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
              </sup>
            </a>
            をご確認ください。
          </p>
          <div class="bg-gray-100 border flex flex-col p-4">
            <nuxt-link
              :to="`/user/${product.author.slug}`"
              class="flex items-center mb-2"
            >
              <profile-icon
                :src="product.author.profileImage"
                :alt="product.author.name"
                class="h-6 w-6"
              />
              <div>
                <p
                  class="ml-2 font-semibold text-xs text-gray-800"
                  v-text="product.author.name"
                />
              </div>
            </nuxt-link>
            <p class="font-bold text-lg" v-text="product.title" />
            <p class="font-semibold text-3xl text-gray-800">
              <span class="mr-1">¥</span>
              <span v-text="product.price.toLocaleString()" />
              <span v-show="isMonthly" class="text-sm">/ 月</span>
              <span class="text-gray-800 text-sm">（税込）</span>
            </p>
          </div>
          <div class="w-full mt-6 text-center lg:w-1/2 lg:mx-auto">
            <label
              class="flex justify-center items-center text-gray-800 font-bold mb-2"
            >
              <input v-model="agree" type="checkbox" class="mr-2" />
              <span class="text-sm"> 規約に同意して購入する </span>
            </label>
            <button
              class="w-full bg-indigo-700 rounded font-bold text-white p-4"
              :class="{
                'cursor-not-allowed opacity-50': !agree,
                'hover:opacity-75': agree,
              }"
              :disabled="!agree"
              @click.prevent="goToCheckout"
            >
              購入手続きを行う
            </button>
          </div>
        </div>
      </modal>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Context } from '@nuxt/types'
import { loadStripe, RedirectToCheckoutOptions } from '@stripe/stripe-js'
import Modal from '@/components/molecules/Modal.vue'
import ProfileIcon from '@/components/atoms/ProfileIcon.vue'
import { Breadcrumb } from '../../../../core/entities/Breadcrumb'
import { Product, INTERVAL_MONTHLY } from '../../../../core/entities/Product'
import { Profile } from '../../../../core/entities/Profile'

interface DataType {
  baseUrl: string
  stripePublishableKey: string
  product: Product
  agree: Boolean
}

interface MethodType {}
interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    Modal,
    ProfileIcon,
  },
  validate(context: Context): boolean {
    const slug = context.params.slug
    const products = context.store.getters['product/products'] || []
    return products.find((p: Product) => p.uuid === slug)
  },
  asyncData(context: Context): DataType {
    let data = null
    if (context.payload) {
      data = context.payload as { product: Product }
    } else {
      const slug = context.params.slug
      const products = context.store.getters['product/products'] || []
      const product = products.find((p: Product) => p.uuid === slug)
      data = { product }
    }
    context.store.dispatch('setPageInfo', {
      title: data.product.title,
      description: data.product.description,
      breadcrumbs: [
        {
          to: '/',
          icon: ['fas', 'laptop-code'],
          color: 'text-gray-100',
        } as Breadcrumb,
        {
          to: `/user/${data.product.author._id}`,
          name: data.product.author.name,
          color: 'text-gray-100',
        } as Breadcrumb,
        { name: data.product.title, color: 'text-gray-100' } as Breadcrumb,
      ],
    })

    return {
      baseUrl: process.env.baseUrl || '',
      stripePublishableKey: process.env.stripePublishableKey || '',
      agree: false,
      ...data,
    }
  },
  data(): DataType {
    return {
      baseUrl: '',
      stripePublishableKey: process.env.baseUrl || '',
      product: {} as Product,
      agree: false,
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
      title: this.product.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.product.description,
        },
      ],
    }
  },
  computed: {
    isMonthly(): Boolean {
      return this.product.interval === INTERVAL_MONTHLY
    },
  },
  methods: {
    showModal(): void {
      if (!this.$store.getters['auth/user']) {
        ;(this.$refs as any).authModal.show()
        return
      }

      const profile: Profile | null = this.$store.getters['auth/profile']
      if (
        profile &&
        this.product.author &&
        profile._id === this.product.author._id
      ) {
        ;(this.$refs as any).warningModal.show()
        return
      }

      ;(this.$refs as any).checkoutConfirmModal.show()
    },
    goToLogin(): void {
      ;(this.$refs as any).authModal.hide()
      this.$store.dispatch('auth/openLogin')
    },
    async goToCheckout(): Promise<void> {
      const stripe = await loadStripe(this.stripePublishableKey)
      if (stripe) {
        try {
          this.$nuxt.$loading.start()
          const token = await this.$store.dispatch('auth/refresh')
          this.$axios.setHeader('Authorization', `Bearer ${token}`)
          const session = await this.$axios.$post(
            '/.netlify/functions/checkout_sessions',
            {
              uuid: this.product.uuid,
              success_url: `${this.baseUrl}/plan/${this.product.uuid}/thanks`,
            }
          )
          stripe.redirectToCheckout({
            sessionId: session.id,
          } as RedirectToCheckoutOptions)
        } finally {
          this.$nuxt.$loading.finish()
        }
      }
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>
