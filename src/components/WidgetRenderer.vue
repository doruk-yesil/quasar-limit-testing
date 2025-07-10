<script setup lang="ts">
import SummaryWidget from './widgets/SummaryWidget.vue'
import BarChartWidget from './widgets/BarChartWidget.vue'
import LineChartWidget from './widgets/LineChartWidget.vue'
import PieChartWidget from './widgets/PieChartWidget.vue'
import TableWidget from './widgets/TableWidget.vue'
import KPIWidget from './widgets/KPIWidget.vue'
import ActivityWidget from './widgets/ActivityWidget.vue'
import type { WidgetItem, WidgetType } from '../types/widget'

defineProps<{ widget: WidgetItem }>()

function getComponent(type: WidgetType) {
  switch (type) {
    case 'summary':
      return SummaryWidget
    case 'bar-chart':
      return BarChartWidget
    case 'line-chart':
      return LineChartWidget
    case 'pie-chart':
      return PieChartWidget
    case 'table':
      return TableWidget
    case 'kpi':
      return KPIWidget
    case 'activity':
      return ActivityWidget
    default:
      return SummaryWidget
  }
}

</script>

<template>
  <component :is="getComponent(widget.type)" :widget="widget" />
</template>
