<template>
  <v-card max-width="900" class="mx-auto">
    <v-card-title>Daftar Toko (3 langkah)</v-card-title>

    <v-card-text>
      <VStepper v-model="step" show-actions>
        <!-- header: simple, version-agnostic step indicators -->
        <div class="d-flex align-center mb-4">
          <v-chip v-for="(label, i) in ['Informasi Toko','Alamat PIC','Dokumen']" :key="i" :color="step === i+1 ? 'primary' : undefined" class="ma-1">
            {{ i+1 }}. {{ label }}
          </v-chip>
        </div>

        <!-- content: render conditionally per step for compatibility -->
        <div v-if="step === 1">
          <v-form ref="form1" lazy-validation>
            <v-text-field v-model="form.store_name" label="Store Name" required />
            <v-text-field v-model="form.store_description" label="Store Description" />
            <v-text-field v-model="form.pic_name" label="PIC Name" required />
            <v-text-field v-model="form.pic_phone" label="PIC Phone" required />
            <v-text-field v-model="form.pic_email" label="PIC Email" required />
            <v-text-field v-model="form.password" label="Password" type="password" required />
          </v-form>
        </div>

        <div v-else-if="step === 2">
          <v-form ref="form2" lazy-validation>
            <v-text-field v-model="form.pic_street" label="Street" required />
            <v-text-field v-model="form.pic_RT" label="RT" required />
            <v-text-field v-model="form.pic_RW" label="RW" required />
            <v-text-field v-model="form.pic_village" label="Village" required />
            <v-text-field v-model="form.pic_city" label="City" required />
            <v-text-field v-model="form.pic_province" label="Province" required />
          </v-form>
        </div>

        <div v-else>
          <v-form ref="form3" lazy-validation>
            <v-text-field v-model="form.pic_ktp_number" label="KTP Number" required />
            <v-file-input v-model="files.ktp" label="Upload KTP (pdf/jpg)" accept="application/pdf,image/*" show-size />
            <v-file-input v-model="files.photo" label="Upload Photo (jpg/png)" accept="image/*" show-size />
          </v-form>
        </div>

        <!-- actions: keep custom final button -->
        <div class="d-flex mt-4">
          <v-btn text @click="prevStep" :disabled="step === 1">Back</v-btn>
          <v-spacer />
          <template v-if="step < 3">
            <v-btn color="primary" @click="nextStep">Next</v-btn>
          </template>
          <template v-else>
            <v-btn color="success" large elevation="6" :loading="loading" :disabled="loading" @click="submit">
              <v-icon left>mdi-check</v-icon>
              Submit Registration
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

  const form = reactive<Record<string, string>>({
    store_name: '',
    store_description: '',
    pic_name: '',
    pic_phone: '',
    pic_email: '',
    password: '',
    pic_street: '',
    pic_RT: '',
    pic_RW: '',
    pic_village: '',
    pic_city: '',
    pic_province: '',
    pic_ktp_number: '',
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
      // append text fields using for..of to satisfy TS
      for (const [k, v] of Object.entries(form)) {
        body.append(k, v == null ? '' : String(v))
      }

      // append files if present
      if (files.ktp instanceof File) body.append('pic_ktp_file_path', files.ktp)
      if (files.photo instanceof File) body.append('pic_photo_path', files.photo)

      await $fetch('/api/sellers', {
        method: 'POST',
        body,
        headers: {
          Accept: 'application/json',
        },
      })

      successMessage.value = 'Pendaftaran berhasil. Menunggu persetujuan admin.'
      setTimeout(() => router.push('/seller/waitingApproval'), 1200)
    } catch (e: any) {
      console.error('submit error', e)
      // handle validation errors from Laravel
      const msgFromData = e?.data?.message || e?.data?.error || null
      if (e?.data?.errors) {
        // join field errors
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
