import '@mdi/font/css/materialdesignicons.css'

// @ts-ignore: no type declarations available for 'vuetify/styles'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'

// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    }
  }
} as any)