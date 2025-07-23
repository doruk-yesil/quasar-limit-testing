import SummaryWidget from '../widgets/SummaryWidget.vue'
import BarChartWidget from '../widgets/BarChartWidget.vue'
import LineChartWidget from '../widgets/LineChartWidget.vue'
import PieChartWidget from '../widgets/PieChartWidget.vue'
import TableWidget from '../widgets/TableWidget.vue'
import KPIWidget from '../widgets/KPIWidget.vue'
import ActivityWidget from '../widgets/ActivityWidget.vue'
import TotalRevenueWidget from '../widgets/TotalRevenueWidget.vue'
import BirthdayWidget from '../widgets/BirthdayWidget.vue'
import LatestNewsWidget from '../widgets/LatestNewsWidget.vue'
import ForexWidget from '../widgets/ForexWidget.vue'

export const widgetMap = {
  summary: SummaryWidget,
  'bar-chart': BarChartWidget,
  'line-chart': LineChartWidget,
  'pie-chart': PieChartWidget,
  table: TableWidget,
  kpi: KPIWidget,
  activity: ActivityWidget,
  'total-revenue': TotalRevenueWidget,
  birthday: BirthdayWidget,
  news: LatestNewsWidget,
  forex: ForexWidget
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
  size: 'sm' | 'md' | 'lg' | 'custom'
  minW?: number
  minH?: number
  locked?: boolean
  props?: Record<string, any>
}

export const initialWidgetState: WidgetItem[] = [
  { id: '1', name: 'Gelir Kartı', x: 0, y: 0, w: 3, h: 3, visible: false, size: 'custom', type: 'summary' },
  { id: '2', name: 'Bar Grafik', x: 3, y: 0, w: 3, h: 3, visible: false, size: 'custom', type: 'bar-chart' },
  { id: '3', name: 'Zaman Serisi', x: 6, y: 0, w: 4, h: 3, visible: true, size: 'custom', type: 'line-chart' },
  { id: '4', name: 'Dağılım Pasta', x: 10, y: 0, w: 2, h: 3, visible: true, size: 'custom', type: 'pie-chart' },
  { id: '5', name: 'Veri Tablosu', x: 0, y: 3, w: 6, h: 2, visible: true, size: 'custom', type: 'table' },
  { id: '6', name: 'Aktif Kullanıcı', x: 6, y: 3, w: 1, h: 2, visible: true, size: 'custom', type: 'kpi' },
  { id: '7', name: 'Yeni Kayıtlar', x: 7, y: 3, w: 1, h: 2, visible: true, size: 'custom', type: 'kpi' },
  { id: '8', name: 'Ziyaret Süresi', x: 8, y: 3, w: 1, h: 2, visible: true, size: 'custom', type: 'kpi' },
  { id: '9', name: 'Son İşlemler', x: 2, y: 5, w: 4, h: 2, visible: true, size: 'custom', type: 'activity' },
  { id: '10', name: 'Toplam Gelir', x: 9, y: 3, w: 2, h: 2, visible: true, size: 'custom', type: 'total-revenue' },
  { id: '11', name: 'Doğum Günleri', x: 0, y: 5, w: 2, h: 2, visible: true, size: 'custom', type: 'birthday', minW:2, minH:2 },
  { id: '12', name: 'Son Haberler', x: 0, y: 0, w: 4, h: 2, visible: true, size: 'custom', type: 'news', minW:2, minH:2 },
  { id: '13', name: 'Kur Değişimleri', x: 4, y: 0, w: 2, h: 2, visible: true, size: 'custom', type: 'forex', minW:2, minH:2 }
]