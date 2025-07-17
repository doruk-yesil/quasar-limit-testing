<script setup lang="ts">
import SummaryWidget from '../widgets/SummaryWidget.vue'
import BarChartWidget from '../widgets/BarChartWidget.vue'
import LineChartWidget from '../widgets/LineChartWidget.vue'
import PieChartWidget from '../widgets/PieChartWidget.vue'
import TableWidget from '../widgets/TableWidget.vue'
import KPIWidget from '../widgets/KPIWidget.vue'
import ActivityWidget from '../widgets/ActivityWidget.vue'
import TotalRevenueWidget from '../widgets/TotalRevenueWidget.vue'
import type { WidgetItem, WidgetType } from '../../types/widget'

defineProps<{ widget: WidgetItem }>()

const widgetMap: Record<WidgetType, any> = {
  summary: SummaryWidget,
  'bar-chart': BarChartWidget,
  'line-chart': LineChartWidget,
  'pie-chart': PieChartWidget,
  table: TableWidget,
  kpi: KPIWidget,
  activity: ActivityWidget,
  'total-revenue': TotalRevenueWidget,
  custom: SummaryWidget
}

const DefaultWidget = SummaryWidget
</script>

<template>
  <component :is="widgetMap[widget.type] || DefaultWidget" :widget="widget" />
</template>
