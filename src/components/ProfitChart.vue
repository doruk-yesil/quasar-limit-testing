<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Tooltip, Legend, ArcElement)

const chartData = {
  labels: ['Used', 'Remaining'],
  datasets: [
    {
      label: 'Profit Margin',
      data: [76, 24],
      backgroundColor: ['#4CAF50', '#E0E0E0'],
      borderWidth: 0
    }
  ]
}

const chartOptions = {
  cutout: '70%',
  plugins: {
    legend: {
      display: false
    }
  }
}
</script>

<template>
  <div style="position: relative; height: 200px; width: 100%;">
    <Doughnut :data="chartData" :options="chartOptions" />
    <div
      style="position: absolute; top: 50%; left: 75%; transform: translate(-50%, -50%); font-size: 1.2rem;"
    >
      <h1>76%</h1>
    </div>
  </div>
</template>

