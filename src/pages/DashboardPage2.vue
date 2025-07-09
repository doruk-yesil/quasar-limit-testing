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
import WidgetRenderer from '../components/WidgetRenderer.vue'
import type { WidgetItem } from '../types/widget'

const BASE_COLS = 12
const GRID_ROWS = 6
const CELL_HEIGHT = 100
const CELL_GUTTER = 16
const showSettingsDialog = ref(false)
const showWidgetDialog = ref(false)
const editMode = ref(false)
const cellWidth = ref(100)
const draggingStyle = ref<{ left: number; top: number } | null>(null)
const dragPreview = ref<{ x: number; y: number; w: number; h: number } | null>(null)

const allWidgets = ref<WidgetItem[]>([
  { id: '1', name: 'Gelir Kartı', x: 0, y: 0, w: 3, h: 2, visible: true, type: 'summary' },
  { id: '2', name: 'Bar Grafik', x: 3, y: 0, w: 3, h: 2, visible: true, type: 'bar-chart' }
])

const widgets = computed(() =>
  allWidgets.value.filter(widget => widget.visible)
)

const isDragging = ref(false)
let draggingWidget: WidgetItem | null = null
let dragOffsetX = 0
let dragOffsetY = 0

function updateGridCols() {
  const container = document.querySelector('.dashboard-container') as HTMLElement
  if (container) {
    const width = container.clientWidth
    cellWidth.value = Math.floor((width - (BASE_COLS - 1) * CELL_GUTTER) / BASE_COLS)
  }
}

function startDrag(event: MouseEvent, widget: WidgetItem) {
  draggingWidget = widget
  dragOffsetX = event.clientX - widget.x * cellWidth.value
  dragOffsetY = event.clientY - widget.y * CELL_HEIGHT
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
  for (let y = 0; y <= GRID_ROWS - h; y++) {
    for (let x = 0; x <= BASE_COLS - w; x++) {
      if (!getCollidingWidget(x, y, w, h, '')) {
        return { x, y }
      }
    }
  }
  return null
}

function onMouseMove(event: MouseEvent) {
  if (isDragging.value && draggingWidget) {
    const newLeft = event.clientX - dragOffsetX
    const newTop = event.clientY - dragOffsetY
    draggingStyle.value = { left: newLeft, top: newTop }
    const snappedX = Math.max(0, Math.round(newLeft / cellWidth.value))
    const snappedY = Math.max(0, Math.round(newTop / CELL_HEIGHT))
    const maxX = BASE_COLS - draggingWidget.w
    const maxY = GRID_ROWS - draggingWidget.h
    const newX = Math.min(maxX, snappedX)
    const newY = Math.min(maxY, snappedY)
    const collided = getCollidingWidget(newX, newY, draggingWidget.w, draggingWidget.h, draggingWidget.id)
    if (collided) {
      const foundSpot = findFreeSpotFor(collided.w, collided.h)
      if (foundSpot) {
        collided.x = foundSpot.x
        collided.y = foundSpot.y
        dragPreview.value = {
          x: newX,
          y: newY,
          w: draggingWidget.w,
          h: draggingWidget.h
        }
        draggingWidget.x = newX
        draggingWidget.y = newY
      } else {
        dragPreview.value = null
      }
    } else {
      dragPreview.value = {
        x: newX,
        y: newY,
        w: draggingWidget.w,
        h: draggingWidget.h
      }
      draggingWidget.x = newX
      draggingWidget.y = newY
    }
  }
}

function stopDrag() {
  if (draggingWidget && dragPreview.value) {
    draggingWidget.x = dragPreview.value.x
    draggingWidget.y = dragPreview.value.y
    const collided = getCollidingWidget(
      dragPreview.value.x,
      dragPreview.value.y,
      draggingWidget.w,
      draggingWidget.h,
      draggingWidget.id
    )
    if (collided) {
      const newSpot = findFreeSpotFor(collided.w, collided.h)
      if (newSpot) {
        collided.x = newSpot.x
        collided.y = newSpot.y
      }
    }
  }
  draggingWidget = null
  draggingStyle.value = null
  dragPreview.value = null
  isDragging.value = false
}

function openSettings() {
  showSettingsDialog.value = true
}


onMounted(() => {
  updateGridCols()
  window.addEventListener('resize', updateGridCols)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
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
      <div
        v-for="widget in widgets"
        :key="widget.id"
        class="widget"
        :class="['widget', { 'with-transition': draggingWidget?.id !== widget.id }]"
        :style="draggingWidget?.id === widget.id && draggingStyle
          ? {
              left: `${draggingStyle.left}px`,
              top: `${draggingStyle.top}px`,
              width: `${widget.w * cellWidth + (widget.w - 1) * CELL_GUTTER}px`,
              height: `${widget.h * CELL_HEIGHT + (widget.h - 1) * CELL_GUTTER}px`,
              zIndex: 9999,
              opacity: 0.8
            }
          : {
              left: `${widget.x * (cellWidth + CELL_GUTTER)}px`,
              top: `${widget.y * (CELL_HEIGHT + CELL_GUTTER)}px`,
              width: `${widget.w * cellWidth + (widget.w - 1) * CELL_GUTTER}px`,
              height: `${widget.h * CELL_HEIGHT + (widget.h - 1) * CELL_GUTTER}px`
            }"
        @mousedown.prevent="startDrag($event, widget)"
      >
        <WidgetRenderer :widget="widget" />
      </div>
      <div
        v-if="dragPreview"
        class="widget-preview"
        :style="{
          left: `${dragPreview.x * (cellWidth + CELL_GUTTER)}px`,
          top: `${dragPreview.y * (CELL_HEIGHT + CELL_GUTTER)}px`,
          width: `${dragPreview.w * cellWidth + (dragPreview.w - 1) * CELL_GUTTER}px`,
          height: `${dragPreview.h * CELL_HEIGHT + (dragPreview.h - 1) * CELL_GUTTER}px`
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
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.2s ease;
  min-width: 300px;
  min-height: 200px;
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
