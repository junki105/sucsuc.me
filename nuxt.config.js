const modules = []
const options = {}
if (process.env.NODE_ENV !== 'production') {
  modules.push(...['@nuxtjs/proxy'])
  options.proxy = {
    '/.netlify/functions': {
      target: 'http://localhost:9000',
    },
  }
}

const generateRoute = () => {
  const fs = require('fs')
  // const categories = require(`./client/content/category.json`).categories
  const hashtags = require(`./client/content/hashtag.json`).hashtags
  const authors = fs
    .readdirSync('./client/content/author')
    .map((file) => require(`./client/content/author/${file}`))
  const products = fs
    .readdirSync('./client/content/product')
    .map((file) => require(`./client/content/product/${file}`))

  return [
    ...authors
      .filter((author) => author._id)
      .map((author) => {
        return {
          route: `/user/${author._id}`,
          payload: { author },
        }
      }),
    ...products.map((product) => {
      return { route: `/plan/${product.uuid}`, payload: { product } }
    }),
    ...products.map((product) => {
      return { route: `/plan/${product.uuid}/thanks`, payload: { product } }
    }),
    ...hashtags.map((tag) => {
      return {
        route: `/tag/${tag.value}`,
        payload: {
          tag,
          products: products.filter((product) =>
            product.hashtags.map((h) => h.value).find((h) => h === tag.value)
          ),
        },
      }
    }),
  ]
}

export default {
  env: {
    baseUrl: process.env.BASE_URL || `/`,
    disqusShortname: process.env.DISQUS_SHORTNAME || ``,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ``,
  },

  srcDir: 'client/',

  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  // mode: 'universal',

  target: 'static',

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s | スクスク（SucSuc）',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'スクスク（SucSuc）',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: '',
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: `${process.env.BASE_URL}logo-icon-512x512.png`,
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'cms-config-url', type: 'text/yaml', href: '/admin/config.yml' },
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/fontawesome',
    '~/plugins/disqus',
    '~/plugins/vee-validate',
    { src: '~/plugins/netlify-identity-widget.ts', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    '@nuxtjs/sitemap',
    '@nuxtjs/dayjs',
    '@nuxtjs/toast',
    'portal-vue/nuxt',
    ...modules,
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL || `/`,
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ['vee-validate/dist/rules'],
  },

  markdownit: {
    injected: true,
  },

  generate: {
    subFolders: false,
    routes() {
      return generateRoute()
    },
  },
  render: {
    fallback: false,
  },
  loading: '~/components/molecules/Loading.vue',
  sitemap: {
    hostname: process.env.BASE_URL || `http://localhost:3000/`,
    lastmod: '2020-11-03',
    sitemaps: [
      {
        path: '/sitemap.xml',
        routes() {
          return generateRoute().map((r) => r.route).filter((r) => !r.match(/.*thanks$/))
        },
        exclude: ['/mypage', '/admin', '/contact', '/contact/thanks'],
        gzip: true,
      },
    ],
  },
  dayjs: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja',
  },
  toast: {
    position: 'top-center',
    duration: 3000,
    register: []
  },
  ...options,
}
