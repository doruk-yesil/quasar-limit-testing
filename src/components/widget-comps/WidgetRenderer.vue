<script setup lang="ts">
import { widgetMap, type WidgetItem } from './widgetRegistry'

defineProps<{ widget: WidgetItem }>()

const DefaultWidget = widgetMap['summary']
</script>

<template>
  <component 
    :is="widgetMap[widget.type] || DefaultWidget"
    :widget="widget"
    @settings="$emit('openSettings', widget)"
  />
</template>
