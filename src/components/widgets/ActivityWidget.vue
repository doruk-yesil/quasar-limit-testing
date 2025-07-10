<template>
  <div class="activity-widget">
    <div class="text-h6 q-mb-sm">{{ widget.name }}</div>
    <q-list bordered separator>
      <q-item v-for="(activity, index) in activities" :key="index">
        <q-item-section avatar>
          <q-avatar icon="event_note" color="primary" text-color="white" />
        </q-item-section>
        <q-item-section> | 
          <q-item-label>{{ activity.message }}</q-item-label>
          <q-item-label caption class="text-grey"> / 
            {{ activity.user }} — {{ activity.date }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
defineProps<{ widget: any }>()

const activities = [
  { message: '₺4.500 fatura ödendi', user: 'Ahmet Y.', date: '10 Temmuz 14:32' },
  { message: 'Yeni kullanıcı kaydoldu', user: 'Mehmet A.', date: '10 Temmuz 13:10' },
  { message: 'Stok güncellendi', user: 'Admin', date: '09 Temmuz 18:20' },
  { message: '₺12.000 ödeme alındı', user: 'Zeynep K.', date: '09 Temmuz 11:02' }
]
</script>

<style scoped>
.activity-widget {
  padding: 10px;
  font-size: 14px;
}
</style>
