<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
</script>

<template>
  <Widget title="Gelir Özeti">
    <div class="widget-box">
      <div class="value">$123,456</div>
    </div>
  </Widget>
</template>

<style scoped>
.widget-box {
  background: white;
  border-radius: 8px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.value {
  font-size: 20px;
}
</style>
