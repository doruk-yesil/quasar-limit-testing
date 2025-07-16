<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
import type { WidgetItem } from '../../types/widget'

defineProps<{
  widget: WidgetItem
}>()

const dummyData = [60, 120, 90, 180, 75, 140, 100]
</script>

<template>
  <Widget :widget="widget" title="Bar Grafik">
    <div class="bar-chart-placeholder">
      <div
        v-for="(value, index) in dummyData"
        :key="index"
        class="bar"
        :style="{ height: `${value}px` }"
      />
    </div>
  </Widget>
</template>

<style scoped>
.bar-chart-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 10px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.bar {
  width: 25px;
  background-color: #09898d;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}
</style>
