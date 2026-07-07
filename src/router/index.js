import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

// Importando todas as suas visualizações (Views)
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Home from '../views/HomeView.vue'
import Calendar from '../views/CalendarView.vue'
import Menu from '../views/MenuView.vue'
import Stock from '../views/StockView.vue'
import Employee from '../views/EmployeeView.vue'
import Budget from '../views/BudgetView.vue'
import PaginaInicial from '../views/PaginaInicialView.vue'

const routes = [
  {
   path: '/inicio',
   name: 'PaginaInicial',
   component: PaginaInicial
 },
  // Rotas de Autenticação (Fundo escuro/fogo)
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },
  // Rotas do Sistema (Com o menu lateral estático)
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/home', // Se o usuário logar e cair no '/', vai direto para o Home
    children: [
      { path: 'home', component: Home },
      { path: 'calendario', component: Calendar },
      { path: 'cardapio', component: Menu },
      { path: 'estoque', component: Stock },
      { path: 'funcionarios', component: Employee },
      { path: 'orcamento', component: Budget }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
