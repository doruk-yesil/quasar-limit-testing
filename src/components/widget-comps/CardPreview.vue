<script setup lang="ts">
defineProps<{
  preview: { x: number; y: number; w: number; h: number }
  cellWidth: number
  CELL_HEIGHT: number
  CELL_GUTTER: number
}>()
</script>

<template>
  <div
    class="card-preview"
    :style="{
      left: `${preview.x * (cellWidth + CELL_GUTTER) + 5}px`,
      top: `${preview.y * (CELL_HEIGHT + CELL_GUTTER) + 5}px`,
      width: `${preview.w * cellWidth + (preview.w - 1) * CELL_GUTTER}px`,
      height: `${preview.h * CELL_HEIGHT + (preview.h - 1) * CELL_GUTTER}px`
    }"
  />
</template>

<style scoped>
.card-preview {
  position: absolute;
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: 8px;
  pointer-events: none;
  z-index: 0;
}
</style>
