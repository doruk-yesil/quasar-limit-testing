<template>
  <div class="widget-card">📌 KPI: {{ widget.name }}</div>
</template>

<script setup lang="ts">
defineProps<{ widget: any }>()
</script>

<style scoped>
.widget-card {
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
