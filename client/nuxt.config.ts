import { Configuration } from '@nuxt/types'
import colors from 'vuetify/es5/util/colors'
import { Auth } from 'nuxtjs__auth'

const baseURL =
  process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'server:5000'

const nuxtConfig: Configuration = {
  mode: 'universal', // 'spa',
  server: {
    port: 7300,
    host: '0.0.0.0'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/common.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/axios-accessor', '@/plugins/getter', '@/plugins/filter'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  proxy: {
    '/api/v1/': {
      target: `http://${baseURL}/api/v1`,
      pathRewrite: { '^/api/v1/': '/' }
    },
    '/shots/': {
      target: `http://${baseURL}/static`,
      pathRewrite: { '^/shots/': '/' }
    }
  },
  router: { middleware: ['auth', 'redirect'] },
  auth: {
    cookie: false,
    redirect: {
      login: '/login', // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
      logout: '/login', // ログアウト時のリダイレクトURL
      callback: false, // Oauth認証等で必要となる コールバックルート
      home: '/bookmarks/h-0' // ログイン後のリダイレクトURL
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/v1/auth/login',
            method: 'post',
            propertyName: ''
          },
          logout: false,
          user: {
            url: '/api/v1/auth/user',
            method: 'get',
            propertyName: ''
          }
        }
        // tokenRequired: true,
        // tokenType: 'bearer'
      }
    },
    vuex: false
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      default: 'dark',
      disable: false,
      options: {},
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          darker: '#303030',
          darkest: '#2b2b2b'
        },

        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.darken1,
          success: colors.green.accent3,
          darker: '#303030',
          darkest: '#2b2b2b'
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    },
    extend(config, { isClient }) {
      if (isClient) config.devtool = '#source-map'
    }
  },
  srcDir: 'src'
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
    // $axios: NuxtAxiosInstance
  }
}
module.exports = nuxtConfig
