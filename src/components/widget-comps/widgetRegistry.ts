import SummaryWidget from '../widgets/SummaryWidget.vue'
import BarChartWidget from '../widgets/BarChartWidget.vue'
import LineChartWidget from '../widgets/LineChartWidget.vue'
import PieChartWidget from '../widgets/PieChartWidget.vue'
import TableWidget from '../widgets/TableWidget.vue'
import KPIWidget from '../widgets/KPIWidget.vue'
import ActivityWidget from '../widgets/ActivityWidget.vue'
import TotalRevenueWidget from '../widgets/TotalRevenueWidget.vue'

export const widgetMap = {
  summary: SummaryWidget,
  'bar-chart': BarChartWidget,
  'line-chart': LineChartWidget,
  'pie-chart': PieChartWidget,
  table: TableWidget,
  kpi: KPIWidget,
  activity: ActivityWidget,
  'total-revenue': TotalRevenueWidget
} as const

export type WidgetType = keyof typeof widgetMap

export interface WidgetItem {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  visible:boolean
  type: WidgetType
  props?: Record<string, any>
}