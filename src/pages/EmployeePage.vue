<script setup lang="ts">
import EmployeeGrid from '../components/EmployeeGrid.vue'
</script>

<template>
  <div class="q-pa-md">
    <div class="text-center q-mb-md">
      <h3>Financial People</h3>
    </div>

    <div class="q-gutter-md flex flex-center">
      <div style="max-width: 1200px; width: 100%">
        <employee-grid />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
