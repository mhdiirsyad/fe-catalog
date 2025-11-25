<template>
  <div class="pa-5">
    <h1>Dashboard Verifikasi Penjual</h1>
    <p>Daftar penjual baru yang menunggu persetujuan.</p>

    <v-table class="mt-5" hover>
      <thead>
        <tr>
          <th>Nama Toko</th>
          <th>Nama PIC</th>
          <th>Foto KTP</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="seller in pendingSellers" :key="seller.id">
          <td>{{ seller.store_name }}</td>
          <td>{{ seller.pic_name }}</td>
          <td>
            <v-btn size="small" color="info" variant="text" :href="getFileUrl(seller.pic_ktp_file_path)" target="_blank">
              Lihat File
            </v-btn>
          </td>
          <td>
            <v-chip color="warning">{{ seller.status }}</v-chip>
          </td>
          <td>
            <div class="d-flex gap-2">
              <v-btn size="small" color="success" class="mr-2" @click="verifySeller(seller.id, 'approve')">
                Setujui
              </v-btn>
              <v-btn size="small" color="error" @click="verifySeller(seller.id, 'reject')">
                Tolak
              </v-btn>
            </div>
          </td>
        </tr>
        <tr v-if="pendingSellers.length === 0">
          <td colspan="5" class="text-center">Tidak ada pendaftar baru.</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
const pendingSellers = ref([])
const token = useCookie('admin_token') // Ambil token yang disimpan saat login

// URL Backend untuk gambar
const backendUrl = 'http://127.0.0.1:8000/storage/'

// Helper buat link gambar
function getFileUrl(path) {
  return backendUrl + path
}

// 1. Fetch Data Pending saat halaman dibuka
async function fetchPendingSellers() {
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/sellers?status=PENDING', {
      headers: {
        Authorization: `Bearer ${token.value}` // Wajib bawa token!
      }
    })
    pendingSellers.value = response.data
  } catch (error) {
    console.error(error)
    if(error.response?.status === 401) {
        alert("Sesi habis, silakan login ulang")
        navigateTo('/admin/login')
    }
  }
}

// 2. Fungsi Approve / Reject
async function verifySeller(id, action) {
  if (!confirm(`Yakin ingin me-${action} toko ini?`)) return

  try {
    // Action bisa 'approve' atau 'reject' sesuai nama route di API
    await $fetch(`http://127.0.0.1:8000/api/sellers/${id}/${action}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    alert(`Berhasil di-${action}!`)
    
    // Refresh tabel
    fetchPendingSellers()

  } catch (error) {
    alert('Gagal memproses: ' + (error.data?.message || error.message))
  }
}

// Jalankan fetch saat komponen dipasang
onMounted(() => {
  if(!token.value) {
      navigateTo('/admin/login')
  } else {
      fetchPendingSellers()
  }
})
</script>