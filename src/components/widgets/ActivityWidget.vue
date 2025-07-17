<script setup lang="ts">
import { QAvatar, QItemSection, QItemLabel, QItem, QList } from 'quasar'
import Widget from '../widget-comps/Widget.vue'

const activities = [
  { message: '₺4.500 fatura ödendi', user: 'Ahmet Y.', date: '10 Temmuz 14:32' },
  { message: 'Yeni kullanıcı kaydoldu', user: 'Mehmet A.', date: '10 Temmuz 13:10' },
  { message: 'Stok güncellendi', user: 'Admin', date: '09 Temmuz 18:20' },
  { message: '₺12.000 ödeme alındı', user: 'Zeynep K.', date: '09 Temmuz 11:02' }
]
</script>

<template>
  <Widget title="Aktiviteler">
    <q-list bordered separator>
      <q-item v-for="(activity, index) in activities" :key="index">
        <q-item-section avatar>
          <q-avatar icon="event_note" color="primary" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ activity.message }}</q-item-label>
          <q-item-label caption class="text-grey">
            {{ activity.user }} • {{ activity.date }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </Widget>
</template>
