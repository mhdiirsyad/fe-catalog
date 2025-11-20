<template>
  <v-card max-width="900" class="mx-auto">
    <v-card-title>Daftar Toko (3 langkah)</v-card-title>

    <v-card-text>
      <v-stepper v-model="step" vertical>
        <v-stepper-header>
          <v-stepper-step :complete="step>1" step="1">Informasi Toko</v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="step>2" step="2">Alamat PIC</v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="step>3" step="3">Dokumen</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="form1" lazy-validation>
              <v-text-field v-model="form.store_name" label="Store Name" required />
              <v-text-field v-model="form.store_description" label="Store Description" />
              <v-text-field v-model="form.pic_name" label="PIC Name" required />
              <v-text-field v-model="form.pic_phone" label="PIC Phone" required />
              <v-text-field v-model="form.pic_email" label="PIC Email" required />
              <v-text-field v-model="form.password" label="Password" type="password" required />
            </v-form>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="nextStep">Next</v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-form ref="form2" lazy-validation>
              <v-text-field v-model="form.pic_street" label="Street" required />
              <v-text-field v-model="form.pic_RT" label="RT" required />
              <v-text-field v-model="form.pic_RW" label="RW" required />
              <v-text-field v-model="form.pic_village" label="Village" required />
              <v-text-field v-model="form.pic_city" label="City" required />
              <v-text-field v-model="form.pic_province" label="Province" required />
            </v-form>
            <v-card-actions>
              <v-btn text @click="prevStep">Back</v-btn>
              <v-spacer />
              <v-btn color="primary" @click="nextStep">Next</v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-form ref="form3" lazy-validation>
              <v-text-field v-model="form.pic_ktp_number" label="KTP Number" required />
              <v-file-input v-model="files.ktp" label="Upload KTP (pdf/jpg)" accept="application/pdf,image/*" show-size />
              <v-file-input v-model="files.photo" label="Upload Photo (jpg/png)" accept="image/*" show-size />
            </v-form>
            <v-card-actions>
              <v-btn text @click="prevStep">Back</v-btn>
              <v-spacer />
              <v-btn :loading="loading" color="success" @click="submit">Submit</v-btn>
            </v-card-actions>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { SellerInput } from '~/types/seller'

const step = ref(1)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const router = useRouter()

const form = reactive<SellerInput>({
  store_name: '',
  store_description: '',
  pic_name: '',
  pic_phone: '',
  pic_email: '',
  password: '',
  pic_street: '',
  pic_RT: 0,
  pic_RW: 0,
  pic_village: '',
  pic_city: '',
  pic_province: '',
  pic_ktp_number: '',
})

const files = reactive({ ktp: null, photo: null })

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
  try {
    const body = new FormData()
    // append text fields
    Object.keys(form).forEach([(k, v)] => {
      body.append(k, form[k] ?? '')
    })

    // append files if present
    if (files.ktp && files.ktp.length) {
      body.append('pic_ktp_file_path', files.ktp[0])
    }
    if (files.photo && files.photo.length) {
      body.append('pic_photo_path', files.photo[0])
    }

    // POST to backend. Assumes same origin or proxy to /api
    const res = await $fetch('/api/sellers', {
      method: 'POST',
      body,
    })

    successMessage.value = 'Pendaftaran berhasil. Menunggu persetujuan admin.'
    // optionally redirect to sellers list after short delay
    setTimeout(() => router.push('/sellers'), 1200)
  } catch (e) {
    console.error(e)
    if (e?.data?.message) error.value = e.data.message
    else error.value = 'Gagal mendaftar seller. Cek data dan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
