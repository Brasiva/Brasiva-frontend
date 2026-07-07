<template>
  <button v-if="showInstallButton" class="install-button" @click="installApp">
    Instalar aplicativo
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showInstallButton = ref(false);
let deferredPrompt = null;

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Impede o banner automático do navegador
    event.preventDefault();
    // Armazena o evento para usar depois
    deferredPrompt = event;
    // Mostra o botão customizado
    showInstallButton.value = true;
  });

  window.addEventListener('appinstalled', () => {
    // Esconde o botão quando o app for instalado
    showInstallButton.value = false;
    deferredPrompt = null;
  });
});

async function installApp() {
  if (!deferredPrompt) return;

  // Mostra o prompt de instalação do navegador
  deferredPrompt.prompt();

  // Aguarda a resposta do usuário
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    showInstallButton.value = false;
  }

  deferredPrompt = null;
}
</script>

<style scoped>
.install-button {
  background: rgb(248, 21, 21);
  color: #ffffff;
  border: none;
  padding: 0.8rem 2rem;
  margin: 1rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
}

.install-button:hover {
  background-color: #828483;
}
</style>
