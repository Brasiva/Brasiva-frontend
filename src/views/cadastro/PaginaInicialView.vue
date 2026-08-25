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
    <!-- Efeito de iluminação desfocada (Glow Laranja) -->
    <div class="orange-glow"></div>

    <div class="conteudo">
      <h1 class="logo">BRASIVA</h1>

      <div class="botoes">
        <button class="botao botao-primario" @click="irLogin">
          FAZER LOGIN
        </button>

        <button class="botao botao-secundario" @click="irCadastro">
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
  overflow: hidden;
  background-color: #161316;
  color: #FFFFFF;
  font-family: "Poppins", sans-serif;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
}

.orange-glow {
  position: absolute;
  top: -80px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 109, 41, 0.4) 0%, rgba(22, 19, 22, 0) 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 1;
}

.conteudo {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.logo {
  font-family: "Imbue", serif;
  font-weight: 300;
  font-size: 4.5rem;
  line-height: 1;
  letter-spacing: 3px;
  text-align: center;
  color: #FFFFFF;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 109, 41, 0.3);
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
  height: 48px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  box-sizing: border-box;
}

.botao-primario {
  border: none;
  background: linear-gradient(90deg, #FF6D29 0%, #453027 100%);
  color: #FFFFFF;
}

.botao-secundario {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 109, 41, 0.4);
  color: #FFFFFF;
}

.botao:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.botao:active {
  transform: translateY(0);
}

.container-instalar {
  position: absolute;
  bottom: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2;
}

/* DESKTOP RESPONSIVO */
@media (min-width: 768px) {
  .orange-glow {
    width: 600px;
    height: 600px;
    top: -150px;
  }

  .conteudo {
    max-width: 420px;
    gap: 4rem;
  }

  .logo {
    font-size: 6.5rem;
  }

  .container-instalar {
    bottom: 2.5rem;
    right: 4rem;
    width: auto;
    justify-content: flex-end;
  }
}
</style>
