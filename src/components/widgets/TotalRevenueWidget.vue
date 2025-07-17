<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
import type { WidgetItem } from '../widget-comps/widgetRegistry'
defineProps<{ widget: WidgetItem }>()
</script>

<template>
  <Widget :title="widget.name">
    <div class="text-h5 q-mt-sm text-weight-bold">₺184,000</div>
    <div class="text-caption text-grey-7 q-mt-xs">Bu ayın toplamı</div>
  </Widget>
</template>