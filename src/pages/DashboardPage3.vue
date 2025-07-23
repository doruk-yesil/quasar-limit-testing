<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Header from '../components/Header.vue'
import DashboardLayout from '../components/widget-comps/DashboardLayout.vue'
import { initialWidgetState, type WidgetItem } from '../components/widget-comps/widgetRegistry'
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
  QBanner,
  QSelect
} from 'quasar'

const showSettingsDialog = ref(false)
const showWidgetDialog = ref(false)
const editMode = ref(false)
const containerMode = ref<'fixed' | 'auto'>('fixed')
const allWidgets = ref<WidgetItem[]>(JSON.parse(JSON.stringify(initialWidgetState)))

function openSettings() {
  showSettingsDialog.value = true
}

function resetAllLayouts() {
  localStorage.removeItem('dashboard-layout')
  containerMode.value = 'fixed'
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      nextTick(() => {
        allWidgets.value = JSON.parse(JSON.stringify(initialWidgetState)).map((w: WidgetItem) => ({
          ...w,
          locked: false
        }))
      })
    }, i * 50)
  }
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
      v-model:all-widgets="allWidgets"
      :edit-mode="editMode"
      :container-mode="containerMode"
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
          <q-select
            v-model="containerMode"
            :options="['fixed', 'auto']"
            label="Dashboard Alanı"
            filled
            dense
            class="q-mt-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Layout’u Sıfırla" color="negative" @click="resetAllLayouts"/>
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
