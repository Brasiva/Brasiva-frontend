<script setup>
import { useRouter } from "vue-router";
import InstallButton from "@/components/InstallButton.vue";

const router = useRouter();

const irCadastro = () => {
  router.push("/cadastro");
};

const irLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="pagina">
    <div class="bg-imagem"></div>

    <div class="conteudo">
      <h1>BRASIVA</h1>

      <div class="botoes">
        <button class="botao" @click="irLogin">
          FAZER LOGIN
        </button>
        
        <button class="botao" @click="irCadastro">
          CADASTRAR-SE
        </button>
      </div>
    </div>

    <div class="container-instalar">
      <InstallButton class="instalar" />
    </div>
  </div>
</template>

<style scoped>
/* MOBILE FIRST */
.pagina {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden; /* Evita barras de rolagem ao rotacionar o fundo no desktop */

  color: white;
  font-family: "Poppins", sans-serif;
  padding: 2rem;
  box-sizing: border-box;
}

/* Elemento do Background */
.bg-imagem {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* Imagem em pé (vertical) padrão para Mobile */
  background: url("../img/background-image.png") center center / cover no-repeat;
  transition: transform 0.3s ease;
}

.conteudo {
  position: relative;
  z-index: 2; /* Fica por cima do fundo */
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.conteudo h1 {
  font-family: "Imbue", serif;
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
  font-size: 4rem;
  line-height: 1;
  letter-spacing: 2px;
  text-align: center;
  margin: 0 0 8vw 0;
}


.botoes {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.botao {
  width: 100%;
  max-width: 260px;
  height: 30px;

  border: none;
  border-radius: 999px;

  background: #FF9500;
  color: white;

  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;

  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.botao:hover {
  background: #ffa826;
  transform: scale(1.02);
}

.botao:active {
  transform: scale(0.98);
}

/* Container do botão de instalar no Mobile */
.container-instalar {
  position: absolute;
  bottom: 2.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2;
}

/* DESKTOP (Telas maiores) */
@media (min-width: 768px) {
  .pagina {
    justify-content: center;
    align-items: center;
  }

  .bg-imagem {
    width: 100vh;  /* Inverte proporções para cobrir tudo após girar */
    height: 100vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg); /* Rotaciona a imagem em pé para ficar deitada */
    transform-origin: center;
  }

  .conteudo {
    max-width: 450px;
    gap: 3.5rem;
  }

  .conteudo h1 {
    font-size: 6.5rem;
    margin: 0;
  }

  .botao {
    max-width: 250px;
    height: 40px;
    font-size: 1rem;
  }

  .container-instalar {
    position: absolute;
    bottom: 2.5rem;
    right: 4rem;
    width: auto;
    justify-content: flex-end;
  }
}
</style>