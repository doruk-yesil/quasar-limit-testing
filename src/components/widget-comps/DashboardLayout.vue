<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, toRef } from 'vue'
import type { WidgetItem } from '../../types/widget'
import { provide } from 'vue'
import ActivityWidget from '../widgets/ActivityWidget.vue'
import BarChartWidget from '../widgets/BarChartWidget.vue'
import KPIWidget from '../widgets/KPIWidget.vue'
import LineChartWidget from '../widgets/LineChartWidget.vue'
import PieChartWidget from '../widgets/PieChartWidget.vue'
import SummaryWidget from '../widgets/SummaryWidget.vue'
import TableWidget from '../widgets/TableWidget.vue'
import TotalRevenueWidget from '../widgets/TotalRevenueWidget.vue'
import CardPreview from './CardPreview.vue'

function getWidgetComponent(type: string) {
  switch (type) {
    case 'activity': return ActivityWidget
    case 'bar-chart': return BarChartWidget
    case 'kpi': return KPIWidget
    case 'line-chart': return LineChartWidget
    case 'pie-chart': return PieChartWidget
    case 'summary': return SummaryWidget
    case 'table': return TableWidget
    case 'total-revenue': return TotalRevenueWidget
    default: return SummaryWidget
  }
}

const props = defineProps<{
  initialWidgets: WidgetItem[]
  editMode: boolean
}>()

const editMode = toRef(props, 'editMode')

const BASE_COLS = 12
const CELL_HEIGHT = 100
const CELL_GUTTER = 16
const cellWidth = ref(100)

const allWidgets = ref<WidgetItem[]>([...props.initialWidgets])
const widgets = computed(() => allWidgets.value.filter(widget => widget.visible))

const draggingStyle = ref<{ left: number; top: number } | null>(null)
const resizingStyle = ref<{ left: number; top: number; width: number; height: number } | null>(null)
const widgetPreview = ref<{ x: number; y: number; w: number; h: number } | null>(null)

const isDragging = ref(false)
const draggingWidget = ref<WidgetItem | null>(null)
let dragOffsetX = 0
let dragOffsetY = 0

const isResizing = ref(false)
const resizingWidget = ref<WidgetItem | null>(null)
let startX = 0
let startY = 0
let startW = 0
let startH = 0

function updateGridCols() {
  const container = document.querySelector('.dashboard-container') as HTMLElement
  if (container) {
    const style = window.getComputedStyle(container)
    const paddingLeft = parseInt(style.paddingLeft)
    const paddingRight = parseInt(style.paddingRight)
    const width = container.clientWidth - paddingLeft - paddingRight
    cellWidth.value = Math.floor((width - (BASE_COLS - 1) * CELL_GUTTER) / BASE_COLS)
  }
}

function updateContainerHeight() {
  const maxY = Math.max(...widgets.value.map(w => w.y + w.h), 0)
  const container = document.querySelector('.dashboard-container') as HTMLElement
  if (container) {
    container.style.height = `${maxY * (CELL_HEIGHT + CELL_GUTTER)}px`
  }
}

function startDrag(event: MouseEvent, widget: WidgetItem) {
  draggingWidget.value = widget
  dragOffsetX = event.clientX - (widget.x * (cellWidth.value + CELL_GUTTER) + 5)
  dragOffsetY = event.clientY - (widget.y * (CELL_HEIGHT + CELL_GUTTER) + 5)
  isDragging.value = true
}

function startResize(event: MouseEvent, widget: WidgetItem) {
  isResizing.value = true
  resizingWidget.value = widget
  startX = event.clientX
  startY = event.clientY
  startW = widget.w
  startH = widget.h
}

function stopResize() {
  if (resizingWidget.value) pushDownCollisions(resizingWidget.value)
  isResizing.value = false
  resizingWidget.value = null
  widgetPreview.value = null
  resizingStyle.value = null
  updateContainerHeight()
}

function stopDrag() {
  if (draggingWidget.value && widgetPreview.value) {
    draggingWidget.value.x = widgetPreview.value.x
    draggingWidget.value.y = widgetPreview.value.y
    pushDownCollisions(draggingWidget.value)
    widgetPreview.value = null
  }
  draggingWidget.value = null
  draggingStyle.value = null
  isDragging.value = false
  updateContainerHeight()
}

function pushDownCollisions(widget: WidgetItem) {
  const moved = new Set<string>()
  const queue: WidgetItem[] = [widget]
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue
    for (const other of widgets.value) {
      if (other.id === current.id || moved.has(other.id)) continue
      const isCollision =
        !(current.x + current.w <= other.x ||
          current.x >= other.x + other.w ||
          current.y + current.h <= other.y ||
          current.y >= other.y + other.h)
      if (isCollision) {
        const newY = current.y + current.h
        if (newY !== other.y) {
          other.y = newY
          moved.add(other.id)
          queue.push(other)
        }
      }
    }
  }
}

