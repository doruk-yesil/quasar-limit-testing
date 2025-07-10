<template>
  <div class="bar-chart-widget">
    <div class="text-h6 q-mb-sm">{{ widget.name }}</div>
    <div class="bar-chart-placeholder">
      <div
        v-for="(value, index) in dummyData"
        :key="index"
        class="bar"
        :style="{ height: `${value}px` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ widget: any }>()

const dummyData = [60, 120, 90, 180, 75, 140, 100]
</script>

<style scoped>
.bar-chart-widget {
  padding: 10px;
  text-align: center;
  max-height: 100%;
}

.bar-chart-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  max-height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding-top: 75px;
}

.bar {
  width: 25px;
  background-color: #09898d;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}
</style>
