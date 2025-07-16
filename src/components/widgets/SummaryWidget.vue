<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
import type { WidgetItem } from '../../types/widget'

defineProps<{ widget: WidgetItem }>()
</script>

<template>
  <Widget :widget="widget" :title="widget.name">
    <div class="value">$123,456</div>
  </Widget>
</template>

<style scoped>
.value {
  font-size: 20px;
  font-weight: bold;
  color: #09898d;
}
</style>
