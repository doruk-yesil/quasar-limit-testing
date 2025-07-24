<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { QTable, QSelect, QIcon, QInput, QTh, QTr } from 'quasar'
import Widget from '../widget-comps/Widget.vue'

const symbols = ['USD', 'EUR', 'GBP', 'TRY']
const amount = ref<number>(1)
const converted = ref<string>('0.0000')
const from = ref('USD')
const to = ref('TRY')

const mockRates = {
  'USD/EUR': 0.8477,
  'USD/GBP': 0.7349,
  'USD/TRY': 40.2510,
  'USD/JPY': 146.30,
  'USD/CHF': 0.8891,
  'USD/CAD': 1.3225,
  'USD/AUD': 1.5040,
  'USD/NZD': 1.6032,
  'USD/CNY': 7.1724,
  'USD/SEK': 10.5711,
  'USD/NOK': 10.3776,
  'USD/DKK': 6.2965
}

const rates = ref<Record<string, number>>(mockRates)

function updateConvertedFromAmount() {
  if (from.value === to.value) {
    converted.value = amount.value.toFixed(4)
    return
  }

  const key = `USD/${to.value}`
  const inverseKey = `USD/${from.value}`

  if (from.value === 'USD' && rates.value[key]) {
    converted.value = (amount.value * rates.value[key]).toFixed(4)
  } else if (to.value === 'USD' && rates.value[inverseKey]) {
    converted.value = (amount.value / rates.value[inverseKey]).toFixed(4)
  } else {
    const usdToFrom = rates.value[inverseKey]
    const usdToTo = rates.value[key]
    if (usdToFrom && usdToTo) {
      const usdAmount = amount.value / usdToFrom
      converted.value = (usdAmount * usdToTo).toFixed(4)
    } else {
      converted.value = '0.0000'
    }
  }
}

function updateAmountFromConverted() {
  const parsed = parseFloat(converted.value)
  if (isNaN(parsed) || !isFinite(parsed)) return

  const key = `USD/${to.value}`
  const inverseKey = `USD/${from.value}`

  let newAmount = 0

  if (from.value === to.value) {
    newAmount = parsed
  } else if (from.value === 'USD' && rates.value[key]) {
    newAmount = parsed / rates.value[key]
  } else if (to.value === 'USD' && rates.value[inverseKey]) {
    newAmount = parsed * rates.value[inverseKey]
  } else {
    const usdToFrom = rates.value[inverseKey]
    const usdToTo = rates.value[key]
    if (usdToFrom && usdToTo) {
      const usdVal = parsed / usdToTo
      newAmount = usdVal * usdToFrom
    }
  }

  if (!isNaN(newAmount) && isFinite(newAmount)) {
    amount.value = parseFloat(newAmount.toFixed(4))
  }
}

watch([amount, from, to], () => {
  if (!amount.value && amount.value !== 0) {
    converted.value = '0.0000'
    return
  }
  updateConvertedFromAmount()
})

watch(converted, () => {
  if (!converted.value && converted.value !== '0') {
    amount.value = 0
    return
  }
  updateAmountFromConverted()
})

onMounted(() => {
  updateConvertedFromAmount()
})

const tableRows = computed(() => {
  return Object.entries(rates.value).map(([pair, rate]) => ({
    pair,
    buy: (rate * 0.995).toFixed(4),
    sell: (rate * 1.005).toFixed(4)
  }))
})

const columns = [
  { name: 'pair', label: 'Parite', field: 'pair', align: 'left' as const },
  { name: 'buy', label: 'Alış', field: 'buy', align: 'left' as const },
  { name: 'sell', label: 'Satış', field: 'sell', align: 'left' as const }
]
</script>

<template>
  <Widget :title="'Exchange Rates'">
    <div class="converter">
      <q-input v-model="amount" type="number" label="Miktar" />
      <q-select v-model="from" :options="symbols" label="From" />
      <q-icon name="arrow_forward" class="q-mx-sm" />
      <q-select v-model="to" :options="symbols" label="To" />
    </div>
    <div class="converter q-my-sm">
      <q-input v-model="converted" class="fit" label="Sonuç" type="number" />
    </div>
    <q-table
      class="rates-table"
      flat bordered dense
      :rows="tableRows"
      :columns="columns"
      row-key="name"
      hide-bottom
      :rows-per-page-options="[0]"
    >
      <template #header="props">
        <q-tr :props="props" class="sticky-header">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="custom-th"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
    </q-table>
  </Widget>
</template>

<style scoped>
.converter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.unit {
  margin-left: 4px;
  font-weight: bold;
}
.rates-table {
  height: 116px;
  overflow-y: scroll;
}
</style>
<style>
.q-table__middle.scroll {
  overflow-x: hidden !important;
}
.rates-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
  
}
</style>
