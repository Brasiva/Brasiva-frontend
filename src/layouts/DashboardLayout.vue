<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <button class="toggle-sidebar" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'">
        <span class="material-symbols-outlined">{{ sidebarCollapsed ? "chevron_right" : "chevron_left" }}</span>
      </button>

      <div class="sidebar-top">
        <div class="sidebar-logo">
          <h2 v-if="!sidebarCollapsed">BRASIVA</h2>
          <p v-if="!sidebarCollapsed" class="subtitulo">Gerenciamento Completo</p>
          <div v-else class="logo-mini">B</div>
        </div>

        <nav class="sidebar-menu">
          <router-link to="/home" class="menu-item">
            <span class="material-symbols-outlined menu-icon">home</span>
            <span v-if="!sidebarCollapsed">Página Inicial</span>
          </router-link>

          <router-link to="/calendario" class="menu-item">
            <span class="material-symbols-outlined menu-icon">calendar_month</span>
            <span v-if="!sidebarCollapsed">Calendário</span>
          </router-link>

          <router-link to="/eventos" class="menu-item">
            <span class="material-symbols-outlined menu-icon">celebration</span>
            <span v-if="!sidebarCollapsed">Eventos</span>
          </router-link>

          <router-link to="/pedidos" class="menu-item">
            <span class="material-symbols-outlined menu-icon">assignment_turned_in</span>
            <span v-if="!sidebarCollapsed">Pedidos</span>
          </router-link>

          <router-link to="/cardapio" class="menu-item">
            <span class="material-symbols-outlined menu-icon">restaurant_menu</span>
            <span v-if="!sidebarCollapsed">Cardápio</span>
          </router-link>

          <router-link to="/estoque" class="menu-item">
            <span class="material-symbols-outlined menu-icon">inventory_2</span>
            <span v-if="!sidebarCollapsed">Estoque</span>
          </router-link>

          <router-link to="/funcionarios" class="menu-item">
            <span class="material-symbols-outlined menu-icon">groups</span>
            <span v-if="!sidebarCollapsed">Funcionários</span>
          </router-link>

          <router-link to="/orcamento" class="menu-item">
            <span class="material-symbols-outlined menu-icon">request_quote</span>
            <span v-if="!sidebarCollapsed">Orçamento</span>
          </router-link>

          <router-link to="/notificacoes" class="menu-item">
            <span class="material-symbols-outlined menu-icon">notifications</span>
            <span v-if="!sidebarCollapsed">Notificações</span>
          </router-link>

          <router-link to="/perfil" class="menu-item">
            <span class="material-symbols-outlined menu-icon">person</span>
            <span v-if="!sidebarCollapsed">Perfil</span>
          </router-link>
        </nav>
      </div>

      <div class="sidebar-footer">
        <router-link to="/configuracoes" class="footer-item">
          <span class="material-symbols-outlined menu-icon">settings</span>
          <span v-if="!sidebarCollapsed">Configurações</span>
        </router-link>

        <button @click="handleLogout" class="footer-item botao-logout">
          <span class="material-symbols-outlined menu-icon">logout</span>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <main class="dashboard-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <router-view />
    </main>

    <nav class="mobile-nav">
      <router-link to="/home" class="mobile-item">
        <span class="material-symbols-outlined">home</span>
      </router-link>

      <router-link to="/calendario" class="mobile-item">
        <span class="material-symbols-outlined">calendar_month</span>
      </router-link>

      <router-link to="/eventos" class="mobile-item">
        <span class="material-symbols-outlined">celebration</span>
      </router-link>

      <router-link to="/pedidos" class="mobile-item">
        <span class="material-symbols-outlined">assignment_turned_in</span>
      </router-link>

      <button class="mobile-item mobile-menu-button" @click="mobileMenuOpen = true">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </nav>

    <transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>
    </transition>

    <transition name="slide">
      <aside v-if="mobileMenuOpen" class="mobile-sidebar">
        <div class="mobile-sidebar-header">
          <div>
            <h2>BRASIVA</h2>
            <p>Gerenciamento Completo</p>
          </div>

          <button class="close-mobile-menu" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav class="mobile-sidebar-menu">
          <router-link to="/cardapio" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">restaurant_menu</span>
            <span>Cardápio</span>
          </router-link>

          <router-link to="/estoque" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">inventory_2</span>
            <span>Estoque</span>
          </router-link>

          <router-link to="/funcionarios" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">groups</span>
            <span>Funcionários</span>
          </router-link>

          <router-link to="/orcamento" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">request_quote</span>
            <span>Orçamento</span>
          </router-link>

          <router-link to="/notificacoes" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">notifications</span>
            <span>Notificações</span>
          </router-link>

          <router-link to="/perfil" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">person</span>
            <span>Perfil</span>
          </router-link>

          <router-link to="/configuracoes" class="mobile-sidebar-item" @click="mobileMenuOpen = false">
            <span class="material-symbols-outlined">settings</span>
            <span>Configurações</span>
          </router-link>
        </nav>

        <div class="mobile-sidebar-footer">
          <button class="mobile-sidebar-item logout-mobile" @click="handleLogout">
            <span class="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const sidebarCollapsed = ref(false);
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  mobileMenuOpen.value = false;
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 235px;
  height: 100vh;
  background-color: #ffffff;
  padding: 20px 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.04);
  transition: width 0.25s ease, padding 0.25s ease;
}

