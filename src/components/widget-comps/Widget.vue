<script setup lang="ts">
import { inject, type Ref } from 'vue'
import DraggableCard from './DraggableCard.vue'
import type { WidgetItem } from '../../types/widget'

const { widget, title } = defineProps<{
  widget: WidgetItem
  title?: string
}>()

const context = inject('dashboardContext') as {
  draggingWidget: WidgetItem | null
  resizingWidget: WidgetItem | null
  draggingStyle: { left: number; top: number } | null
  resizingStyle: { left: number; top: number; width: number; height: number } | null
  cellWidth: Ref<number>
  CELL_HEIGHT: number
  CELL_GUTTER: number
  editMode: Ref<boolean>
  onStartDrag: (e: MouseEvent, widget: WidgetItem) => void
  onStartResize: (e: MouseEvent, widget: WidgetItem) => void
}

</script>

<template>
  <DraggableCard
    :widget="widget"
    :draggingWidget="context.draggingWidget"
    :resizingWidget="context.resizingWidget"
    :draggingStyle="context.draggingStyle"
    :resizingStyle="context.resizingStyle"
    :cellWidth="context.cellWidth.value"
    :CELL_HEIGHT="context.CELL_HEIGHT"
    :CELL_GUTTER="context.CELL_GUTTER"
    :editMode="context.editMode.value"
    @startDrag="context.onStartDrag"
    @startResize="context.onStartResize"
  >
    <div class="widget-box">
      <h6 v-if="title">{{ title }}</h6>
      <slot />
    </div>
  </DraggableCard>
</template>


<style scoped>
.widget-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
