// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],
  runtimeConfig: {
    public: {
      apiBase: (globalThis as any).process?.env?.API_BASE ?? 'http://localhost:8000'
    }
  }
  ,
  vite: {
    server: {
      proxy: {
        '/api': {
          target: (globalThis as any).process?.env?.API_BASE ?? 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
