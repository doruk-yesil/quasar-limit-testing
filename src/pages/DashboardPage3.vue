<script setup lang="ts">
import {
  QBanner,
  QBtn,
  QCard,
  QCardSection,
  QCheckbox,
  QDialog,
  QFab,
  QFabAction
} from 'quasar'
import { nextTick, ref } from 'vue'
import Header from '../components/Header.vue'
import DashboardLayout from '../components/widget-comps/DashboardLayout.vue'
import { initialWidgetState, type WidgetItem } from '../components/widget-comps/widgetRegistry'

const showWidgetDialog = ref(false)
const editMode = ref(false)
const containerMode = ref<'fixed' | 'auto'>('fixed')
const allWidgets = ref<WidgetItem[]>(JSON.parse(JSON.stringify(initialWidgetState)))

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
function activateEditMode() {
  editMode.value = true
}
function toggleContainerMode() {
  containerMode.value = containerMode.value === 'fixed' ? 'auto' : 'fixed'
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
    <DashboardLayout v-model:all-widgets="allWidgets" :edit-mode="editMode" :container-mode="containerMode" />
    <div class="row q-gutter-x-sm" style="bottom: 20px; right: 20px; position: fixed;">
      <div v-if="editMode" class="row q-gutter-x-sm">
        <q-fab padding="sm" icon="tune" active-icon="tune" color="accent"
          :label="containerMode === 'fixed' ? 'Grid-Length: Fixed' : 'Grid-Length: Auto'"
          @click="toggleContainerMode" />
        <q-fab padding="sm" icon="check" label="Kaydet" @click="editMode = false" color="positive" />
      </div>
      <q-fab padding="sm" vertical-actions-align="right" icon="settings" active-icon="close" direction="up"
        color="primary">
        <q-fab-action padding="xs" icon="edit" label="Gridi Düzenle" color="warning" @click="activateEditMode"
          v-if="!editMode" />
        <q-fab-action padding="xs" icon="widgets" label="Widget Listesi" color="secondary"
          @click="showWidgetDialog = true" />
        <q-fab-action padding="xs" icon="restart_alt" label="Layout’u Sıfırla" color="negative"
          @click="resetAllLayouts" />
      </q-fab>
    </div>
    <q-dialog v-model="showWidgetDialog">
      <q-card style="min-width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Widget Listesi</div>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div v-for="widget in allWidgets" :key="widget.id" class="col-3 q-pb-sm">
              <div class="row items-center">
                <q-checkbox v-model="widget.visible" :label="widget.name" class="q-mb-none" />
                <div class="text-caption text-grey-7 q-ml-sm"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  | {{ widget.description || 'Açıklama girilmedi' }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped></style>