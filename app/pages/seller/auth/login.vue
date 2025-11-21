<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="pa-4">
          <v-card-title>Seller Login</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="onSubmit">
              <v-text-field v-model="identifier" label="Email or Phone" required />
              <v-text-field v-model="password" label="Password" type="password" required />
              <v-btn :loading="loading" color="primary" class="mt-4" @click="onSubmit">Login</v-btn>
            </v-form>
            <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSellerAuth } from '~/composables/useSellerAuth'

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const { login } = useSellerAuth()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const res = await login({ identifier: identifier.value, password: password.value, device: 'nuxt-client' })
    // success -> redirect to seller dashboard or waiting page
    router.push('/seller')
  } catch (e: any) {
    console.error(e)
    if (e?.data?.message) error.value = e.data.message
    else error.value = 'Login failed. Check credentials.'
  } finally {
    loading.value = false
  }
}
</script>

