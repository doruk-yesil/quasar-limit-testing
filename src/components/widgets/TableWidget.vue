<template>
  <div class="widget-card">📊 Table Widget (Dummy Table)</div>
</template>

<script setup lang="ts">
defineProps<{ widget: any }>()
</script>

<style scoped>
.widget-card {
  padding: 20px;
  font-size: 18px;
  text-align: center;
}
</style>
