/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        twitter: '#1DA1F2',
        facebook: '#4267B2',
        brand: '#44bb87',
      },
    },
  },
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'client/components/**/*.vue',
      'client/elements/**/*.vue',
      'client/layouts/**/*.vue',
      'client/pages/**/*.vue',
      'client/plugins/**/*.js',
      'nuxt.config.js',
    ],
  },
}
