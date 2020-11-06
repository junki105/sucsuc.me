import Vue from 'vue'
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from 'vee-validate'
/* eslint import/namespace: ['error', { allowComputed: true }] */
import * as rules from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'

// 全てのルールをインポート
let rule
for (rule in rules) {
  extend(rule, {
    // eslint-disable-line
    ...rules[rule],
  })
}

// メッセージを設定
localize('ja', ja)

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
