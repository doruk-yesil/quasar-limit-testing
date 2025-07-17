<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DraggableCard from './DraggableCard.vue'
import CardPreview from './CardPreview.vue'
import WidgetRenderer from './WidgetRenderer.vue'
import type { WidgetItem } from './widgetRegistry'

const props = defineProps<{
  initialWidgets: WidgetItem[]
  editMode: boolean
}>()

const BASE_COLS = 12
const CELL_HEIGHT = 100
const CELL_GUTTER = 16
const cellWidth = ref(100)

const allWidgets = ref<WidgetItem[]>([...props.initialWidgets])

const widgets = computed(() =>
  allWidgets.value.filter(widget => widget.visible)
)

const draggingStyle = ref<{ left: number; top: number } | null>(null)
const resizingStyle = ref<{ left: number; top: number; width: number; height: number } | null>(null)
const widgetPreview = ref<{ x: number; y: number; w: number; h: number } | null>(null)

const isDragging = ref(false)
let draggingWidget: WidgetItem | null = null
let dragOffsetX = 0
let dragOffsetY = 0

const isResizing = ref(false)
let resizingWidget: WidgetItem | null = null
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

function startDrag(event: MouseEvent, widget: WidgetItem) {
  draggingWidget = widget
  dragOffsetX = event.clientX - (widget.x * (cellWidth.value + CELL_GUTTER))
  dragOffsetY = event.clientY - (widget.y * (CELL_HEIGHT + CELL_GUTTER))
  isDragging.value = true
}

function stopDrag() {
  if (draggingWidget && widgetPreview.value) {
    draggingWidget.x = widgetPreview.value.x
    draggingWidget.y = widgetPreview.value.y
    pushDownCollisions(draggingWidget)
    widgetPreview.value = null
  }
  draggingWidget = null
  draggingStyle.value = null
  isDragging.value = false
  updateContainerHeight()
}

function startResize(event: MouseEvent, widget: WidgetItem) {
  isResizing.value = true
  resizingWidget = widget
  startX = event.clientX
  startY = event.clientY
  startW = widget.w
  startH = widget.h
}

function stopResize() {
  if (resizingWidget) pushDownCollisions(resizingWidget)
  isResizing.value = false
  resizingWidget = null
  widgetPreview.value = null
  resizingStyle.value = null
  updateContainerHeight()
}

function onMouseMove(event: MouseEvent) {
  if (!props.editMode) return

  if (isResizing.value && resizingWidget) {
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    const pixelW = startW * cellWidth.value + (startW - 1) * CELL_GUTTER
    const pixelH = startH * CELL_HEIGHT + (startH - 1) * CELL_GUTTER
    resizingStyle.value = {
      left: resizingWidget.x * (cellWidth.value + CELL_GUTTER),
      top: resizingWidget.y * (CELL_HEIGHT + CELL_GUTTER),
      width: pixelW + dx,
      height: pixelH + dy
    }

    const approxW = Math.max(1, Math.round((pixelW + dx) / cellWidth.value))
    const approxH = Math.max(1, Math.round((pixelH + dy) / CELL_HEIGHT))
    const maxW = BASE_COLS - resizingWidget.x
    const maxH = 100 - resizingWidget.y
    const finalW = Math.min(approxW, maxW)
    const finalH = Math.min(approxH, maxH)

    const collision = getCollidingWidget(resizingWidget.x, resizingWidget.y, finalW, finalH, resizingWidget.id)
    if (collision) {
      const newSpot = findFreeSpotFor(collision.w, collision.h)
      if (newSpot) {
        collision.x = newSpot.x
        collision.y = newSpot.y
      }
    }

    widgetPreview.value = {
      x: resizingWidget.x,
      y: resizingWidget.y,
      w: finalW,
      h: finalH
    }

    resizingWidget.w = finalW
    resizingWidget.h = finalH
    pushDownCollisions(resizingWidget)
  }

  if (isDragging.value && draggingWidget) {
    const newLeft = event.clientX - dragOffsetX
    const newTop = event.clientY - dragOffsetY
    draggingStyle.value = { left: newLeft, top: newTop }

    const snappedX = Math.max(0, Math.floor(newLeft / cellWidth.value))
    const snappedY = Math.max(0, Math.floor(newTop / CELL_HEIGHT))
    const maxX = BASE_COLS - draggingWidget.w
    const maxY = 100 - draggingWidget.h

    const newX = Math.min(maxX, snappedX)
    const newY = Math.min(maxY, snappedY)

    const collided = getCollidingWidget(newX, newY, draggingWidget.w, draggingWidget.h, draggingWidget.id)
    if (collided) {
      const foundSpot = findFreeSpotFor(collided.w, collided.h)
      if (foundSpot) {
        collided.x = foundSpot.x
        collided.y = foundSpot.y
        draggingWidget.x = newX
        draggingWidget.y = newY
        widgetPreview.value = { x: newX, y: newY, w: draggingWidget.w, h: draggingWidget.h }
      } else {
        widgetPreview.value = null
      }
    } else {
      draggingWidget.x = newX
      draggingWidget.y = newY
      widgetPreview.value = { x: newX, y: newY, w: draggingWidget.w, h: draggingWidget.h }
      pushDownCollisions(draggingWidget)
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
</script>

<template>
  <div class="dashboard-container">
    <DraggableCard
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
      :draggingWidget="draggingWidget"
      :resizingWidget="resizingWidget"
      :draggingStyle="draggingStyle"
      :resizingStyle="resizingStyle"
      :cellWidth="cellWidth"
      :CELL_HEIGHT="CELL_HEIGHT"
      :CELL_GUTTER="CELL_GUTTER"
      :editMode="editMode"
      @startDrag="startDrag"
      @startResize="startResize"
    >
      <WidgetRenderer :widget="widget" />
    </DraggableCard>

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
