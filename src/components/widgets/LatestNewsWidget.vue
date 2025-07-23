<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue';
const newsList = [
  { title: 'US gold reserves fall sharply in Q2', time: '10 mins ago' },
  { title: 'CNY strengthens as China boosts exports', time: '30 mins ago' },
  { title: 'Eurozone inflation expected to cool', time: '1h ago' },
  { title: 'Türkiye reveals 2025 financial strategy', time: '2h ago' }
]
</script>

<template>
  <Widget :title="'Latest Economy News'">
    <ul>
      <li v-for="(item, index) in newsList" :key="index">
        <span class="headline">{{ item.title }}</span>
        <span class="timestamp">{{ item.time }}</span>
      </li>
    </ul>
  </Widget>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.headline {
  font-weight: 500;
}
.timestamp {
  font-size: 12px;
  color: #888;
}
</style>
