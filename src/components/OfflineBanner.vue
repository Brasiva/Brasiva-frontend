<template>
  <div v-if="!isOnline" class="offline-banner">
    <font-awesome-icon icon="boxes-stacked" class="banner-icon" />
    <span>Você está offline. O Brasiva continuará funcionando com os dados locais salvos.</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<style scoped>
.offline-banner {
  /* Usando uma variação de cor escura ou um vermelho/terroso que combine com o tema de brasa/carvão */
  background-color: #7f1d1d; /* Um tom de vermelho escuro/vinho bem integrado */
  color: #fffaf0; /* O mesmo tom de branco/creme do seu protótipo */
  font-family: 'Urbanist', sans-serif;
  text-align: center;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999; /* Garante que fica por cima de absolutamente tudo */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>