.sidebar.collapsed {
  width: 70px;
  padding: 20px 9px 15px;
}

.toggle-sidebar {
  position: absolute;
  right: -11px;
  top: 35px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background-color: #ff9500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(255, 149, 0, 0.35);
  transition: 0.2s ease;
}

.toggle-sidebar:hover {
  background-color: #ff7a00;
  transform: scale(1.08);
}

.toggle-sidebar .material-symbols-outlined {
  font-size: 15px;
}

.sidebar-top {
  width: 100%;
}

.sidebar-logo {
  height: 55px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sidebar-logo h2 {
  color: #000000;
  font-family: "Imbue", serif;
  font-weight: 300;
  font-size: 2.2rem;
  line-height: 1;
  margin: 0;
  letter-spacing: 1px;
}

.subtitulo {
  color: #9ca3af;
  font-family: "Poppins", sans-serif;
  font-size: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin: 3px 0 0;
}

.logo-mini {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background-color: #ff9500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Imbue", serif;
  font-size: 1.4rem;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 36px;
  padding: 11px 11px;
  box-sizing: border-box;
  color: #868d9b;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-size: 0.73rem;
  font-weight: 550;
  border-radius: 11px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-icon {
  width: 18px;
  min-width: 18px;
  font-size: 20px;
  text-align: center;
}

.menu-item:hover:not(.router-link-active) {
  background-color: #f5f5f7;
  color: #000000;
}

.sidebar .router-link-active {
  background-color: #f5f5f7;
  color: #000000;
  font-weight: 600;
  border-left: 5px solid #ff9500;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0;
  gap: 0;
}

.sidebar.collapsed .menu-icon {
  width: 20px;
  font-size: 21px;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 36px;
  padding: 0 11px;
  color: #9ca3af;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-size: 0.73rem;
  font-weight: 550;
  border-radius: 11px;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;
  transition: 0.2s ease;
}

.footer-item:hover {
  color: #000000;
  background-color: #f9fafb;
}

.botao-logout:hover {
  color: #dc2626;
  background-color: #fff1f1;
}

.sidebar.collapsed .footer-item {
  justify-content: center;
  padding: 0;
  gap: 0;
}

.dashboard-content {
  min-height: 100vh;
  width: calc(100% - 235px);
  margin-left: 235px;
  padding: 25px;
  box-sizing: border-box;
  transition: margin-left 0.25s ease, width 0.25s ease;
  overflow-y: auto;
}

.dashboard-content.sidebar-collapsed {
  width: calc(100% - 70px);
  margin-left: 70px;
}

.mobile-nav {
  display: none;
}

.mobile-overlay {
  display: none;
}

.mobile-sidebar {
  display: none;
}

@media (max-width: 767px) {
  .sidebar {
    display: none;
  }

  .dashboard-content,
  .dashboard-content.sidebar-collapsed {
    width: 100%;
    margin-left: 0;
    padding: 15px;
    padding-bottom: 100px;
  }

  .mobile-nav {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 450px;
    height: 60px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 8px;
    z-index: 999;
  }

  .mobile-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    color: #6b7280;
    font-size: 1.1rem;
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .mobile-item .material-symbols-outlined {
    font-size: 24px;
  }

  .mobile-nav .router-link-active {
    background-color: #ff9500;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
  }

  .mobile-menu-button {
    color: #6b7280;
  }

  .mobile-menu-button:active {
    transform: scale(0.92);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1100;
    backdrop-filter: blur(2px);
  }

  .mobile-sidebar {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    width: min(310px, 82vw);
    height: 100vh;
    background-color: #ffffff;
    z-index: 1200;
    flex-direction: column;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.12);
  }

  .mobile-sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 20px;
    border-bottom: 1px solid #f1f1f1;
  }

  .mobile-sidebar-header h2 {
    margin: 0;
    color: #000000;
    font-family: "Imbue", serif;
    font-size: 2rem;
    font-weight: 300;
    line-height: 1;
  }

  .mobile-sidebar-header p {
    margin: 5px 0 0;
    color: #9ca3af;
    font-family: "Poppins", sans-serif;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .close-mobile-menu {
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 50%;
    background-color: #f5f5f5;
    color: #555555;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .close-mobile-menu .material-symbols-outlined {
    font-size: 22px;
  }

  .mobile-sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 20px 14px;
    overflow-y: auto;
    flex: 1;
  }

  .mobile-sidebar-item {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 52px;
    padding: 0 14px;
    box-sizing: border-box;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: #6b7280;
    text-decoration: none;
    font-family: "Poppins", sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .mobile-sidebar-item .material-symbols-outlined {
    font-size: 23px;
    width: 24px;
  }

  .mobile-sidebar-item:hover {
    background-color: #f5f5f7;
    color: #000000;
  }

  .mobile-sidebar-item.router-link-active {
    background-color: #f5f5f7;
    color: #000000;
    border-left: 4px solid #ff9500;
  }

  .mobile-sidebar-footer {
    flex-shrink: 0;
    border-top: 1px solid #f1f1f1;
    padding: 12px 14px 20px;
    background-color: #ffffff;
  }

  .logout-mobile {
    color: #dc2626;
  }

  .logout-mobile:hover {
    background-color: #fff1f1;
    color: #dc2626;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.25s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
