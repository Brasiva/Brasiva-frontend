import { createRouter, createWebHistory } from 'vue-router'
import FuncionarioView from '@/views/FuncionarioView.vue'
import SideBarComponent from '@/components/SideBarComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/funcionarios',
    name: 'funcionarios',
    component: () => import('../views/FuncionarioView.vue')
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: () => import('../components/SideBarComponent.vue')
    }
  ],
})

export default router
