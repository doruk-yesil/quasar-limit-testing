export type WidgetType = 'summary' | 'bar-chart' | 'line-chart' | 'custom'

export type WidgetItem = {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  visible: boolean
  type: WidgetType
}