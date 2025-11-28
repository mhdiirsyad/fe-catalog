<template>
  <div>
    <h1>Dashboard Seller</h1>
    <v-btn color="primary" @click="handleLogout">Logout</v-btn>
    <v-btn color="primary" class="mt-4" @click="router.push('/seller/product/create')">Buat Produk Baru</v-btn>
    <div class="mt-4">
      <h2>Produk Saya</h2>
      <v-card class="pa-4">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product.id">
              <v-card>
                <v-img :src="product.image_url" height="200px"></v-img>
                <v-card-title>{{ product.name }}</v-card-title>
                <v-card-subtitle>Rp {{ product.price }}</v-card-subtitle>
                <v-card-text>{{ product.description }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- Daftar produk seller akan ditampilkan di sini -->
    </div>

    <!-- <div v-if="error" class="mt-4 text-danger">{{ error }}</div> -->
  </div>
</template>

<script setup lang="ts">
import type { product } from '~/types/product';

const {logout} = useSellerAuth();
const router = useRouter();

const error = ref<string | null>(null);
const products = ref<product[]>([]);

const fetchProducts = async () => {
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public?.apiBase ?? '/api'
    const response = await $fetch<{data: product[]}>(`${apiBase}/api/products`, {
      method: 'GET',
    });
    products.value = response.data;
  } catch (e) {
    console.error('Failed to fetch products', e);
    error.value = 'Gagal memuat produk.';
  }
};

onMounted(() => {
  fetchProducts();
});

const handleLogout = async () => {
  try {
    await logout();
    // redirect to home or login page
    router.push('/seller/auth/login');
  } catch (e) {
    console.error('Logout failed', e);
  }
};
</script>
