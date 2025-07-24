<script setup lang="ts">
import Widget from '../widget-comps/Widget.vue';
import { QIcon } from 'quasar';
const newsList = [
  { title: 'US gold reserves fall sharply in Q2', time: '10 mins ago' },
  { title: 'CNY strengthens as China boosts exports', time: '30 mins ago' },
  { title: 'Eurozone inflation expected to cool', time: '1h ago' },
  { title: 'Türkiye reveals 2025 financial strategy', time: '2h ago' },
  { title: 'US continiues on ambargo to the east', time: '3h ago' },
  { title: 'Russia rises the prices on gas exports', time: '7h ago' },
  { title: 'Cyprus is silent after a big raise to home prices', time: '10h ago' },    
]
</script>

<template>
  <Widget :title="'Latest Economy News'">
    <ul>
      <template v-for="(item, index) in newsList" :key="index">
        <li>
          <q-icon name="article" class="q-mr-sm"/>
          <span class="overflow-hidden text-bold">{{ item.title }}</span>
          <span class="timestamp">{{ item.time }}</span>
        </li>
        <hr v-if="index !== newsList.length - 1" class="q-my-sm" />
      </template>
    </ul>
  </Widget>
</template>


<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}
li {
  margin-bottom: 8px;
  padding-right: 60px;
  display: flex;
  font-size: 14px;
  cursor: pointer;
}
.timestamp {
  margin: 0 0 0 auto;
  font-size: 12px;
  color: #888;
}
</style>
