import { createRouter, createWebHistory } from 'vue-router'
import FuncionarioView from '@/views/FuncionarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/funcionarios',
    name: 'funcionarios',
    component: () => import('../views/FuncionarioView.vue')
    }
  ],
})

export default router
