<script setup lang="ts">
defineProps<{ widget: any }>()
</script>

<template>
  <div class="widget-card">
    <div class="text-h6">{{ widget.name }}</div>
    <div class="text-h5 text-weight-bold text-green-10">
      {{ Math.floor(Math.random() * 100000)}}
    </div>
    <div class="text-caption text-grey-6">Bu ay</div>
  </div>
</template>

<style scoped>
.widget-card {
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
