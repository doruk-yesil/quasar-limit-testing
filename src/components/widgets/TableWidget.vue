<script setup lang="ts">
import { QMarkupTable } from 'quasar';

const rows = [
  { category: 'Satış Geliri', amount: 12500, date: '10 Temmuz 2025' },
  { category: 'Abonelik', amount: 3400, date: '09 Temmuz 2025' },
  { category: 'Geri Ödeme', amount: -800, date: '08 Temmuz 2025' },
  { category: 'Yatırım', amount: 20000, date: '07 Temmuz 2025' }
]
</script>

<template>
  <div class="text-h6 text-center q-mb-md">📊 Özet Tablosu</div>
  <q-markup-table flat bordered class="table-widget">
    <thead>
      <tr>
        <th>Kategori</th>
        <th>Tutar</th>
        <th>Tarih</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td>{{ row.category }}</td>
        <td>₺{{ row.amount.toLocaleString('tr-TR') }}</td>
        <td>{{ row.date }}</td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<style scoped>
.table-widget th,
.table-widget td {
  text-align: center;
  padding: 0 75px;
  font-size: 15px;
}
.table-widget tbody tr + tr {
  border-top: 1px solid #e0e0e0;
}
</style>
