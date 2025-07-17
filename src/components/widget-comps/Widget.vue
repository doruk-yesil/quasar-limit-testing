<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="widget-wrapper q-pa-md q-mb-md bg-white rounded shadow-sm">
    <div v-if="title" class="text-h6 q-mb-sm">{{ title }}</div>
    <slot />
  </div>
</template>

<style scoped>
.widget-wrapper {
  height: 100%;
}
</style>
