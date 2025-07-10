<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Website Blog',
      backgroundColor: '#42A5F5',
      data: [400, 300, 500, 700, 600, 800]
    },
    {
      label: 'Social Media',
      backgroundColor: '#66BB6A',
      data: [350, 450, 300, 500, 450, 600]
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>

<template>
  <div style="height: 100%;">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
