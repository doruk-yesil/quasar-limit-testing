<script setup lang="ts">
import {
  QTable,
  QInput,
  QIcon,
  QTh,
  QTr,
  QMenu,
  QBtn,
  exportFile
  // QDialog,
  // QCard,
  // QCardSection,
  // QCardActions,
  // QToggle,
} from 'quasar'

import { ref, watchEffect } from 'vue'
import type { Employee } from '../types/employee'
import { fetchEmployees } from '../services/employeeService'
import ColumnFilterMenu from './ColumnFilterMenu.vue'

const rows = ref<Employee[]>([])
const loading = ref(true)
const filter = ref('')
const filters = ref<Record<string, any>>({})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: 'id',
  descending: false
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', type: 'number' },
  { name: 'name', label: 'Name', field: 'name', type: 'string' },
  { name: 'surname', label: 'Surname', field: 'surname', type: 'string' },
  { name: 'department', label: 'Department', field: 'department', type: 'string' },
  { name: 'hireDate', label: 'Hire Date', field: 'hireDate', type: 'date' },
  { name: 'salary', label: 'Salary', field: 'salary', type: 'number' },
  { name: 'availability', label: 'Available', field: 'availability', type: 'boolean' },
  { name: 'telephone', label: 'Telephone', field: 'telephone', type: 'string' },
  { name: 'location', label: 'Location', field: 'location', type: 'string' },
  { name: 'email', label: 'Email', field: 'email', type: 'string' },
  { name: 'assets', label: 'Assets', field: 'assets', type: 'string' }
]

const MAX_LIMIT = 100

watchEffect(async () => {
  loading.value = true
  try {
    const rowsPerPage = Math.min(pagination.value.rowsPerPage, MAX_LIMIT)

    const data = await fetchEmployees({
      q: filter.value,
      page: pagination.value.page,
      rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending
    })
    if (!Array.isArray(data)) throw new Error('Expected array from backend')

    rows.value = data
    
  } catch (err) {
    console.error('fetchEmployees error:', err)
  } finally {
    loading.value = false
  }
})

const updateColumnFilter = (colName: string, filterData: any) => {
  filters.value[colName] = filterData
  console.log(`Filter for ${colName}:`, filterData)
}

const toggleSort = (colName: string) => {
  if (pagination.value.sortBy === colName) {
    pagination.value.descending = !pagination.value.descending
  } else {
    pagination.value.sortBy = colName
    pagination.value.descending = false
  }
}

const getSortIcon = (colName: string) => {
  if (pagination.value.sortBy !== colName) return 'unfold_more'
  return pagination.value.descending ? 'arrow_downward' : 'arrow_upward'
}

const exportCsv = () => {
  if (!rows.value.length) return

  const csvContent = [
    columns.map(col => `"${col.label}"`).join(','),
    ...rows.value.map(row =>
      columns.map(col => `"${(row as any)[col.field] ?? ''}"`).join(',')
    )
  ].join('\r\n')

  const csvWithBOM = '\uFEFF' + csvContent
  exportFile('employees.csv', csvWithBOM, 'text/csv')
}
</script>


<template>
  <div class="q-pa-md" style="max-width: 100%; margin: auto;">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
      class="q-mt-md"
      style="height: 600px"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template #top-left>
        <div class="row items-center q-gutter-sm">
          <q-input
            v-model="filter"
            debounce="300"
            placeholder="Search..."
            dense
            filled
            clearable
            style="max-width: 250px;"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <template #top-right>
        <div class="row items-center q-gutter-sm">
          <q-btn
            label="Export CSV"
            icon="file_download"
            unelevated
            color="secondary"
            @click="exportCsv"
          />
        </div>
      </template>
      <template #header="props">
        <q-tr :props="props" class="sticky-header-row">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="q-table--col-auto"
          >
            <div class="row items-center no-wrap justify-between" style="min-height: 24px">
              <div
                class="row items-center cursor-pointer"
                style="min-width: 90px;"
                @click="toggleSort(col.name)"
              >
                <span class="text-truncate">{{ col.label }}</span>
                <q-icon
                  :name="getSortIcon(col.name)"
                  size="16px"
                  class="q-ml-xs"
                />
              </div>
              <q-icon
                name="filter_alt"
                size="16px"
                class="cursor-pointer q-ml-xs"
              >
                <q-menu anchor="bottom right" self="top right">
                  <ColumnFilterMenu
                    :field="col.name"
                    :dataType="col.type"
                    v-model="filters[col.name]"
                    @apply="updateColumnFilter(col.name, $event)"
                    @reset="updateColumnFilter(col.name, null)"
                  />
                </q-menu>
              </q-icon>
            </div>
          </q-th>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>
.q-table th {
  vertical-align: middle;
}
.sticky-header-row {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}
</style>