function getCollidingWidget(x: number, y: number, w: number, h: number, currentId: string): WidgetItem | null {
  return widgets.value.find(widget => {
    if (widget.id === currentId) return false
    return !(
      x + w <= widget.x ||
      x >= widget.x + widget.w ||
      y + h <= widget.y ||
      y >= widget.y + widget.h
    )
  }) || null
}

function findFreeSpotFor(w: number, h: number): { x: number; y: number } | null {
  const maxRows = Math.max(...widgets.value.map(w => w.y + w.h), 8) + 10
  for (let y = 0; y <= maxRows - h; y++) {
    for (let x = 0; x <= BASE_COLS - w; x++) {
      if (!getCollidingWidget(x, y, w, h, '')) return { x, y }
    }
  }
  return null
}

function onMouseMove(event: MouseEvent) {
  if (!editMode.value) return
  if (isResizing.value && resizingWidget.value) {
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    const pixelW = startW * cellWidth.value + (startW - 1) * CELL_GUTTER
    const pixelH = startH * CELL_HEIGHT + (startH - 1) * CELL_GUTTER
    resizingStyle.value = {
      left: resizingWidget.value.x * (cellWidth.value + CELL_GUTTER) + 5,
      top: resizingWidget.value.y * (CELL_HEIGHT + CELL_GUTTER) + 5,
      width: pixelW + dx,
      height: pixelH + dy
    }

    const approxW = Math.max(1, Math.round((pixelW + dx) / cellWidth.value))
    const approxH = Math.max(1, Math.round((pixelH + dy) / CELL_HEIGHT))
    const maxW = BASE_COLS - resizingWidget.value.x
    const maxH = 100 - resizingWidget.value.y
    const finalW = Math.min(approxW, maxW)
    const finalH = Math.min(approxH, maxH)

    const collision = getCollidingWidget(resizingWidget.value.x, resizingWidget.value.y, finalW, finalH, resizingWidget.value.id)
    if (collision) {
      const newSpot = findFreeSpotFor(collision.w, collision.h)
      if (newSpot) {
        collision.x = newSpot.x
        collision.y = newSpot.y
      }
    }

    widgetPreview.value = {
      x: resizingWidget.value.x,
      y: resizingWidget.value.y,
      w: finalW,
      h: finalH
    }

    resizingWidget.value.w = finalW
    resizingWidget.value.h = finalH
    pushDownCollisions(resizingWidget.value)
  }
  if (isDragging.value && draggingWidget.value) {
    const newLeft = event.clientX - dragOffsetX + 5
    const newTop = event.clientY - dragOffsetY + 5
    draggingStyle.value = { left: newLeft, top: newTop }

    const snappedX = Math.max(0, Math.round(newLeft / cellWidth.value))
    const snappedY = Math.max(0, Math.round(newTop / CELL_HEIGHT))
    const maxX = BASE_COLS - draggingWidget.value.w
    const maxY = 100 - draggingWidget.value.h

    const newX = Math.min(maxX, snappedX)
    const newY = Math.min(maxY, snappedY)

    const collided = getCollidingWidget(newX, newY, draggingWidget.value.w, draggingWidget.value.h, draggingWidget.value.id)
    if (collided) {
      const foundSpot = findFreeSpotFor(collided.w, collided.h)
      if (foundSpot) {
        collided.x = foundSpot.x
        collided.y = foundSpot.y
        draggingWidget.value.x = newX
        draggingWidget.value.y = newY
        widgetPreview.value = { x: newX, y: newY, w: draggingWidget.value.w, h: draggingWidget.value.h }
      } else {
        widgetPreview.value = null
      }
    } else {
      widgetPreview.value = { x: newX, y: newY, w: draggingWidget.value.w, h: draggingWidget.value.h }
      draggingWidget.value.x = newX
      draggingWidget.value.y = newY
      pushDownCollisions(draggingWidget.value)
    }
  }
}

onMounted(() => {
  updateGridCols()
  updateContainerHeight()
  window.addEventListener('resize', updateGridCols)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('mouseup', stopResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGridCols)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('mouseup', stopResize)
})

provide('dashboardContext', {
  draggingWidget,
  resizingWidget,
  draggingStyle,
  resizingStyle,
  cellWidth,
  CELL_HEIGHT,
  CELL_GUTTER,
  editMode,
  onStartDrag: startDrag,
  onStartResize: startResize
})
</script>

<template>
  <div class="dashboard-container">
    <component
      v-for="widget in widgets"
      :key="widget.id"
      :is="getWidgetComponent(widget.type)"
      :widget="widget"
    />
    <CardPreview
      v-if="widgetPreview"
      :preview="widgetPreview"
      :cellWidth="cellWidth"
      :CELL_HEIGHT="CELL_HEIGHT"
      :CELL_GUTTER="CELL_GUTTER"
    />
  </div>
</template>

<style scoped>
.dashboard-container {
  position: relative;
  min-width: 1200px;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 15px;
}
</style>
