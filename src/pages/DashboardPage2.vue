<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Header from '../components/Header.vue'
import {
  QBtn,
  QCard,
  QToggle,
  QDialog,
  QItem,
  QItemSection,
  QList,
  QCardSection,
  QCheckbox,
  QCardActions,
  QBanner
} from 'quasar'
import WidgetRenderer from '../components/widget-comps/WidgetRenderer.vue'
import type { WidgetItem } from '../components/widget-comps/widgetRegistry'

const BASE_COLS = 12
const CELL_HEIGHT = 100
const CELL_GUTTER = 16
const showSettingsDialog = ref(false)
const showWidgetDialog = ref(false)
const editMode = ref(false)
const cellWidth = ref(100)
const draggingStyle = ref<{ left: number; top: number } | null>(null)
const resizingStyle = ref<{ left: number; top: number; width: number; height: number } | null>(null)
const widgetPreview = ref<{ x: number; y: number; w: number; h: number } | null>(null)
const isResizing = ref(false)
let resizingWidget: WidgetItem | null = null
let startX = 0
let startY = 0
let startW = 0
let startH = 0

const allWidgets = ref<WidgetItem[]>([
  { id: '1', name: 'Gelir Kartı', x: 0, y: 0, w: 3, h: 3, visible: true, size: 'sm', type: 'summary' },
  { id: '2', name: 'Bar Grafik', x: 3, y: 0, w: 3, h: 3, visible: true, size: 'sm', type: 'bar-chart' },
  { id: '3', name: 'Zaman Serisi', x: 6, y: 0, w: 4, h: 3, visible: true, size: 'sm', type: 'line-chart' },
  { id: '4', name: 'Dağılım Pasta', x: 10, y: 0, w: 2, h: 3, visible: true, size: 'sm', type: 'pie-chart' },
  { id: '5', name: 'Veri Tablosu', x: 0, y: 3, w: 6, h: 2, visible: true, size: 'sm', type: 'table' },
  { id: '6', name: 'Aktif Kullanıcı', x: 6, y: 3, w: 2, h: 1, visible: true, size: 'sm', type: 'kpi' },
  { id: '7', name: 'Yeni Kayıtlar', x: 8, y: 3, w: 2, h: 1, visible: true, size: 'sm', type: 'kpi' },
  { id: '8', name: 'Ziyaret Süresi', x: 10, y: 3, w: 2, h: 1, visible: true, size: 'sm', type: 'kpi' },
  { id: '9', name: 'Son İşlemler', x: 0, y: 5, w: 4, h: 2, visible: true, size: 'sm', type: 'activity' },
  { id: '10', name: 'Toplam Gelir', x: 4, y: 6, w: 3, h: 1, visible: true, size: 'sm', type: 'total-revenue' }
])

const widgets = computed(() =>
  allWidgets.value.filter(widget => widget.visible)
)

const isDragging = ref(false)
let draggingWidget: WidgetItem | null = null
let dragOffsetX = 0
let dragOffsetY = 0

function getMaxGridRows() {
  return Math.max(...widgets.value.map(w => w.y + w.h), 8) + 1
}


