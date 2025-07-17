<script setup lang="ts">
import { computed } from 'vue'
import { QCard } from 'quasar'
import type { WidgetItem } from './widgetRegistry'

const props=defineProps<{
  widget: WidgetItem
  draggingWidget: WidgetItem | null
  resizingWidget: WidgetItem | null
  draggingStyle: { left: number; top: number } | null
  resizingStyle: { left: number; top: number; width: number; height: number } | null
  cellWidth: number
  CELL_HEIGHT: number
  CELL_GUTTER: number
  editMode: boolean
}>()

const emit = defineEmits(['startDrag', 'startResize'])

const cardStyle = computed(() => {
  if (props.resizingWidget?.id === props.widget.id && props.resizingStyle) {
    return {
      left: `${props.resizingStyle.left}px`,
      top: `${props.resizingStyle.top}px`,
      width: `${props.resizingStyle.width}px`,
      height: `${props.resizingStyle.height}px`,
      zIndex: 9999,
      opacity: 0.8
    }
  } else if (props.draggingWidget?.id === props.widget.id && props.draggingStyle) {
    return {
      left: `${props.draggingStyle.left + 5}px`,
      top: `${props.draggingStyle.top + 5}px`,
      width: `${props.widget.w * props.cellWidth + (props.widget.w - 1) * props.CELL_GUTTER}px`,
      height: `${props.widget.h * props.CELL_HEIGHT + (props.widget.h - 1) * props.CELL_GUTTER}px`,
      zIndex: 9999,
      opacity: 0.8
    }
  } else {
    return {
      left: `${props.widget.x * (props.cellWidth + props.CELL_GUTTER) + 5}px`,
      top: `${props.widget.y * (props.CELL_HEIGHT + props.CELL_GUTTER) + 5}px`,
      width: `${props.widget.w * props.cellWidth + (props.widget.w - 1) * props.CELL_GUTTER}px`,
      height: `${props.widget.h * props.CELL_HEIGHT + (props.widget.h - 1) * props.CELL_GUTTER}px`
    }
  }
})

</script>

<template>
  <q-card
    class="widget"
    :class="{ 'with-transition': draggingWidget?.id !== widget.id, 'editable': editMode }"
    :style="cardStyle"
    @mousedown.prevent="editMode && emit('startDrag', $event, widget)"
  >
    <div class="widget-inner">
      <slot />
    </div>
    <div
      v-if="editMode"
      class="resize-handle"
      @mousedown.stop.prevent="emit('startResize', $event, widget)"
    >
      <img src="../../assets/resize-handle-svgrepo-com.svg" />
    </div>
  </q-card>
</template>

<style scoped>
.widget {
  position: absolute;
  cursor: default;
  user-select: none;
  min-width: 100px;
  min-height: 100px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.widget-inner {
  flex: 1;
  overflow: auto;
  padding: 8px;
}
.widget.with-transition {
  transition: left 0.25s ease, top 0.25s ease;
}
.widget.editable {
  cursor: grabbing;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  border-bottom-right-radius: 4px;
  z-index: 10;
}
img {
  width: 100%;
  height: 100%;
}
</style>
