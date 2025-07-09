<script setup lang="ts">
import SummaryWidget from './widgets/SummaryWidget.vue'
import BarChartWidget from './widgets/BarChartWidget.vue'
import type { WidgetItem, WidgetType } from '../types/widget'

defineProps<{ widget: WidgetItem }>()

function getComponent(type: WidgetType) {
  switch (type) {
    case 'summary':
      return SummaryWidget
    case 'bar-chart':
      return BarChartWidget
    default:
      return SummaryWidget
  }
}
</script>

<template>
  <component :is="getComponent(widget.type)" :widget="widget" />
</template>
