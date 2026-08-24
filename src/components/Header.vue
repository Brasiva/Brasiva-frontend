<template>
  <header class="header">
    <div class="search-bar">
      <span>🔍</span>
      <input type="text" placeholder="Pesquisa aqui..." />
    </div>

    <div class="user-profile" v-if="authStore.usuario">
      <div class="avatar-placeholder">
        {{ authStore.usuario.name ? authStore.usuario.name.charAt(0).toUpperCase() : 'U' }}
      </div>
      <div class="user-info">
        <span class="user-name">{{ authStore.usuario.name || 'Usuário' }}</span>
        <span class="user-email">{{ authStore.usuario.email }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.js";
const authStore = useAuthStore();
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; }
.search-bar { background: #f0f0f0; border-radius: 20px; padding: 8px 15px; display: flex; align-items: center; width: 400px; }
.search-bar input { border: none; background: transparent; outline: none; margin-left: 10px; width: 100%; }
.user-profile { display: flex; align-items: center; gap: 12px; }
.avatar-placeholder { width: 40px; height: 40px; border-radius: 50%; background: #4a3b32; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.user-info { display: flex; flex-direction: column; }
.user-name { font-weight: bold; font-size: 14px; color: #333; }
.user-email { font-size: 12px; color: #777; }
</style>
