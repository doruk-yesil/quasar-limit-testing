<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QToggle,
  QBanner,
  QLinearProgress,
  QCheckbox,
  QIcon
} from 'quasar'
// @ts-ignore
import { GridLayout, GridItem } from 'vue3-grid-layout'
import Header from '../components/Header.vue'
import DashboardWidget from '../components/DashboardWidget.vue'
import RevenueChart from '../components/widget-1/RevenueChart.vue'
import ProfitChart from '../components/widget-1/ProfitChart.vue'

const showSettings = ref(false)
const dummyToggle = ref(false)
const isEditMode = ref(false)

type LayoutItem = {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

const layout = ref<LayoutItem[]>([
  { x: 0, y: 0, w: 3, h: 4, i: '1' },
  { x: 3, y: 0, w: 3, h: 4, i: '2' },
  { x: 6, y: 0, w: 3, h: 4, i: '3' },
  { x: 9, y: 0, w: 3, h: 4, i: '4' },
  { x: 0, y: 3, w: 8, h: 5, i: '5' },
  { x: 8, y: 3, w: 4, h: 5, i: '6' }
])

const visibleWidgets = ref<Record<string, boolean>>({
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true
})

const filteredLayout = computed(() =>
  layout.value.filter((item) => visibleWidgets.value[item.i])
)

const widgetTitles: Record<string, string> = {
  '1': 'Total Revenue',
  '2': 'Total Expenses',
  '3': 'Net Profit',
  '4': 'Active Clients',
  '5': 'Revenue Trends (Last 12 Months)',
  '6': 'Profit Margin (%)'
}

const widgetContent: Record<string, string> = {
  '1': '$1.25M',
  '2': '$874K',
  '3': '$376K',
  '4': '182 Clients',
  '5': '[Graph Placeholder]',
  '6': '76%'
}
</script>

<template>
  <div class="q-pa-md">
    <Header />
    <h4 class="text-h5 text-center q-mt-md">Financial Overview</h4>
    <q-banner class="bg-primary text-white q-mt-md">
      💼 Welcome to your Finance Dashboard — <span class="text-italic text-bold">You have 2 new notifications</span>
    </q-banner>
    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="50"
      :is-draggable="isEditMode"
      :is-resizable="isEditMode"
      :vertical-compact="true"
      :margin="[10, 10]"
      style="min-height: 600px;"

    >
      <grid-item v-for="item in filteredLayout" :key="item.i" v-bind="item">
        <DashboardWidget :title="widgetTitles[item.i]">
          <RevenueChart v-if="item.i === '5'" />
          <ProfitChart v-else-if="item.i === '6'" />
          <div v-else-if="item.i==='1'">
            <div class="text-bold text-negative">71%</div>
            <q-linear-progress :value="0.71" color="negative" size="10px" class="q-mb-sm" />
            <div class="text-caption text-grey">Income Target</div>

            <div class="text-bold text-positive q-mt-md">54%</div>
            <q-linear-progress :value="0.54" color="positive" size="10px" class="q-mb-sm" />
            <div class="text-caption text-grey">Expense Target</div>
          </div>
          <div v-else-if="item.i==='2'">
            <div class="text-caption text-grey-7">New Accounts</div>
            <div class="text-h5 text-positive row items-center">
              <q-icon name="trending_up" class="q-mr-xs" />
              234%
            </div>

            <div class="text-caption text-grey-7 q-mt-md">Customer Churn</div>
            <div class="text-h5 text-negative row items-center">
              <q-icon name="trending_down" class="q-mr-xs" />
              18%
            </div>
          </div>
          <div v-else-if="item.i==='3'">
            <div class="text-caption text-grey-7">Monthly Revenue</div>
            <div class="text-h5 text-primary">$46,230</div>

            <div class="text-caption text-grey-7 q-mt-md">Monthly Spending</div>
            <div class="text-h5 text-accent">$38,745</div>
          </div>
          <div v-else-if="item.i==='4'">
            <div class="text-caption text-grey-7">Total Spend Target</div>
            <div class="text-bold text-warning">32%</div>
            <q-linear-progress :value="0.32" color="warning" size="10px" class="q-mb-sm" />

            <div class="text-caption text-grey-7 q-mt-md">Total Income Target</div>
            <div class="text-bold text-info">89%</div>
            <q-linear-progress :value="0.89" color="info" size="10px" />
          </div>
          <div v-else style="height: 100%; display: flex; align-items: center; justify-content: center;">
            {{ widgetContent[item.i] }}
          </div>
        </DashboardWidget>
      </grid-item>
    </grid-layout>

    <q-btn
      round
      color="primary"
      icon="settings"
      class="fixed-bottom-right q-mr-lg q-mb-lg z-max"
      @click="showSettings = true"
    />

    <q-dialog v-model="showSettings">
      <q-card>
        <q-card-section class="text-h6">Settings</q-card-section>
        <q-card-section>
          <q-toggle label="Enable Dark Mode (dummy)" v-model="dummyToggle" />
          <q-toggle label="Enable Edit Mode" v-model="isEditMode" />
          <div class="text-subtitle2 q-mb-sm">Visible Widgets</div>
          <div v-for="(title, id) in widgetTitles" :key="id" class="q-mb-xs">
            <q-checkbox v-model="visibleWidgets[id]" :label="title" color="primary" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

