import { createRouter, createWebHistory } from 'vue-router'

import DashboardLayout from '../layouts/DashboardLayout.vue'

// Views do sistema
import Home from '../views/HomeView.vue'
import Calendar from '../views/CalendarioView.vue'
import Eventos from '../views/EventosView.vue'
import Pedidos from '../views/PedidosView.vue'
import Menu from '../views/MenuView.vue'
import Stock from '../views/StockView.vue'
import Employee from '../views/EmployeeView.vue'
import Budget from '../views/BudgetView.vue'
import Perfil from '../views/PerfilView.vue'
import Config from '../views/ConfigView.vue'


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
        path: 'eventos',
        component: Eventos
      },
      {
        path: 'pedidos',
        component: Pedidos
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
        path: 'perfil',
        component: Perfil
      },
      {
        path: 'configuracoes',
        component: Config
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
