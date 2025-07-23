<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRaw, watch } from 'vue'
import DraggableCard from './DraggableCard.vue'
import CardPreview from './CardPreview.vue'
import WidgetRenderer from './WidgetRenderer.vue'
import type { WidgetItem } from './widgetRegistry'
import { QBtn, QDialog, QCardActions, QCard, QSelect, QCardSection, QToggle, Notify } from 'quasar'

const props = defineProps<{
  editMode: boolean
  containerMode: 'fixed' | 'auto'
}>()
const allWidgets = defineModel<WidgetItem[]>('all-widgets')

const STORAGE_KEY = 'dashboard-layout'
const BASE_COLS = 12
const CELL_HEIGHT = 100
const CELL_GUTTER = 16
const MAX_ROWS = 8
const cellWidth = ref(100)

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
  const container = document.querySelector('.dashboard-container') as HTMLElement
  if (!container) return
  if (props.containerMode === 'fixed') {
    container.style.height = '100vh'
  } else {
    const maxY = Math.max(...allWidgets.value!.filter(w => w.visible).map(w => w.y + w.h), 0)
    container.style.height = `${maxY * (CELL_HEIGHT + CELL_GUTTER)}px`
  }
}

function getCollidingWidget(x: number, y: number, w: number, h: number, currentId: string): WidgetItem | null {
  if (x < 0 || x + w > BASE_COLS || y < 0 || y + h > MAX_ROWS) {
    return {} as WidgetItem
  }
  return allWidgets.value!.find(widget => {
    if (!widget.visible || widget.id === currentId) return false
    const isOverlapping = !(
      x + w <= widget.x ||
      x >= widget.x + widget.w ||
      y + h <= widget.y ||
      y >= widget.y + widget.h
    )
    if (isOverlapping && widget.locked) {
      return widget
    }
    return isOverlapping ? widget : null
  }) || null
}

function findFreeSpotFor(w: number, h: number): { x: number; y: number } | null {
  const maxRows = Math.max(...allWidgets.value!.filter(w => w.visible).map(w => w.y + w.h), 8)
  for (let y = 0; y <= maxRows - h; y++) {
    for (let x = 0; x <= BASE_COLS - w; x++) {
      if (!getCollidingWidget(x, y, w, h, '')) return { x, y }
    }
  }
  return null
}

function pushDownCollisions(widget: WidgetItem) {
  if (widget.locked) return
  const moved = new Set<string>()
  const queue: WidgetItem[] = widget.locked ? [] : [widget]
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue
    for (const other of allWidgets.value!) {
      if (!other.visible || other.id === current.id || other.locked) continue
      const isCollision =
        !(current.x + current.w <= other.x ||
          current.x >= other.x + other.w ||
          current.y + current.h <= other.y ||
          current.y >= other.y + other.h)
      if (isCollision) {
        const key = `${other.id}-${other.x}-${other.y}`
        if (moved.has(key)) continue
        const newY = current.y + current.h
        if (newY !== other.y) {
          other.y = newY
          moved.add(key)
          queue.push(other)
        }
      }
    }
  }
  for (const w of allWidgets.value!) {
    if (!w.visible || w.locked) continue
    const collision = getCollidingWidget(w.x, w.y, w.w, w.h, w.id)
    if (collision) {
      if (collision.locked) {
        const newSpot = findFreeSpotFor(w.w, w.h)
        if (newSpot) {
          w.x = newSpot.x
          w.y = newSpot.y
          continue
        }
        if (props.containerMode === 'fixed') {
          Notify.create({
            message: `${w.name} kilitli bir widget ile çakıştığı için gizlendi.`,
            color: 'warning',
            icon: 'lock',
            position: 'top-right',
            timeout: 3000
          })
          w.visible = false
        }
        continue
      }
      const newSpot = findFreeSpotFor(w.w, w.h)
      if (newSpot) {
        w.x = newSpot.x
        w.y = newSpot.y
      } else if (props.containerMode === 'fixed') {
        Notify.create({
          message: `${w.name} yer bulunamadığı için gizlendi.`,
          color: 'warning',
          icon: 'warning',
          position: 'top-right',
          timeout: 3000
        })
        w.visible = false
      }
    }

  }
}

