<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
import type { WidgetItem } from '../widget-comps/widgetRegistry'
defineProps<{ widget: WidgetItem }>()
</script>

<template>
  <Widget :title="widget.name">
    <div class="value">$123,456</div>
  </Widget>
</template>

<style scoped>
.value {
  text-align: center;
  font-size: 20px;
  padding: 15px;
  margin: 75px 0 0 0;
}
</style>
