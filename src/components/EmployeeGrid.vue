<script setup lang="ts">
import {
  QTable,
  QInput,
  QIcon,
  QTh,
  QTr,
  QMenu,
  QBtn,
  QPagination,
  QSelect,
  QChip,
  QTd,
  QList,
  QSeparator,
  QItem,
  QItemSection,
  QItemLabel,
  exportFile
} from 'quasar'
import { ref, watch } from 'vue'
import type { Employee } from '../types/employee'
import { fetchEmployees } from '../services/employeeService'
import ColumnFilterMenu from './ColumnFilterMenu.vue'

const rows = ref<Employee[]>([])
const loading = ref(true)
const filter = ref('')
const hoveredRow = ref<number | null>(null)
const showRowIndex = ref(true)

interface FilterItem {
  operator: string
  value: any
  value2?: any
}

const filters = ref<Record<string, FilterItem[]>>({})
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'id',
  descending: false,
  rowsNumber: 0
})

const columns = [
  { name: 'actions', label: '', field: 'id', align: 'left' as const, sortable: false, style: 'width: 1px', headerStyle: 'width: 1px' },
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

const fetchData = async () => {
  loading.value = true
  try {
    const rowsPerPage = pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage
    const { data, total } = await fetchEmployees({
      q: filter.value,
      page: pagination.value.page,
      rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
      filters: filters.value
    })
    rows.value = data
    pagination.value.rowsNumber = total
  } catch (err) {
    console.error('fetchEmployees error:', err)
  } finally {
    loading.value = false
  }
}

const getRowIndex = (rowIndex: number) => {
  return (pagination.value.page - 1) * pagination.value.rowsPerPage + rowIndex + 1
}


watch(
  [
    () => pagination.value.page,
    () => pagination.value.rowsPerPage,
    () => pagination.value.sortBy,
    () => pagination.value.descending,
    () => filter.value,
    () => filters.value
  ],
  () => {
    fetchData()
  },
  { immediate: true, deep: true }
)

const updateColumnFilter = (colName: string, filterData: FilterItem[] | null) => {
  if (!filterData || !Array.isArray(filterData)) {
    filters.value[colName] = []
    return
  }
  filters.value[colName] = filterData
  pagination.value.page = 1
}


const removeFilter = (colName: string, filterIndex: number) => {
  filters.value[colName].splice(filterIndex, 1)
  if (filters.value[colName].length === 0) {
    delete filters.value[colName]
  }
  pagination.value.page = 1
}

const clearAllFilters = () => {
  filters.value = {}
  pagination.value.page = 1
}

const getFilterLabel = (field: string, filter: FilterItem): string => {
  if (!filter || !filter.operator) return ''
  const op = filter.operator.replace(/_/g, ' ')
  if (filter.operator === 'between' && filter.value2)
    return `${field}: ${filter.value} - ${filter.value2}`
  return `${field}: ${op} ${filter.value}`
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
    <q-table :rows="rows" :columns="columns" row-key="id" :loading="loading" flat bordered class="q-mt-md"
      style="height: 600px" :pagination="pagination" :rows-per-page-options="[10, 20, 50, { label: 'All', value: 0 }]"
      rows-per-page-label="">
      <template #top-left>
        <div class="column q-gutter-sm">
          <div class="row items-center q-gutter-sm">
            <q-input v-model="filter" debounce="300" placeholder="Search..." dense filled clearable
              style="max-width: 250px;">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div v-if="Object.keys(filters).length" class="row items-center q-gutter-sm">
            <span class="text-bold text-caption">Applied Filters:</span>
            <template v-for="(filterList, field) in filters" :key="field">
              <q-chip v-for="(filter, index) in filterList" :key="index" removable @remove="removeFilter(field, index)"
                color="grey-2" text-color="black" class="q-px-sm text-caption items-center">
                <div class="row items-center no-wrap">
                  <span>
                    {{ getFilterLabel(field, filter) }}
                  </span>
                </div>
              </q-chip>
            </template>
            <q-btn flat label="Clear All" color="primary" size="sm" @click="clearAllFilters" />
          </div>
        </div>
      </template>

      <template #top-right>
        <div class="row items-center q-gutter-sm">
          <q-btn label="Export CSV" icon="file_download" unelevated color="secondary" @click="exportCsv" />
        </div>
      </template>

      <template #header="props">
        <q-tr :props="props" class="sticky-header-row">
          <q-th v-if="showRowIndex" class="text-left" style="width: 40px;">#</q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="q-table--col-auto"
            :style="col.name === 'actions' ? 'position: sticky; left: 0; z-index: 3; width: 1px; background: white;' : ''">
            <template v-if="col.name !== 'actions'">
              <div class="row items-center no-wrap justify-between" style="min-height: 24px">
                <div class="row items-center cursor-pointer" style="min-width: 90px;" @click="toggleSort(col.name)">
                  <span class="text-truncate">{{ col.label }}</span>
                  <q-icon :name="getSortIcon(col.name)" size="16px" class="q-ml-xs" />
                </div>
                <q-icon name="filter_alt" size="16px" class="cursor-pointer q-ml-xs">
                  <q-menu anchor="bottom right" self="top right">
                    <ColumnFilterMenu :field="col.name" :dataType="col.type" :modelValue="filters[col.name] || []"
                      @apply="updateColumnFilter(col.name, $event)" @reset="updateColumnFilter(col.name, null)" />
                  </q-menu>
                </q-icon>
              </div>
            </template>
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr :props="props" @mouseenter="hoveredRow = props.row.id" @mouseleave="hoveredRow = null">
          <q-td v-if="showRowIndex" class="text-left">{{ getRowIndex(props.rowIndex) }}</q-td>
          <q-td class="sticky-left-col">
            <q-btn icon="more_vert" size="sm" flat round dense class="transition-all"
              :class="{ 'visible': hoveredRow === props.row.id, 'invisible': hoveredRow !== props.row.id }">
              <q-menu>
                <q-list dense style="min-width: 150px;">
                  <q-item clickable v-close-popup>
                    <q-item-section>Edit row</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Delete row</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup>
                    <q-item-section>Fix row to top</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="showRowIndex = !showRowIndex">
                    <q-item-section>
                      <q-item-label>{{ showRowIndex ? 'Hide Index' : 'Show Index' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
          <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
            {{ props.row[col.name] }}
          </q-td>
        </q-tr>
      </template>

      <template #bottom>
        <div class="row justify-between items-center q-pa-sm full-width">
          <div class="col-auto flex justify-center">
            <q-pagination v-model="pagination.page"
              :max="pagination.rowsPerPage === 0 ? 1 : Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)" input
              direction-links boundary-numbers color="primary" dense />
          </div>
          <div class="col-auto row items-center q-gutter-sm">
            <span class="text-caption">Records per page:</span>
            <q-select v-model="pagination.rowsPerPage" :options="[10, 20, 50, { label: 'All', value: 0 }]" dense
              outlined emit-value map-options style="min-width: 80px;" />
          </div>
        </div>
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
  z-index: 3;
  background: white;
}

.sticky-left-col {
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
  width: 1px;
  /*border-right: 1px solid #e0e0e0;*/
}

.invisible {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.visible {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.2s;
}

.q-table__middle::-webkit-scrollbar {
  height: 8px;
}

.q-table__middle::-webkit-scrollbar-track {
  background: transparent;
}

.q-table__middle::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.q-table__middle::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
