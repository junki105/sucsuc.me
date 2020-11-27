<template>
  <div class="w-full">
    <a
      href="#"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
      @click.prevent="openProductModal"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'edit']" />
      </span>
      プラン管理
    </a>
    <portal to="modal">
      <modal
        ref="warningModal"
        title="プランを購入することはできません"
        close-text="閉じる"
      >
        <div class="p-4">
          <p class="max-w-lg mx-auto text-center text-gray-600 text-xs">
            プランを作成する前にプロフィールの設定が必要になります。
          </p>
        </div>
      </modal>
      <modal ref="modal" title="プラン管理" close-text="キャンセル">
        <template v-slot:header>
          <div class="w-full flex justify-between items-center">
            <div class="w-1/5" />
            <p class="w-3/5 text-center text-2xl font-bold">プラン管理</p>
            <div class="w-1/5 text-center">
              <a
                v-show="!hasNew"
                href="#"
                class="bg-yellow-500 text-white text-xs rounded-full px-4 py-2 hover:opacity-75"
                @click.prevent="addProduct"
              >
                追加
              </a>
            </div>
          </div>
        </template>

        <div v-if="products && products.length > 0">
          <alert-box
            type="warning"
            message="プランは審査制となります。公開までは数時間〜１営業日お時間頂きます。ご了承ください。"
            class="mt-6"
          />
          <product-list
            :products="products"
            :handle-submit="submitPostProduct"
            :handle-copy="copyProduct"
            :handle-delete="deleteProduct"
          />
        </div>
        <alert-box
          v-else
          type="info"
          message="プランを登録しましょう！！"
          class="mt-6"
        />
      </modal>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import AlertBox from '@/components/molecules/AlertBox.vue'
import Modal from '@/components/molecules/Modal.vue'
import ProductList from '@/components/organisms/Mypage/ProductList.vue'

import { Product, createProduct } from '../../../../core/entities/Product'

interface DataType {
  products: Product[]
}

interface MethodType {
  openProductModal(): void
  addProduct(): void
  copyProduct(product: Product): void
  deleteProduct(index: number): void
  submitPostProduct(event: Event, product: Product): void
}

interface ComputedType {}
interface PropType {}

export default Vue.extend({
  components: {
    AlertBox,
    Modal,
    ProductList,
  },
  data() {
    return {
      products: [],
    }
  },
  computed: {
    hasNew(): boolean {
      return this.products.filter((p: Product) => !p._id).length > 0
    },
  },
  methods: {
    async openProductModal(): Promise<void> {
      await this.$store.dispatch('auth/fetchProfile')
      if (!this.$store.getters['auth/profile']._id) {
        ;(this.$refs as any).warningModal.show()
        return
      }

      this.products = [...this.$store.getters['auth/profile'].products]
      ;(this.$refs as any).modal.show()
    },
    addProduct(): void {
      this.products.unshift(createProduct())
    },
    copyProduct(product: Product): void {
      const copy = { ...product }
      copy._id = undefined
      copy.uuid = undefined
      copy.copy = true
      this.products.unshift(copy)
    },
    deleteProduct(index: number): void {
      this.products.splice(index, 1)
    },
    async submitPostProduct(event: Event, product: Product): Promise<void> {
      event.preventDefault()
      this.$nuxt.$loading.start()
      try {
        await this.$store.dispatch('auth/saveProduct', product)
        ;(this.$refs as any).modal.hide()
        this.$toast.success('プランを保存しました。')
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
