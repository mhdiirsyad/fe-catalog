<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1>Sellers</h1>
      <nuxt-link to="/sellers/create">
        <v-btn color="primary">Daftar Toko</v-btn>
      </nuxt-link>
    </div>

    <v-row>
      <v-col cols="12" md="6" v-for="seller in sellers" :key="seller.id">
        <v-card>
          <v-card-title>{{ seller.store_name }}</v-card-title>
          <v-card-subtitle>PIC: {{ seller.pic_name }} — {{ seller.pic_phone }}</v-card-subtitle>
          <v-card-text>
            <div>{{ seller.store_description }}</div>
            <div class="mt-2">Status: <strong>{{ seller.status }}</strong></div>
          </v-card-text>
          <v-card-actions>
            <nuxt-link :to="`/sellers/${seller.id}`"><v-btn text>Detail</v-btn></nuxt-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="error" class="mt-4 text-danger">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Seller } from '~/types/seller'
const sellers = ref<Seller[]>([])
const error = ref('')

async function load() {
  try {
    const { data } = await useFetch<Seller[]>('/api/sellers')
    sellers.value = data.value ?? []
  } catch (e) {
    error.value = 'Gagal memuat sellers.'
  }
}

load()
</script>
