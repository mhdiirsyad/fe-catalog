<template>
  <div class="d-flex justify-center align-center" style="height: 100vh; background-color: #f5f5f5;">
    <v-card width="400" class="pa-5">
      <v-card-title class="text-center">Login Admin Platform</v-card-title>
      <v-card-text>
        <v-text-field label="Email" v-model="email" type="email"></v-text-field>
        <v-text-field label="Password" v-model="password" type="password"></v-text-field>
        <v-btn color="primary" block @click="handleLogin" :loading="isLoading">Masuk</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
const router = useRouter()
const email = ref('admin@katalog.com') // Default biar cepat tes
const password = ref('password123')
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  try {
    // Tembak API Login Admin
    const response = await $fetch('http://127.0.0.1:8000/api/admin/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    // Simpan Token (Bisa pakai Cookie atau LocalStorage)
    // Kita pakai useCookie bawaan Nuxt biar gampang
    const token = useCookie('admin_token')
    token.value = response.token

    alert('Login Berhasil!')
    
    // Pindah ke Dashboard
    router.push('/admin/dashboard')

  } catch (error) {
    alert('Login Gagal: ' + (error.data?.message || error.message))
  } finally {
    isLoading.value = false
  }
}
</script>