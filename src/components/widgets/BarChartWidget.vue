<template>
  <div class="widget-box">
    <div class="title">{{ widget.title }}</div>
    <div class="chart-placeholder">[Bar Chart Placeholder]</div>
  </div>
</template>

<script setup lang="ts">
import type { WidgetItem } from '../../types/widget'

defineProps<{ widget: WidgetItem }>()
</script>

<style scoped>
.widget-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-weight: bold;
  color: #09898d;
  margin-bottom: 8px;
}

.chart-placeholder {
  flex-grow: 1;
  background-color: #eef3f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
