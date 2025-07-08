import { createRouter, createWebHistory } from 'vue-router'
import EmployeePage from '../pages/EmployeePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import HomePage from '../pages/HomePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/grid', component: EmployeePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
