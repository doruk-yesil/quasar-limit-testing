import { createRouter, createWebHistory } from 'vue-router'
import EmployeePage from '../pages/EmployeePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import HomePage from '../pages/HomePage.vue'
import DashboardPage2 from '../pages/DashboardPage2.vue'
import DashboardPage3 from '../pages/DashboardPage3.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/grid', component: EmployeePage },
  { path: '/dashboard2', component: DashboardPage2 },  
  { path: '/dashboard3', component: DashboardPage3 },  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