function startDrag(event: MouseEvent, widget: WidgetItem) {
  draggingWidget = widget
  const element = event.currentTarget as HTMLElement
  const rect = element.getBoundingClientRect()
  dragOffsetX = event.clientX - rect.left
  dragOffsetY = event.clientY - rect.top 
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
  saveLayout()
}

function startResize(event: MouseEvent, widget: WidgetItem) {
  isResizing.value = true
  resizingWidget = widget
  startX = event.clientX
  startY = event.clientY
  startW = widget.w
  startH = widget.h
  widget.size = 'custom'
}

function stopResize() {
  if (resizingWidget) pushDownCollisions(resizingWidget)
  isResizing.value = false
  resizingWidget = null
  widgetPreview.value = null
  resizingStyle.value = null
  updateContainerHeight()
  saveLayout()
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
    const maxH = props.containerMode === 'fixed'
      ? Math.floor((window.innerHeight - CELL_GUTTER) / (CELL_HEIGHT + CELL_GUTTER)) - resizingWidget.y
      : 100 - resizingWidget.y
    const minW = resizingWidget.minW ?? 1
    const minH = resizingWidget.minH ?? 1
    const finalW = Math.max(minW, Math.min(approxW, maxW))
    const finalH = Math.max(minH, Math.min(approxH, maxH))

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
    updateContainerHeight()
  }

  if (isDragging.value && draggingWidget) {
    const containerOffsetLeft = document.querySelector('.dashboard-container')?.getBoundingClientRect().left ?? 0
    const newLeft = event.clientX - dragOffsetX - containerOffsetLeft
    const containerOffsetTop = document.querySelector('.dashboard-container')?.getBoundingClientRect().top ?? 0
    const newTop = event.clientY - dragOffsetY - containerOffsetTop
    draggingStyle.value = { left: newLeft, top: newTop }

    const snappedX = Math.max(0, Math.floor(newLeft / cellWidth.value))
    const snappedY = Math.max(0, Math.round(newTop / (CELL_HEIGHT + CELL_GUTTER)))
    const maxX = BASE_COLS - draggingWidget.w
    const maxY = props.containerMode === 'fixed'
      ? Math.floor((window.innerHeight - CELL_GUTTER) / (CELL_HEIGHT + CELL_GUTTER)) - draggingWidget.h
      : 100 - draggingWidget.h
    
    const newX = Math.min(maxX, snappedX)
    const newY = Math.min(maxY, snappedY)
    const collided = getCollidingWidget(newX, newY, draggingWidget.w, draggingWidget.h, draggingWidget.id)
    if (collided) {
      if (collided.locked) {
        widgetPreview.value = null
        return
      }
      const foundSpot = findFreeSpotFor(collided.w, collided.h)
      if (foundSpot) {
        collided.x = foundSpot.x
        collided.y = foundSpot.y
        draggingWidget.x = newX
        draggingWidget.y = newY
        widgetPreview.value = { x: newX, y: newY, w: draggingWidget.w, h: draggingWidget.h }
        pushDownCollisions(draggingWidget)
      } else {
        widgetPreview.value = null
      }
    } else {
      draggingWidget.x = newX
      draggingWidget.y = newY
      widgetPreview.value = { x: newX, y: newY, w: draggingWidget.w, h: draggingWidget.h }
      pushDownCollisions(draggingWidget)
    }
    updateContainerHeight()
  }
  if (isDragging.value) {
    const SCROLL_THRESHOLD = 100
    const SCROLL_SPEED = 20
    const viewportHeight = window.innerHeight
    const mouseY = event.clientY
    if (mouseY > viewportHeight - SCROLL_THRESHOLD) {
      window.scrollBy({ top: SCROLL_SPEED, behavior: 'auto' })
    } else if (mouseY < SCROLL_THRESHOLD) {
      window.scrollBy({ top: -SCROLL_SPEED, behavior: 'auto' })
    }
  }
}

function saveLayout() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toRaw(allWidgets.value)))
  } catch (e) {
    console.error('Layout kaydedilemedi:', e)
  }
}

