<script setup lang="ts">
import type { WidgetItem } from '../../types/widget'

defineProps<{ widget: WidgetItem }>()
</script>

<template>
  <div class="widget-box">
    <div class="title">{{ widget.title }}</div>
    <div class="value">$123,456</div>
  </div>
</template>

<style scoped>
.widget-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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