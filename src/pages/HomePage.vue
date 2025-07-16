<script setup lang="ts">
import { useRouter } from 'vue-router'
import { QBtn } from 'quasar'

const router = useRouter()
</script>

<template>
  <div class="q-pa-md text-center">
    <h4 class="text-h5 q-mb-md">My Demo</h4>

    <div class="q-gutter-sm q-mb-md">
      <q-btn label="Dashboard" color="primary" @click="router.push('/dashboard')" />
      <q-btn label="Dashboard wo/ lib" color="info" @click="router.push('/dashboard2')" />
      <q-btn label="Dashboard w/ comp" color="warning" @click="router.push('/dashboard3')" />
      <q-btn label="Grid" color="secondary" @click="router.push('/grid')" />
    </div>
  </div>
</template>
