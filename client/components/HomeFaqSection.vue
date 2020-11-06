<template>
  <div class="bg-white py-10">
    <div class="max-w-6xl mx-auto px-2">
      <h2 class="font-semibold text-center text-xl text-gray-800 lg:text-3xl">
        <font-awesome-icon :icon="['fas', 'question-circle']" class="mr-1" />
        よくある質問
      </h2>
      <p class="text-center text-xs text-gray-700 lg:text-sm">
        質問は<nuxt-link to="/contact" class="text-blue-500"
          >問い合わせ</nuxt-link
        >からご連絡ください
      </p>
      <div class="flex flex-wrap mt-10">
        <div class="w-full lg:w-1/2 lg:pr-2">
          <accordion-card
            title="スクスク（SUCSUC）でできることは？"
            class="mb-2"
          >
            <ul class="pl-4 list-disc mb-2">
              <li class="my-1">
                問題・課題を解決するサポーター（本サービスでは「スクスク（SUCSUC）」と言います）としてプランを提供できます
              </li>
              <li class="my-1">
                スクスク（SUCSUC）と契約し、サポートを受けることができます
              </li>
            </ul>
          </accordion-card>
          <accordion-card
            title="スクスク（SUCSUC）として他のユーザーのサポートを行うには？"
            class="mb-2"
          >
            <p>
              <nuxt-link to="/contact" class="text-blue-500"
                >問い合わせ</nuxt-link
              >からご連絡下さい。<br />
              運営が内容を確認の上、プランを作成して頂きます。
            </p>
          </accordion-card>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-2">
          <accordion-card title="支払い方法は？" class="mb-2">
            <p>
              Stripe決済でご利用頂けるクレジットカード（Visa/Master/American
              Express）のみ対応しています。
            </p>
            <div class="flex items-center mt-2">
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
          </accordion-card>
          <accordion-card title="金額は税込み？手数料込み？" class="mb-2">
            <p>
              表示されている金額のみをお支払いいただくことになります。<br />
              税込み、手数料込みの金額を表示しております。
            </p>
          </accordion-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccordionCard from './AccordionCard.vue'

export default Vue.extend({
  components: {
    AccordionCard,
  },
})
</script>
