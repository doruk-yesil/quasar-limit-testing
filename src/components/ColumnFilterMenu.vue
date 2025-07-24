<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { QInput, QSelect, QOptionGroup, QDate, QBtn, QIcon } from 'quasar'

interface FilterItem {
  operator: string
  value: any
  value2?: any
}

const props = defineProps<{
  field: string
  dataType: 'string' | 'number' | 'date' | 'boolean'
  modelValue: FilterItem[]
}>()

const emit = defineEmits(['update:modelValue', 'apply', 'reset'])

const localFilters = ref<FilterItem[]>([...props.modelValue])

watch(
  () => props.modelValue,
  val => {
    localFilters.value = [...val]
  },
  { immediate: true }
)

const operatorOptions = computed(() => {
  switch (props.dataType) {
    case 'string':
      return ['contains', 'not contains', 'equals']
    case 'number':
      return ['equals', 'greater than', 'less than', 'between']
    case 'date':
      return ['is', 'before', 'after', 'between']
    case 'boolean':
      return ['is_true', 'is_false']
    default:
      return []
  }
})

const selectedOperator = ref(operatorOptions.value[0])
const value1 = ref('')
const value2 = ref('')

function addFilter() {
  if (!selectedOperator.value || value1.value === '') return

  const newFilter: FilterItem = {
    operator: selectedOperator.value,
    value: value1.value,
    value2: value2.value || null
  }

  localFilters.value.push(newFilter)
  value1.value = ''
  value2.value = ''
  selectedOperator.value = operatorOptions.value[0]
}

function applyFilters() {
  emit('update:modelValue', localFilters.value)
  emit('apply', localFilters.value)
}

function resetFilters() {
  localFilters.value = []
  emit('update:modelValue', [])
  emit('reset')
}

function removeFilter(index: number) {
  localFilters.value.splice(index, 1)
}
</script>

<template>
  <div class="q-pa-sm" style="min-width: 240px;">
    <q-select v-model="selectedOperator" :options="operatorOptions" label="Operator" dense filled class="q-mb-sm" />

    <div v-if="dataType === 'string' || dataType === 'number'">
      <q-input v-if="selectedOperator !== 'between'" v-model="value1" label="Value" dense filled class="q-mb-sm" />
      <div v-else class="row q-col-gutter-sm q-mb-sm">
        <q-input v-model="value1" label="From" dense filled class="col" />
        <q-input v-model="value2" label="To" dense filled class="col" />
      </div>
    </div>

    <div v-else-if="dataType === 'date'">
      <q-date v-model="value1" mask="YYYY-MM-DD" flat />
    </div>

    <div v-else-if="dataType === 'boolean'" class="q-mb-sm">
      <q-option-group v-model="value1" type="radio" :options="[
        { label: 'True', value: true },
        { label: 'False', value: false }
      ]" dense inline />
    </div>

    <q-btn label="Add Filter" icon="add" color="primary" size="sm" @click="addFilter" class="q-mb-sm" unelevated />

    <div v-if="localFilters.length" class="q-mb-sm">
      <template v-for="(filter, index) in localFilters" :key="index">
        <div v-if="filter?.operator" class="q-mb-xs row items-center justify-between bg-grey-2 q-pa-xs">
          <div class="text-caption">
            {{ filter.operator.replace(/_/g, ' ') }}
            {{ filter.value }}
            <span v-if="filter.operator === 'between' && filter.value2"> - {{ filter.value2 }}</span>
          </div>
          <q-icon name="close" size="16px" class="cursor-pointer" @click="removeFilter(index)" />
        </div>
      </template>
    </div>

    <div class="row justify-between q-mt-sm">
      <q-btn label="Reset" flat color="primary" size="sm" @click="resetFilters" />
      <q-btn label="Apply" color="primary" unelevated size="sm" @click="applyFilters" />
    </div>
  </div>
</template>
