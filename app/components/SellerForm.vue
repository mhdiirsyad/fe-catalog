<template>
  <v-card max-width="900" class="mx-auto">
    <v-card-title>Daftar Toko (3 langkah)</v-card-title>

    <v-card-text>
      <VStepper v-model="step" show-actions>
        <div class="d-flex align-center mb-4">
          <v-chip v-for="(label, i) in ['Informasi Toko','Alamat PIC','Dokumen']" :key="i" :color="step === i+1 ? 'primary' : undefined" class="ma-1">
            {{ i+1 }}. {{ label }}
          </v-chip>
        </div>

        <div v-if="step === 1">
          <v-form ref="form1" lazy-validation>
            <v-text-field v-model="form.nama_toko" label="Nama Toko" required />
            <v-text-field v-model="form.deskripsi_singkat" label="Deskripsi Singkat" />
            <v-text-field v-model="form.nama_pic" label="Nama Lengkap PIC" required />
            <v-text-field v-model="form.no_hp_pic" label="No Handphone PIC" required />
            <v-text-field v-model="form.email_pic" label="Email PIC" required />
            <v-text-field v-model="form.password" label="Password" type="password" required />
          </v-form>
        </div>

        <div v-else-if="step === 2">
          <v-form ref="form2" lazy-validation>
            <v-text-field v-model="form.alamat_pic" label="Alamat (Nama Jalan)" required />
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="form.rt" label="RT" required />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.rw" label="RW" required />
              </v-col>
            </v-row>
            <v-text-field v-model="form.nama_kelurahan" label="Kelurahan" required />
            <v-text-field v-model="form.nama_kecamatan" label="Kecamatan" required />
            <v-text-field v-model="form.kabupaten_kota" label="Kabupaten/Kota" required />
            <v-text-field v-model="form.propinsi" label="Propinsi" required />
          </v-form>
        </div>

        <div v-else>
          <v-form ref="form3" lazy-validation>
            <v-text-field v-model="form.no_ktp_pic" label="No. KTP (16 Digit)" counter="16" required />
            <v-file-input v-model="files.ktp" label="Upload KTP (pdf/jpg)" accept="application/pdf,image/*" show-size />
            <v-file-input v-model="files.photo" label="Upload Foto Diri (jpg/png)" accept="image/*" show-size />
          </v-form>
        </div>

        <div class="d-flex mt-4">
          <v-btn text @click="prevStep" :disabled="step === 1">Kembali</v-btn>
          <v-spacer />
          <template v-if="step < 3">
            <v-btn color="primary" @click="nextStep">Lanjut</v-btn>
          </template>
          <template v-else>
            <v-btn color="success" large elevation="6" :loading="loading" :disabled="loading" @click="submit">
              <v-icon left>mdi-check</v-icon>
              Daftar Sekarang
            </v-btn>
          </template>
        </div>
      </VStepper>

      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const step = ref<number>(1)
const loading = ref<boolean>(false)
const error = ref<string>('')
const successMessage = ref<string>('')
const router = useRouter()

// Form Data menggunakan Key Bahasa Indonesia (Sesuai Backend)
const form = reactive<Record<string, string>>({
  nama_toko: '',
  deskripsi_singkat: '',
  nama_pic: '',
  no_hp_pic: '',
  email_pic: '',
  password: '',
  
  alamat_pic: '',
  rt: '',
  rw: '',
  nama_kelurahan: '',
  nama_kecamatan: '', // Tambahan Baru
  kabupaten_kota: '',
  propinsi: '',
  
  no_ktp_pic: '',
})

const files = reactive<{ ktp: File | null; photo: File | null }>({ ktp: null, photo: null })

function nextStep() {
  error.value = ''
  if (step.value < 3) step.value++
}

function prevStep() {
  error.value = ''
  if (step.value > 1) step.value--
}

async function submit() {
  error.value = ''
  successMessage.value = ''
  loading.value = true
  console.log('Submitting form with data:', form, files)

  try {
    const body = new FormData()
    
    // Append semua text field otomatis
    for (const [k, v] of Object.entries(form)) {
      body.append(k, v == null ? '' : String(v))
    }

    // Append File dengan nama key Indonesia yang benar
    if (files.ktp instanceof File) body.append('file_ktp_pic', files.ktp)
    if (files.photo instanceof File) body.append('foto_pic', files.photo)

    // Kirim ke API
    await $fetch('http://127.0.0.1:8000/api/sellers', {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
      },
    })

    successMessage.value = 'Pendaftaran berhasil. Menunggu persetujuan admin.'
    setTimeout(() => router.push('/seller/auth/login'), 2000) // Redirect ke login setelah daftar
  } catch (e: any) {
    console.error('submit error', e)
    // Handle error validation dari Laravel
    const msgFromData = e?.data?.message || e?.data?.error || null
    if (e?.data?.errors) {
      // Gabungkan pesan error field
      const list = Object.values(e.data.errors).flat().slice(0, 5)
      error.value = list.join('; ')
    } else if (msgFromData) {
      error.value = msgFromData
    } else {
      error.value = 'Gagal mendaftar seller. Cek data dan coba lagi.'
    }
  } finally {
    loading.value = false
  }
}
</script>