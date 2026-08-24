<template>
  <button v-if="showInstallButton" class="install-button" @click="installApp">
    <div class="icone-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icone-download"
      >
        <path d="M12 3v10M12 13l-4-4M12 13l4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 17v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="17" r="1" fill="currentColor" />
      </svg>
    </div>

    <span class="texto-instalar">INSTALAR APLICATIVO</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showInstallButton = ref(false);
let deferredPrompt = null;

onMounted(() => {
  // Para fins de teste local se o PWA não disparar o evento imediatamente:
  // showInstallButton.value = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton.value = true;
  });

  window.addEventListener('appinstalled', () => {
    showInstallButton.value = false;
    deferredPrompt = null;
  });
});

async function installApp() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    showInstallButton.value = false;
  }

  deferredPrompt = null;
}
</script>

<style scoped>
/* MOBILE FIRST */
.install-button {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  height: 44px;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-family: "Poppins", sans-serif;
}

/* Interações */
.install-button:hover {
  transform: scale(1.03);
  opacity: 0.95;
}

.install-button:active {
  transform: scale(0.98);
}

/* O Círculo menor */
.icone-container {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FF6D29 0%, #453027 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(255, 109, 41, 0.3);
}

/* Ícone escalado para o novo círculo */
.icone-download {
  width: 18px;
  height: 18px;
  color: #ffffff;
  fill: none;
}

/* A pílula de texto menor e encaixada */
.texto-instalar {
  background: linear-gradient(90deg, #FF6D29 0%, #453027 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: none;
  border-radius: 0 999px 999px 0;

  margin-left: -22px;
  padding-left: 32px;
  padding-right: 20px;

  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-sizing: border-box;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* DESKTOP */
@media (min-width: 768px) {
  .install-button {
    height: 52px;
  }

  .icone-container {
    width: 52px;
    height: 52px;
  }

  .icone-download {
    width: 22px;
    height: 22px;
  }

  .texto-instalar {
    margin-left: -26px;
    padding-left: 38px;
    padding-right: 24px;
    height: 40px;
    font-size: 0.85rem;
  }
}
</style>
