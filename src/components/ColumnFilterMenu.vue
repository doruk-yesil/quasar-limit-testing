<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { QInput, QSelect, QToggle, QDate, QBtn } from 'quasar'

const props=defineProps<{
  field: string
  dataType: 'string' | 'number' | 'date' | 'boolean'
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue', 'apply', 'reset'])

const localValue = ref<any>(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    localValue.value = val
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
      return ['is true', 'is false']
    default:
      return []
  }
})

const selectedOperator = ref(operatorOptions.value[0])

const value1 = ref('')
const value2 = ref('')

const apply = () => {
  emit('update:modelValue', {
    operator: selectedOperator.value,
    value: value1.value,
    value2: value2.value || null
  })
  emit('apply')
}

const reset = () => {
  selectedOperator.value = operatorOptions.value[0]
  value1.value = ''
  value2.value = ''
  emit('reset')
}
</script>

<template>
  <div class="q-pa-sm" style="min-width: 220px;">
    <q-select
      v-model="selectedOperator"
      :options="operatorOptions"
      label="Operator"
      dense
      filled
      class="q-mb-sm"
    />

    <div v-if="dataType === 'string' || dataType === 'number'">
      <q-input
        v-model="value1"
        label="Value"
        dense
        filled
        type="text"
        v-if="selectedOperator !== 'between'"
      />
      <div v-else class="row q-col-gutter-sm">
        <q-input v-model="value1" label="From" dense filled class="col" />
        <q-input v-model="value2" label="To" dense filled class="col" />
      </div>
    </div>

    <div v-else-if="dataType === 'date'">
      <q-date v-model="value1" mask="YYYY-MM-DD" flat />
    </div>

    <div v-else-if="dataType === 'boolean'">
      <q-toggle v-model="value1" label="Is true" />
    </div>

    <div class="row justify-between q-mt-md">
      <q-btn label="Reset" flat color="primary" @click="reset" />
      <q-btn label="Apply" color="primary" unelevated @click="apply" />
    </div>
  </div>
</template>