function loadLayout() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as WidgetItem[]
            parsed.forEach(widget => {
        if (widget.locked === undefined) {
          widget.locked = false
        }
      })
      allWidgets.value = parsed
    } catch {
      console.warn('Kaydedilmiş layout okunamadı, varsayılan kullanılacak.')
    }
  }
}

const modalWidget = ref<WidgetItem | null>(null)
const selectedSize = ref<'sm' | 'md' | 'lg' | 'custom'>('md')
const showSettingsModal = ref(false)

function openSettings(widget: WidgetItem) {
  modalWidget.value = widget
  selectedSize.value = widget.size ?? 'md'
  showSettingsModal.value = true
}

function onSizeChange(size: 'sm' | 'md' | 'lg' | 'custom') {
  if (!modalWidget.value) return
  modalWidget.value.size = size
  switch (size) {
    case 'custom':
      break
    case 'sm':
      modalWidget.value.w = 2
      modalWidget.value.h = 2
      break
    case 'md':
      modalWidget.value.w = 4
      modalWidget.value.h = 3
      break
    case 'lg':
      modalWidget.value.w = 6
      modalWidget.value.h = 4
      break
  }
  pushDownCollisions(modalWidget.value)
  saveLayout()
}

function onVisibilityToggle(newVal: boolean) {
  if (!modalWidget.value) return

  if (newVal) {
    const spot = findFreeSpotFor(modalWidget.value.w, modalWidget.value.h)
    if (spot) {
      modalWidget.value.x = spot.x
      modalWidget.value.y = spot.y
      modalWidget.value.visible = true
      pushDownCollisions(modalWidget.value)
    } else {
      modalWidget.value.visible = false
    }
  } else {
    modalWidget.value.visible = false
  }
  saveLayout()
}

function toggleWidgetLock(widget: WidgetItem) {
  widget.locked = !widget.locked
  saveLayout()
}

watch(
  () => allWidgets.value!.map(w => w.visible),
  (visibilityList, oldVisibilityList) => {
    allWidgets.value!.forEach((w, i) => {
      if (visibilityList[i] && !oldVisibilityList?.[i]) {
        if (w.locked === undefined) w.locked = false
        const spot = findFreeSpotFor(w.w, w.h)
        if (spot) {
          w.x = spot.x
          w.y = spot.y
          w.visible = true
          pushDownCollisions(w)
        } else if (props.containerMode === 'fixed') {
          w.visible = false
        }
      }
    })
    updateContainerHeight()
    saveLayout()
  },
  { deep: false }
)

watch(
  () => props.containerMode,
  (mode) => {
    const container = document.querySelector('.dashboard-container') as HTMLElement
    if (!container) return

    if (mode === 'auto') {
      container.style.height = 'auto'
    } else {
      updateContainerHeight()
    }
  },
  { immediate: true }
)

onMounted(() => {
  loadLayout()
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
      v-for="widget in allWidgets"
      v-show="widget.visible"
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
      <WidgetRenderer 
        :widget="widget"
        :edit-mode="editMode"
        @openSettings="openSettings"
        @toggleLock="toggleWidgetLock"
      />
    </DraggableCard>

    <CardPreview
      v-if="widgetPreview"
      :preview="widgetPreview"
      :cellWidth="cellWidth"
      :CELL_HEIGHT="CELL_HEIGHT"
      :CELL_GUTTER="CELL_GUTTER"
    />

    <q-dialog v-model="showSettingsModal">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">{{ modalWidget?.name }} Ayarları</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedSize"
            :options="[
                { label: 'Seçiniz', value: 'custom' },
                { label: 'Küçük (sm)', value: 'sm' },
                { label: 'Orta (md)', value: 'md' },
                { label: 'Büyük (lg)', value: 'lg' }
            ]"
            label="Boyut"
            filled
            dense
            emit-value
            map-options
            @update:model-value="onSizeChange"
          />
        </q-card-section>
        <q-card-section>
          <q-toggle
            v-model="modalWidget!.visible"
            label="Göster"
            left-label
            color="primary"
            @update:model-value="onVisibilityToggle"
          />
          <q-toggle
            v-model="modalWidget!.locked"
            label="Kilitli"
            left-label
            color="deep-orange"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Kapat" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
