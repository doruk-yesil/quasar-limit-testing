<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Header from '../components/Header.vue'

const GRID_COLS = 12
const GRID_ROWS = 6
const CELL_WIDTH = 100
const CELL_HEIGHT = 100

type WidgetItem = {
  id: string
  x: number
  y: number
  w: number
  h: number
}

const widgets = ref<WidgetItem[]>([
  { id: '1', x: 0, y: 0, w: 3, h: 2 },
  { id: '2', x: 3, y: 0, w: 3, h: 2 },
  { id: '3', x: 6, y: 0, w: 3, h: 2 }
])

const isDragging = ref(false)
let draggingWidget: WidgetItem | null = null
let dragOffsetX = 0
let dragOffsetY = 0

function startDrag(event: MouseEvent, widget: WidgetItem) {
  draggingWidget = widget
  dragOffsetX = event.clientX - widget.x * CELL_WIDTH
  dragOffsetY = event.clientY - widget.y * CELL_HEIGHT
  isDragging.value = true
}

function isCollision(x: number, y: number, w: number, h: number, currentId: string): boolean {
  return widgets.value.some(widget => {
    if (widget.id === currentId) return false
    return !(
      x + w <= widget.x || 
      x >= widget.x + widget.w ||
      y + h <= widget.y ||
      y >= widget.y + widget.h
    )
  })
}

function onMouseMove(event: MouseEvent) {
  if (isDragging.value && draggingWidget) {
    const newLeft = event.clientX - dragOffsetX
    const newTop = event.clientY - dragOffsetY
    const snappedX = Math.max(0, Math.round(newLeft / CELL_WIDTH))
    const snappedY = Math.max(0, Math.round(newTop / CELL_HEIGHT))
    const maxX = GRID_COLS - draggingWidget.w
    const maxY = GRID_ROWS - draggingWidget.h
    const newX = Math.min(maxX, snappedX)
    const newY = Math.min(maxY, snappedY)
    if (!isCollision(newX, newY, draggingWidget.w, draggingWidget.h, draggingWidget.id)) {
      draggingWidget.x = newX
      draggingWidget.y = newY
    }
  }
}


function stopDrag() {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div class="q-pa-md">
    <Header />
    <div class="dashboard-container">
      <div
        v-for="widget in widgets"
        :key="widget.id"
        class="widget"
        :style="{
          left: `${widget.x * CELL_WIDTH}px`,
          top: `${widget.y * CELL_HEIGHT}px`,
          width: `${widget.w * CELL_WIDTH}px`,
          height: `${widget.h * CELL_HEIGHT}px`
        }"
        @mousedown="startDrag($event, widget)"
      >
        <div class="widget-header">Widget {{ widget.id }}</div>
        <div class="widget-body">$123,456</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
}


.widget {
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.2s ease;
}

.widget:active {
  cursor: grabbing;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.widget-header {
  background-color: #09898d;
  color: white;
  padding: 10px;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.widget-body {
  padding: 10px;
  font-size: 18px;
  text-align: center;
}
</style>
