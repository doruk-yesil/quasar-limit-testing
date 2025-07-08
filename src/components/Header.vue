<script setup lang="ts">
import { useRouter } from 'vue-router'
import { QBtn } from 'quasar'
const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="row items-center q-mb-md">
    <q-btn flat icon="arrow_back" label="Back to HomePage" @click="goHome" />
  </div>
</template>