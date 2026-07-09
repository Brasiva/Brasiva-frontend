<template>
  <div class="dashboard-layout">

    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="sidebar-logo">
          <h2>BRASIVA</h2>
          <p class="subtitulo">Gerenciamento Completo</p>
        </div>

        <nav class="sidebar-menu">
          <router-link to="/home" class="menu-item">
            <font-awesome-icon icon="home" class="menu-icon" />
            <span>Página Inicial</span>
          </router-link>

          <router-link to="/calendario" class="menu-item">
            <font-awesome-icon icon="calendar-days" class="menu-icon" />
            <span>Calendário</span>
          </router-link>

          <router-link to="/cardapio" class="menu-item">
            <font-awesome-icon icon="utensils" class="menu-icon" />
            <span>Cardápio</span>
          </router-link>

          <router-link to="/estoque" class="menu-item">
            <font-awesome-icon icon="boxes-stacked" class="menu-icon" />
            <span>Estoque</span>
          </router-link>

          <router-link to="/funcionarios" class="menu-item">
            <font-awesome-icon icon="users" class="menu-icon" />
            <span>Funcionários</span>
          </router-link>

          <router-link to="/orcamento" class="menu-item">
            <font-awesome-icon icon="file-invoice-dollar" class="menu-icon" />
            <span>Orçamento</span>
          </router-link>
        </nav>
      </div>

      <div class="sidebar-footer">
        <router-link to="/configuracoes" class="footer-item">
          <font-awesome-icon icon="gear" class="menu-icon" />
          <span>Configurações</span>
        </router-link>

        <button @click="handleLogout" class="footer-item botao-logout">
          <font-awesome-icon icon="sign-out-alt" class="menu-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="dashboard-content">
      <router-view />
    </main>

    <nav class="mobile-nav">
      <router-link to="/home" class="mobile-item">
        <font-awesome-icon icon="home" />
      </router-link>
      <router-link to="/calendario" class="mobile-item">
        <font-awesome-icon icon="calendar-days" />
      </router-link>
      <router-link to="/cardapio" class="mobile-item">
        <font-awesome-icon icon="utensils" />
      </router-link>
      <router-link to="/estoque" class="mobile-item">
        <font-awesome-icon icon="boxes-stacked" />
      </router-link>
      <router-link to="/funcionarios" class="mobile-item">
        <font-awesome-icon icon="users" />
      </router-link>
      <router-link to="/orcamento" class="mobile-item">
        <font-awesome-icon icon="file-invoice-dollar" />
      </router-link>
    </nav>

  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>

.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f3f4f6; 
}


.sidebar {
  display: none;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: 100px; 
}

.mobile-nav {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 450px;
  height: 65px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
  z-index: 999;
}


.mobile-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  color: #6b7280; /* Cor do ícone inativo */
  font-size: 1.25rem;
  text-decoration: none;
  transition: all 0.25s ease;
}


.mobile-nav .router-link-active {
  background-color: #ff4800; 
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(255, 72, 0, 0.3);
}

/* DESKTOP RESPONSIVO */

@media (min-width: 768px) {
  .dashboard-layout {
    flex-direction: row;
    padding: 25px; 
    gap: 25px;
  }

  
  .mobile-nav {
    display: none;
  }

  
  .sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 280px;
    background-color: #ffffff;
    border-radius: 24px; 
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    padding: 2.5rem 1.5rem;
    height: 100%;
    box-sizing: border-box;
  }

  .dashboard-content {
    padding: 2rem;
    padding-bottom: 2rem;
    background-color: transparent; 
  }

  
  .sidebar-logo {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .sidebar-logo h2 {
    color: #000000;
    font-family: 'Imbue', serif;
    font-weight: 300;
    font-size: 3.2rem;
    line-height: 1;
    margin: 0;
    letter-spacing: 1px;
  }

  .subtitulo {
    color: #9ca3af;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 0.3rem;
  }

 
  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.2rem;
    color: #4b5563;
    text-decoration: none;
    font-family: "Poppins", sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 14px;
    transition: all 0.2s ease;
  }

  .menu-icon {
    width: 20px;
    font-size: 1.1rem;
  }

  .menu-item:hover:not(.router-link-active) {
    background-color: #FFD69D;
    color: #000000;
  }

 
  .sidebar .router-link-active {
    background-color: #FF9500;
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 72, 0, 0.25);
  }

  
  .sidebar-footer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-top: 1px solid #f3f4f6;
    padding-top: 1.5rem;
  }

  .footer-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.2rem;
    color: #9ca3af; 
    text-decoration: none;
    font-family: "Poppins", sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 14px;
    background: transparent;
    border: none;
    width: 100%;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .footer-item:hover {
    color: #000000;
    background-color: #f9fafb;
  }

  .botao-logout:hover {
    color: #dc2626; 
  }
}
</style>
