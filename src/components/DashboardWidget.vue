<script setup lang="ts">
import { defineProps } from 'vue'
import { QCard, QCardSection } from 'quasar'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <q-card class="bg-grey-1 q-pa-sm full-height" flat bordered>
    <q-card-section class="text-subtitle1 text-bold q-pb-sm">
      {{ title }}
    </q-card-section>
    <q-card-section class="q-pt-none">
      <slot />
    </q-card-section>
  </q-card>
</template>
