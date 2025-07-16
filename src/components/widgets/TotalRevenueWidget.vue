<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'

defineProps<{ widget: any }>()
</script>

<template>
  <Widget :widget="widget" title="Toplam Gelir">
    <div class="text-h5 q-mt-sm text-weight-bold">₺184,000</div>
    <div class="text-caption text-grey-7 q-mt-xs">Bu ayın toplamı</div>
  </Widget>
</template>

<style scoped>
</style>
