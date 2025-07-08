<script setup lang="ts">
import { ref } from 'vue'
import { QBtn, QDialog, QCard, QCardSection, QCardActions, QToggle } from 'quasar'
// @ts-ignore
import { GridLayout, GridItem } from 'vue3-grid-layout'
import Header from '../components/Header.vue'
import DashboardWidget from '../components/DashboardWidget.vue'

const showSettings = ref(false)
const dummyToggle = ref(false)

const layout = ref([
  { x: 0, y: 0, w: 4, h: 3, i: '1' },
  { x: 4, y: 0, w: 4, h: 3, i: '2' },
  { x: 8, y: 0, w: 4, h: 3, i: '3' },
  { x: 0, y: 3, w: 8, h: 4, i: '4' },
  { x: 8, y: 3, w: 4, h: 4, i: '5' }
])
</script>

<template>
  <div class="q-pa-md">
    <Header />

    <h4 class="text-h5 text-center q-mt-md">Dashboard Overview</h4>

    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="50"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :margin="[10, 10]"
      style="min-height: 600px;"
    >
      <grid-item v-for="item in layout" :key="item.i" v-bind="item">
        <DashboardWidget :title="`Widget ${item.i}`">
          <!-- İçerik buraya: tablo, chart, metin vs. -->
          <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
            İçerik alanı {{ item.i }}
          </div>
        </DashboardWidget>
      </grid-item>
    </grid-layout>

    <!-- Ayarlar butonu -->
    <q-btn
      round
      color="primary"
      icon="settings"
      class="fixed-bottom-right q-mr-lg q-mb-lg z-max"
      @click="showSettings = true"
    />

    <!-- Ayarlar penceresi -->
    <q-dialog v-model="showSettings">
      <q-card>
        <q-card-section class="text-h6">Settings</q-card-section>
        <q-card-section>
          <q-toggle label="Enable Dark Mode (dummy)" v-model="dummyToggle" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
/* Eğer gerekirse */
</style>
