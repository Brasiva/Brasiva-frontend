<template>
  <header class="header">
    <!-- Barra de Pesquisa Funcional -->
    <div class="search-bar">
      <span class="material-symbols-outlined search-icon" @click="executarBusca">search</span>
      <input
        v-model="termoBusca"
        type="text"
        placeholder="Pesquisa aqui..."
        @keyup.enter="executarBusca"
      />
    </div>

    <div class="header-actions">
      <!-- Botão de Notificações -->
      <router-link to="/notificacoes" class="btn-notificacao" title="Notificações">
        <span class="material-symbols-outlined">notifications</span>
        <span v-if="notificacoesStore?.naoLidasCount > 0" class="badge">
          {{ notificacoesStore.naoLidasCount }}
        </span>
      </router-link>

      <!-- Perfil do Usuário (Mostra fallback enquanto carrega) -->
      <div class="user-profile" v-if="authStore.usuario">
        <div class="avatar-placeholder">
          {{ avatarInicial }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ nomeUsuario }}</span>
          <span class="user-email">{{ authStore.usuario.email || '' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useNotificacoesStore } from "@/stores/notificacoes.js";

const authStore = useAuthStore();
const notificacoesStore = useNotificacoesStore();

const termoBusca = ref("");

onMounted(async () => {
  // Carrega os dados do usuário logado se ainda não estiverem carregados
  if (!authStore.usuario && typeof authStore.me === 'function') {
    await authStore.me();
  }

  // Carrega as notificações
  if (typeof notificacoesStore.buscarNotificacoes === 'function') {
    notificacoesStore.buscarNotificacoes();
  }
});

// Garante o nome independente de a API retornar 'nome' ou 'name'
const nomeUsuario = computed(() => {
  if (!authStore.usuario) return 'Usuário';
  return authStore.usuario.nome || authStore.usuario.name || 'Usuário';
});

// Primeira letra para o avatar
const avatarInicial = computed(() => {
  return nomeUsuario.value.charAt(0).toUpperCase();
});

function executarBusca() {
  if (termoBusca.value.trim()) {
    console.log("Pesquisando por:", termoBusca.value);
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  /* Fundo transparente (sem a cor branca) */
  background: transparent;
}

.search-bar {
  background: #f0f0f0;
  border-radius: 20px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  width: 350px;
}

.search-icon {
  color: #777;
  cursor: pointer;
  font-size: 20px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  margin-left: 8px;
  width: 100%;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Botão de Notificação */
.btn-notificacao {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  text-decoration: none;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-notificacao:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #e53935;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 10px;
  padding: 2px 6px;
  min-width: 16px;
  text-align: center;
}

/* Perfil do Usuário */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a3b32;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.user-email {
  font-size: 12px;
  color: #777;
}
</style>