function updateGridCols() {
  const container = document.querySelector('.dashboard-container') as HTMLElement
  if (container) {
    const width = container.clientWidth
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
  draggingWidget = widget
  dragOffsetX = event.clientX - (widget.x * (cellWidth.value + CELL_GUTTER) + 5)
  dragOffsetY = event.clientY - (widget.y * (CELL_HEIGHT + CELL_GUTTER) + 5)
  isDragging.value = true
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

function findFreeSpotFor(w: number, h: number): { x: number, y: number } | null {
  const maxRows = getMaxGridRows()
  const MAX_SEARCH_ROWS = maxRows + 10
  for (let y = 0; y <= MAX_SEARCH_ROWS - h; y++) {
    for (let x = 0; x <= BASE_COLS - w; x++) {
      if (!getCollidingWidget(x, y, w, h, '')) {
        return { x, y }
      }
    }
  }
  return null
}

function onMouseMove(event: MouseEvent) {
  if (!editMode.value) return
  if (isResizing.value && resizingWidget) {
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    const pixelW = startW * cellWidth.value + (startW - 1) * CELL_GUTTER
    const pixelH = startH * CELL_HEIGHT + (startH - 1) * CELL_GUTTER
    resizingStyle.value = {
      left: resizingWidget.x * (cellWidth.value + CELL_GUTTER) + 5,
      top: resizingWidget.y * (CELL_HEIGHT + CELL_GUTTER) + 5,
      width: pixelW + dx,
      height: pixelH + dy
    }
    const approxW = Math.max(1, Math.round((pixelW + dx) / cellWidth.value))
    const approxH = Math.max(1, Math.round((pixelH + dy) / CELL_HEIGHT))
    const maxW = BASE_COLS - resizingWidget.x
    const maxH = getMaxGridRows() - resizingWidget.y
    const finalW = Math.min(approxW, maxW)
    const finalH = Math.min(approxH, maxH)
    const collision = getCollidingWidget(
      resizingWidget.x,
      resizingWidget.y,
      finalW,
      finalH,
      resizingWidget.id
    )
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
    const newLeft = event.clientX - dragOffsetX + 5
    const newTop = event.clientY - dragOffsetY + 5
    draggingStyle.value = { left: newLeft, top: newTop }
    const snappedX = Math.max(0, Math.round(newLeft / cellWidth.value))
    const snappedY = Math.max(0, Math.round(newTop / CELL_HEIGHT))
    const maxX = BASE_COLS - draggingWidget.w
    const maxY = getMaxGridRows() - draggingWidget.h
    const newX = Math.min(maxX, snappedX)
    const newY = Math.min(maxY, snappedY)
    const collided = getCollidingWidget(newX, newY, draggingWidget.w, draggingWidget.h, draggingWidget.id)
    if (collided) {
      const foundSpot = findFreeSpotFor(collided.w, collided.h)
      if (foundSpot) {
        collided.x = foundSpot.x
        collided.y = foundSpot.y
        widgetPreview.value = {
          x: newX,
          y: newY,
          w: draggingWidget.w,
          h: draggingWidget.h
        }
        draggingWidget.x = newX
        draggingWidget.y = newY
      } else {
        widgetPreview.value = null
      }
    } else {
      widgetPreview.value = {
        x: newX,
        y: newY,
        w: draggingWidget.w,
        h: draggingWidget.h
      }
      draggingWidget.x = newX
      draggingWidget.y = newY
      pushDownCollisions(draggingWidget)
    }
  }
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

function openSettings() {
  showSettingsDialog.value = true
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
  if (resizingWidget) {
    pushDownCollisions(resizingWidget)
  }
  isResizing.value = false
  resizingWidget = null
  widgetPreview.value = null
  resizingStyle.value = null
  updateContainerHeight()
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
})
</script>

<template>
  <div class="q-pa-md">
    <Header />
    <h4 class="text-center">Manuel Grid Layout</h4>
    <q-banner class="bg-primary text-white q-my-md">
      💼 Welcome to your Finance Dashboard — <span class="text-italic text-bold">You have 2 new notifications</span>
    </q-banner>
    <div class="dashboard-container">
      <q-card
        v-for="widget in widgets"
        :key="widget.id"
        class="widget"
        :class="{ 'with-transition': draggingWidget?.id !== widget.id, 'editable': editMode }"
        :style="resizingWidget?.id === widget.id && resizingStyle
          ? {
              left: `${resizingStyle.left}px`,
              top: `${resizingStyle.top}px`,
              width: `${resizingStyle.width}px`,
              height: `${resizingStyle.height}px`,
              zIndex: 9999,
              opacity: 0.8
            }
          : draggingWidget?.id === widget.id && draggingStyle
          ? {
              left: `${draggingStyle.left + 5}px`,
              top: `${draggingStyle.top + 5}px`,
              width: `${widget.w * cellWidth + (widget.w - 1) * CELL_GUTTER}px`,
              height: `${widget.h * CELL_HEIGHT + (widget.h - 1) * CELL_GUTTER}px`,
              zIndex: 9999,
              opacity: 0.8
            }
          : {
              left: `${widget.x * (cellWidth + CELL_GUTTER) + 5}px`,
              top: `${widget.y * (CELL_HEIGHT + CELL_GUTTER) + 5}px`,
              width: `${widget.w * cellWidth + (widget.w - 1) * CELL_GUTTER}px`,
              height: `${widget.h * CELL_HEIGHT + (widget.h - 1) * CELL_GUTTER}px`
            }"
        @mousedown.prevent="editMode && startDrag($event, widget)"
      >
        <WidgetRenderer :widget="widget" />
        <div
          v-if="editMode"
          class="resize-handle"
          @mousedown.stop.prevent="startResize($event, widget)"
        >
          <img src="../assets/resize-handle-svgrepo-com.svg" />
        </div>
      </q-card>
      <div
        v-if="widgetPreview"
        class="widget-preview"
        :style="{
          left: `${widgetPreview.x * (cellWidth + CELL_GUTTER)+5}px`,
          top: `${widgetPreview.y * (CELL_HEIGHT + CELL_GUTTER)+5}px`,
          width: `${widgetPreview.w * cellWidth + (widgetPreview.w - 1) * CELL_GUTTER}px`,
          height: `${widgetPreview.h * CELL_HEIGHT + (widgetPreview.h - 1) * CELL_GUTTER}px`
        }"
      />
    </div>
    <q-btn
      fab
      color="primary"
      icon="settings"
      @click="openSettings"
      class="settings-btn"
    />
    <q-dialog v-model="showSettingsDialog">
    <q-card style="min-width: 300px">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Ayarlar</div>
        <q-btn flat round icon="close" v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-toggle v-model="editMode" label="Edit Mode" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Widget Listesi" @click="showWidgetDialog = true" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showWidgetDialog">
    <q-card style="min-width: 300px">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Widget Listesi</div>
        <q-btn flat round icon="close" v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="widget in allWidgets" :key="widget.id">
            <q-item-section>
              <q-checkbox v-model="widget.visible" :label="widget.name" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
  </div>
</template>

<style scoped>
.dashboard-container {
  position: relative;
  min-width: 1200px;
  height: 100vh;
  overflow-x: auto;
  /* background: #f5f5f5; */
  overflow: hidden;
  padding: 15px;
}

.settings-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.widget-preview {
  position: absolute;
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: 8px;
  pointer-events: none;
  z-index: 1;
}

.widget.with-transition {
  transition: left 0.25s ease, top 0.25s ease;
}

.widget {
  position: absolute;
  cursor: default;
  user-select: none;
  transition: box-shadow 0.2s ease;
  min-width: 100px;
  min-height: 100px;
}

.widget.editable {
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

.widget.editable .resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  border-bottom-right-radius: 4px;
  z-index: 10;
}

img{
  max-width: 100%;
  max-height: auto;
}
</style>
