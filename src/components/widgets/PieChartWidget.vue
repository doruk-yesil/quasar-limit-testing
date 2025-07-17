<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'

const rawData = [
  { label: 'Gelir', value: 40, color: '#09898d' },
  { label: 'Gider', value: 30, color: '#f2a900' },
  { label: 'Kâr', value: 30, color: '#e53935' }
]

const segments = rawData.map((data, index) => {
  const offset = rawData.slice(0, index).reduce((sum, d) => sum + d.value, 0)
  return {
    ...data,
    offset: 25 - (offset / 100) * 100
  }
})
</script>

<template>
  <Widget title="Dağılım">
    <div class="pie-chart">
      <svg viewBox="0 0 32 32" class="donut">
        <circle
          v-for="(segment, index) in segments"
          :key="index"
          class="donut-segment"
          :stroke="segment.color"
          stroke-width="8"
          fill="transparent"
          r="16"
          cx="16"
          cy="16"
          :stroke-dasharray="`${segment.value} ${100 - segment.value}`"
          :stroke-dashoffset="segment.offset"
        />
      </svg>
    </div>
    <div class="q-mt-sm text-caption text-center text-grey">
      Gelir: %40 • Gider: %30 • Kâr: %30
    </div>
  </Widget>
</template>

<style scoped>
.pie-chart {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.donut {
  width: 150px;
  height: 150px;
  transform: rotate(-90deg);
}
.donut-segment {
  stroke-linecap: round;
}
</style>
