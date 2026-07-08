<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// 1. IMPORTAR A STORE (Ajuste o caminho 'stores/auth.js' conforme seu projeto)
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore(); // 2. INSTANCIAR A STORE

// Estados do formulário
const nome = ref("");
const email = ref("");
const senha = ref("");

const irLogin = () => {
  router.push("/login");
};

// 3. INTEGRAR A FUNÇÃO DE SUBMIT COM O PINIA
const handleRegister = async () => {
  // Dispara a action da store passando os dados digitados
  const sucesso = await authStore.register({
    nome: nome.value,
    email: email.value,
    senha: senha.value,
  });

  // Se o cadastro deu certo no backend, redireciona para o login ou home
  if (sucesso) {
    router.push("/login");
  }
};
</script>

<template>
  <div class="pagina">
    <div class="container-flex">

      <div class="branding">
        <h1>BRASIVA</h1>
        <p class="subtitulo">Gerenciamento completo.</p>

        <div class="sessao-login-desktop">
          <p>SEJA BEM VINDO!<br><span>Acesse sua conta agora mesmo.</span></p>
          <button class="botao-secundario" :disabled="authStore.loading" @click="irLogin">FAZER LOGIN</button>
        </div>
      </div>

      <div class="card-cadastro">
        <h2>CRIE SUA CONTA</h2>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <form @submit.prevent="handleRegister" class="formulario" :class="{ 'em-carregamento': authStore.loading }">
          <div class="campo">
            <label for="nome">NOME</label>
            <input type="text" id="nome" v-model="nome" :disabled="authStore.loading" required />
          </div>

          <div class="campo">
            <label for="email">EMAIL</label>
            <input type="email" id="email" v-model="email" placeholder="Insira seu email para continuar" :disabled="authStore.loading" required />
          </div>

          <div class="campo">
            <label for="senha">SENHA</label>
            <input type="password" id="senha" v-model="senha" :disabled="authStore.loading" required />
          </div>

          <button type="submit" class="botao-principal" :disabled="authStore.loading">
            {{ authStore.loading ? "CADASTRANDO..." : "REGISTRAR" }}
          </button>
        </form>
      </div>

      <div class="sessao-login-mobile">
        <p>SEJA BEM VINDO!<br><span>Acesse sua conta agora mesmo.</span></p>
        <button class="botao-secundario" :disabled="authStore.loading" @click="irLogin">FAZER LOGIN</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   SEUS ESTILOS JÁ EXISTENTES CONTINUAM IGUAIS ABAIXO...
   ========================================================================== */

.pagina {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: white;
  font-family: "Poppins", sans-serif;
  background: url("../img/background-image.png") center center / cover no-repeat;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.container-flex {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branding {
  text-align: center;
  margin-bottom: 1.5rem;
}

.branding h1 {
  font-family: "Imbue", serif;
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1;
  color: #FF4800;
  margin: 0;
}

.subtitulo {
  font-size: 1rem;
  margin-top: 0.2rem;
  font-weight: 400;
}

.card-cadastro {
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  color: #000000;
}

.card-cadastro h2 {
  font-size: 1.3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transition: opacity 0.3s ease;
}

/* Deixa o form levemente transparente enquanto envia para o backend */
.em-carregamento {
  opacity: 0.6;
  pointer-events: none;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.campo label {
  font-size: 0.85rem;
  font-weight: 700;
}

.campo input {
  width: 100%;
  height: 35px;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 0 0.7rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
}

.campo input::placeholder {
  color: #999;
  font-size: 0.75rem;
}

/* ==========================================================================
   NOVOS ESTILOS ADICIONADOS PARA TRATAMENTO DE ERRO E ESTADOS DE BOTÃO
   ========================================================================== */

.error-message {
  color: #c0392b;
  background-color: #fdecea;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 1.2rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

button:disabled {
  background: #999 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

/* ==========================================================================
   CONTINUAÇÃO DOS SEUS ESTILOS PADRÃO
   ========================================================================== */

.botao-principal {
  width: 60%;
  height: 35px;
  margin: 0.5rem auto 0 auto;
  border: none;
  border-radius: 999px;
  background: #FF4800;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.botao-principal:hover {
  background: #ff6627;
  transform: translateY(-2px);
}

.sessao-login-desktop {
  display: none;
}

.sessao-login-mobile {
  text-align: center;
  margin-top: 2.5rem;
  width: 100%;
}

.sessao-login-mobile p, .sessao-login-desktop p {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.sessao-login-mobile p span, .sessao-login-desktop p span {
  font-weight: 400;
  font-size: 0.95rem;
}

.botao-secundario {
  width: 180px;
  height: 35px;
  border: none;
  border-radius: 999px;
  background: #FF4800;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.botao-secundario:hover {
  background: #ff6627;
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .pagina {
    justify-content: center;
    padding: 0 10%;
  }

  .container-flex {
    max-width: 1100px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 4rem;
  }

  .branding {
    text-align: left;
    margin-bottom: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .branding h1 {
    font-size: 5.5rem;
  }

  .subtitulo {
    font-size: 1.4rem;
    margin-bottom: 4rem;
  }

  .sessao-login-desktop {
    display: block;
    text-align: left;
  }

  .card-cadastro {
    max-width: 450px;
    padding: 2.5rem 2rem;
  }

  .sessao-login-mobile {
    display: none;
  }
}
</style>
