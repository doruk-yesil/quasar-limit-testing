<script setup lang="ts">
import { widgetMap, type WidgetItem } from './widgetRegistry'

defineProps<{
  widget: WidgetItem
  editMode: boolean
}>()
const DefaultWidget = widgetMap['summary']
</script>

<template>
  <component :is="widgetMap[widget.type] || DefaultWidget" :widget="widget" :showLockIcon="editMode && widget.locked"
    @settings="$emit('openSettings', widget)" @toggleLock="$emit('toggleLock', widget)" />
</template>
