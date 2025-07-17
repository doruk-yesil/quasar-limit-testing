<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue'
</script>

<template>
  <Widget title="">
    <div class="text-h5 text-weight-bold text-green-10">
      {{ Math.floor(Math.random() * 100000) }}
    </div>
    <div class="text-caption text-grey-6">Bu ay</div>
  </Widget>
</template>