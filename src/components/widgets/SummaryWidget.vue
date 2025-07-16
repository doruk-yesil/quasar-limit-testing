<script setup lang="ts">
import type { WidgetItem } from '../../types/widget'

defineProps<{ widget: WidgetItem }>()
</script>

<template>
  <div class="widget-box">
    <div class="title">{{ widget.name }}</div>
    <div class="value">$123,456</div>
  </div>
</template>

<style scoped>
.widget-box {
  background: white;
  border-radius: 8px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-weight: bold;
  color: #09898d;
  margin-bottom: 8px;
}

.value {
  font-size: 20px;
}
</style>