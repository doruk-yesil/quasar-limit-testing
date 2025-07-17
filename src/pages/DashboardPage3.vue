<script setup lang="ts">
import { ref } from 'vue'
import Header from '../components/Header.vue'
import DashboardLayout from '../components/widget-comps/DashboardLayout.vue'
import type { WidgetItem } from '../components/widget-comps/widgetRegistry'
import {
  QBtn,
  QCard,
  QToggle,
  QDialog,
  QItem,
  QItemSection,
  QList,
  QCardSection,
  QCheckbox,
  QCardActions,
  QBanner
} from 'quasar'

const showSettingsDialog = ref(false)
const showWidgetDialog = ref(false)
const editMode = ref(false)

const allWidgets = ref<WidgetItem[]>([
  { id: '1', name: 'Gelir Kartı', x: 0, y: 0, w: 3, h: 3, visible: true, type: 'summary' },
  { id: '2', name: 'Bar Grafik', x: 3, y: 0, w: 3, h: 3, visible: true, type: 'bar-chart' },
  { id: '3', name: 'Zaman Serisi', x: 6, y: 0, w: 4, h: 3, visible: true, type: 'line-chart' },
  { id: '4', name: 'Dağılım Pasta', x: 10, y: 0, w: 2, h: 3, visible: true, type: 'pie-chart' },
  { id: '5', name: 'Veri Tablosu', x: 0, y: 3, w: 6, h: 2, visible: true, type: 'table' },
  { id: '6', name: 'Aktif Kullanıcı', x: 6, y: 3, w: 2, h: 1, visible: true, type: 'kpi' },
  { id: '7', name: 'Yeni Kayıtlar', x: 8, y: 3, w: 2, h: 1, visible: true, type: 'kpi' },
  { id: '8', name: 'Ziyaret Süresi', x: 10, y: 3, w: 2, h: 1, visible: true, type: 'kpi' },
  { id: '9', name: 'Son İşlemler', x: 0, y: 5, w: 4, h: 2, visible: true, type: 'activity' },
  { id: '10', name: 'Toplam Gelir', x: 4, y: 6, w: 3, h: 1, visible: true, type: 'total-revenue' }
])

function openSettings() {
  showSettingsDialog.value = true
}
</script>

<template>
  <div class="q-pa-md">
    <Header />
    <h4 class="text-center">Dashboard v3 (DraggableCard)</h4>
    <q-banner class="bg-primary text-white q-my-md">
      💼 Welcome to your Finance Dashboard —
      <span class="text-italic text-bold">You have 2 new notifications</span>
    </q-banner>
    <DashboardLayout
      :initial-widgets="allWidgets"
      :edit-mode="editMode"
    />
    <q-btn
      fab
      color="primary"
      icon="settings"
      @click="openSettings"
      class="settings-btn"
    />
    <q-dialog v-model="showSettingsDialog">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Ayarlar</div>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-toggle v-model="editMode" label="Edit Mode" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Widget Listesi" @click="showWidgetDialog = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showWidgetDialog">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Widget Listesi</div>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item v-for="widget in allWidgets" :key="widget.id">
              <q-item-section>
                <q-checkbox v-model="widget.visible" :label="widget.name" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.settings-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}
</style>
