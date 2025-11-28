<script lang="ts" setup>
const config = useRuntimeConfig()
const apiBase = config.public?.apiBase ?? '/api'
const router = useRouter()
const product = reactive({
  name: '',
  description: '',
  price: 0,
  image: null as File | null,
})

function getCookie(name: string) {
  if (typeof window === 'undefined') return null
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return v ? v.pop() || null : null
}

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', product.price.toString())
    if (product.image) {
      formData.append('image', product.image)
    }

    // Di dalam submitForm pada komponen produk Anda:

const token = useSellerAuth().getToken()

if (token) {
    // Ini adalah satu-satunya logika yang seharusnya dijalankan
    await $fetch(`${apiBase}/api/products`, {
        method: 'POST',
        body: formData,
        headers: {
            // Mengirim token yang tersimpan di localStorage
            Authorization: `Bearer ${token}`, 
            // Header Content-Type untuk FormData akan diatur otomatis oleh browser
        },
        // JANGAN gunakan credentials: 'include' karena ini adalah token-based, bukan cookie-based.
    })
} else {
    // Jika tidak ada token (belum login), langsung redirect ke login
    router.push('/seller/login') 
}

    router.push('/seller')
  } catch (error) {
    console.error('Error creating product:', error)
  }
}

</script>

<template>
    <div>
        <h1 class="mb-4">Buat Produk Baru</h1>
        <v-form @submit.prevent="submitForm">
            <v-text-field v-model="product.name" label="Nama Produk" variant="outlined" aria-required="true" />
            <v-textarea v-model="product.description" label="Deskripsi Produk" variant="outlined" aria-required="true" />
            <v-text-field v-model="product.price" label="Harga Produk" variant="outlined" aria-required="true" />
            <v-file-input v-model="product.image" label="Upload Gambar Produk" accept="image/*" show-size />
            <v-btn color="primary" class="mt-4" type="submit">Simpan Produk</v-btn>
        </v-form>
    </div>
</template>