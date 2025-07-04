<script setup lang="ts">
import {
  QTable,
  QInput,
  QIcon,
  QTh,
  QTr,
  QMenu,
  // QBtn,
  // QDialog,
  // QCard,
  // QCardSection,
  // QCardActions,
  // QToggle,
  // exportFile,
} from 'quasar'

import { ref, watch } from 'vue'
import type { Employee } from '../types/employee'
import { fetchEmployees } from '../services/employeeService'
import ColumnFilterMenu from './ColumnFilterMenu.vue'

const rows = ref<Employee[]>([])
const loading = ref(true)
const filter = ref('')
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: 'id',
  descending: false
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true, type: 'number' },
  { name: 'name', label: 'Name', field: 'name', sortable: true, type: 'string' },
  { name: 'surname', label: 'Surname', field: 'surname', sortable: true, type: 'string' },
  { name: 'department', label: 'Department', field: 'department', sortable: true, type: 'string' },
  { name: 'hireDate', label: 'Hire Date', field: 'hireDate', sortable: true, type: 'date' },
  { name: 'salary', label: 'Salary', field: 'salary', sortable: true, type: 'number' },
  { name: 'availability', label: 'Available', field: 'availability', sortable: true, type: 'boolean' },
  { name: 'telephone', label: 'Telephone', field: 'telephone', sortable: true, type: 'string' },
  { name: 'location', label: 'Location', field: 'location', sortable: true, type: 'string' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, type: 'string' },
  { name: 'assets', label: 'Assets', field: 'assets', sortable: true, type: 'string' }
]

const MAX_LIMIT = 100
const filters = ref<Record<string, any>>({})
const menuRefs = ref<Record<string, QMenu | null>>({});

watch(
  [() => filter.value, () => pagination.value.page, () => pagination.value.rowsPerPage],
  async () => {
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

      if (!Array.isArray(data)) {
        console.error('Invalid data from API:', data)
        throw new Error('Expected array from backend')
      }

      rows.value = data
    } catch (err) {
      console.error('fetchEmployees error:', err)
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

const updateColumnFilter = (colName: string, filterData: any) => {
  filters.value[colName] = filterData
  console.log(`Filter for ${colName}:`, filterData)
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
        <div class="q-gutter-sm q-mr-auto flex justify-end">
          <q-input
            v-model="filter"
            class="q-mx-auto"
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

      <template #header="props">
        <q-tr :props="props" class="sticky-header-row">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="q-table--col-auto"
          >
            <div class="row items-center no-wrap justify-between" style="min-height: 24px; position: relative;">
              <span class="text-truncate">{{ col.label }}</span>
              <q-icon
                name="filter_alt"
                size="16px"
                class="cursor-pointer q-ml-xs"
                @click.stop="menuRefs.value[col.name]?.show()"
              />
              <q-menu
                :ref="(el: QMenu | null) => { if (col.name && el) menuRefs.value[col.name as string] = el }"
                anchor="bottom right"
                self="top right"
              >
                <ColumnFilterMenu
                  :field="col.name"
                  :dataType="col.type"
                  v-model="filters[col.name]"
                  @apply="updateColumnFilter(col.name, $event)"
                  @reset="updateColumnFilter(col.name, null)"
                />
              </q-menu>
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
