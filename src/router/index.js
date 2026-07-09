import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

// Views do sistema
import Home from '../views/HomeView.vue'
import Calendar from '../views/CalendarView.vue'
import Menu from '../views/MenuView.vue'
import Stock from '../views/StockView.vue'
import Employee from '../views/EmployeeView.vue'
import Budget from '../views/BudgetView.vue'
import ConfigView from '../views/ConfigView.vue'

// Views de autenticação
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'

// Views da página inicial
import PaginaInicial from '../views/cadastro/PaginaInicialView.vue'
import CadastroView from '../views/cadastro/CadastroView.vue'
import LoginView from '../views/cadastro/LoginView.vue'
import RecuperarSenhaView from '../views/cadastro/RecuperarSenhaView.vue'

const routes = [
  {
    path: '/',
    redirect: '/inicio'
  },
  {
    path: '/inicio',
    component: PaginaInicial
  },
  {
    path: '/cadastro',
    component: CadastroView
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/recuperar-senha',
    component: RecuperarSenhaView
  },

  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'calendario',
        component: Calendar
      },
      {
        path: 'cardapio',
        component: Menu
      },
      {
        path: 'estoque',
        component: Stock
      },
      {
        path: 'funcionarios',
        component: Employee
      },
      {
        path: 'orcamento',
        component: Budget
      },
      {
        path: 'config',
        component: ConfigView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router