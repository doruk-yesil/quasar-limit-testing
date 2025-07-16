<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
import type { WidgetItem } from '../../types/widget'

defineProps<{
  widget: WidgetItem
}>()
</script>

<template>
  <Widget :widget="widget" :title="widget.name">
    <div class="value-card-content">
      <div class="text-h5 text-weight-bold text-green-10">
        {{ Math.floor(Math.random() * 100000) }}
      </div>
      <div class="text-caption text-grey-6">Bu ay</div>
    </div>
  </Widget>
</template>

<style scoped>
.value-card-content {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
}
</style>
