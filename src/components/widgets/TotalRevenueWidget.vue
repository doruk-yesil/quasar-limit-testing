<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
</script>

<template>
  <Widget title="Toplam Gelir">
    <div class="widget-box">
      <div class="text-h5 q-mt-sm text-weight-bold">₺184,000</div>
      <div class="text-caption text-grey-7 q-mt-xs">Bu ayın toplamı</div>
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
</style>
