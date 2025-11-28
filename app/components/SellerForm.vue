<template>
  <v-card max-width="900" class="mx-auto">
    <v-card-title>Daftar Toko (3 langkah)</v-card-title>

    <v-card-text>
      <VStepper v-model="step" show-actions class="mx-auto pa-4">
        <div class="d-flex align-center justify-center mb-4">
          <v-chip v-for="(label, i) in ['Informasi Toko','Alamat PIC','Dokumen']" :key="i" :color="step === i+1 ? 'primary' : undefined" class="ma-1">
            {{ i+1 }}. {{ label }}
          </v-chip>
        </div>

        <div v-if="step === 1" max-width="pa-4">
          <v-form ref="form1" lazy-validation class="w-75 mx-auto">
            <VTextField v-model="form.nama_toko" variant="outlined" label="Nama Toko" required />
            <VTextField v-model="form.deskripsi_singkat" variant="outlined" label="Deskripsi Singkat" />
            <VTextField v-model="form.nama_pic" variant="outlined" label="Nama Lengkap PIC" required />
            <VTextField v-model="form.no_hp_pic" variant="outlined" label="No Handphone PIC" required />
            <VTextField v-model="form.email_pic" variant="outlined" label="Email PIC" required />
            <VTextField v-model="form.password" variant="outlined" label="Password" type="password" required />
          </v-form>
        </div>

        <div v-else-if="step === 2">
          <v-form ref="form2" lazy-validation>
            <VSelect v-model="selectedProvince" 
              :items="provinces" 
              item-title="name" 
              item-value="code" 
              label="Propinsi" 
              variant="outlined" 
            />
            <VSelect v-model="selectedCity" 
              :items="cities" 
              item-title="name" 
              item-value="code" 
              label="Kabupaten/Kota" 
              variant="outlined" 
            />
            <VSelect v-model="selectedDistrict" 
              :items="districts" 
              item-title="name" 
              item-value="code" 
              label="Kecamatan" 
              variant="outlined" 
            />
            <VSelect v-model="form.nama_kelurahan" 
              :items="villages" 
              item-title="name" 
              item-value="code" 
              label="Kelurahan" 
              variant="outlined" 
            />
            <v-row>
              <v-col cols="6">
                <VTextField v-model="form.rt" label="RT" variant="outlined" required />
              </v-col>
              <v-col cols="6">
                <VTextField v-model="form.rw" label="RW" variant="outlined" required />
              </v-col>
            </v-row>
            <VTextField v-model="form.alamat_pic" label="Alamat (Nama Jalan)" variant="outlined" required />
          </v-form>
        </div>

        <div v-else>
          <v-form ref="form3" lazy-validation>
            <v-text-field v-model="form.no_ktp_pic" label="No. KTP (16 Digit)" variant="outlined" counter="16" required />
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Region } from '~/types/region'
import { useRuntimeConfig } from '#app'

const step = ref<number>(1)
const loading = ref<boolean>(false)
const error = ref<string>('')
const successMessage = ref<string>('')
const router = useRouter()

const selectedProvince = ref<string | null>(null)
const selectedCity = ref<string | null>(null)
const selectedDistrict = ref<string | null>(null)

const provinces = ref<Region[]>([])
const cities = ref<Region[]>([])
const districts = ref<Region[]>([])
const villages = ref<Region[]>([])

const config = useRuntimeConfig()
const apiBase = config.public?.apiBase ?? '/api'

const fetchProvinces = async () => {
  const response = await $fetch<{ data: Region[] }>(`${apiBase}/api/region/provinces`)
  provinces.value = response.data
  console.log('fetched provinces:', provinces.value)
}

watch(selectedProvince, async (newCode) => {
  selectedCity.value = null
  cities.value = []
  if (newCode) {
    const res = await $fetch<{ data: Region[] }>(`${apiBase}/api/region/cities/${newCode}`)
    cities.value = res.data
  }
})

watch(selectedCity, async (newCode) => {
  selectedDistrict.value = null
  districts.value = []
  if (newCode) {
    const res = await $fetch<{ data: Region[] }>(`${apiBase}/api/region/districts/${newCode}`)
    districts.value = res.data
  }
})

watch(selectedDistrict, async (newCode) => {
  villages.value = []
  if (newCode) {
    const res = await $fetch<{ data: Region[] }>(`${apiBase}/api/region/villages/${newCode}`)
    villages.value = res.data
  }
})

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
    for (const [k, v] of Object.entries({
        ...form, propinsi: selectedProvince.value || '', 
        kabupaten_kota: selectedCity.value || '', 
        nama_kecamatan: selectedDistrict.value || ''})) {
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

onMounted(() => {
  fetchProvinces()
  console.log(provinces.value)
})
</script>