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
/* MOBILE FIRST (Tamanho reduzido e proporcional) */
.install-button {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  /* Altura total baseada no diâmetro do círculo */
  height: 44px; 
  transition: transform 0.2s ease;
  font-family: "Poppins", sans-serif;
}

/* Interações */
.install-button:hover {
  transform: scale(1.03);
}

.install-button:active {
  transform: scale(0.98);
}

/* O Círculo menor */
.icone-container {
  width: 44px;
  height: 44px;
  background-color: #FF9500;
  border: 3px solid #ffffff; /* Reduzido de 4px para 3px para combinar com o tamanho */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  z-index: 2;
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
  background-color: #FF9500;
  border: 2.5px solid #ffffff;
  border-radius: 0 999px 999px 0;
  
  /* Valores recalculados para o encaixe perfeito no tamanho menor */
  margin-left: -22px; 
  padding-left: 32px;
  padding-right: 20px;
  
  height: 34px; /* Menor que o círculo (44px), centralizando o encaixe visual */
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: #ffffff;
  font-size: 0.8rem; /* Fonte menor e mais delicada */
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-sizing: border-box;
  z-index: 1;
}

/* DESKTOP (Opcional: Caso queira que ele volte ao tamanho normal em telas maiores) */
@media (min-width: 768px) {
  .install-button {
    height: 52px;
  }
  
  .icone-container {
    width: 52px;
    height: 52px;
    border-width: 4px;
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
    font-size: 0.95rem;
    border-width: 3px;
  }
}
</style>