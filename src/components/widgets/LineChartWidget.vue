<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
import type { WidgetItem } from '../../types/widget'
import { computed } from 'vue'

defineProps<{
  widget: WidgetItem
}>()

const data = [50, 20, 60, 30, 80, 40, 70]

const pointList = computed(() => {
  const step = 300 / (data.length - 1)
  return data.map((y, i) => [i * step, 100 - y])
})

const points = computed(() => pointList.value.map(p => p.join(',')).join(' '))
</script>

<template>
  <Widget :widget="widget" :title="widget.name">
    <div class="line-chart">
      <svg viewBox="0 0 300 100" preserveAspectRatio="none">
        <polyline
          :points="points"
          fill="none"
          stroke="#09898d"
          stroke-width="3"
        />
        <circle
          v-for="(p, i) in pointList"
          :key="i"
          :cx="p[0]"
          :cy="p[1]"
          r="4"
          fill="#09898d"
        />
      </svg>
    </div>
  </Widget>
</template>

<style scoped>
.line-chart {
  width: 100%;
  height: 150px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 10px;
}
svg {
  width: 100%;
  height: 100%;
}
</style>
