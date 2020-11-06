import netlifyIdentity from 'netlify-identity-widget'
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $netlifyIdentity: any
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $netlifyIdentity: any
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $netlifyIdentity: any
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $netlifyIdentity: any
  }
}

const myPlugin: Plugin = async (context, inject) => {
    inject('netlifyIdentity', netlifyIdentity)
    await context.store.dispatch('auth/init', context)
}

export default myPlugin