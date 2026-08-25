<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const passo = ref(1);
const email = ref("");
const novaSenha = ref("");
const confirmarSenha = ref("");

const irLogin = () => {
  router.push("/login");
};

const handleEnviarEmail = async () => {
  const sucesso = await authStore.enviarEmailRecuperacao(email.value);
  if (sucesso) {
    passo.value = 2;
  }
};

const handleRedefinirSenha = async () => {
  if (novaSenha.value !== confirmarSenha.value) {
    authStore.error = "As senhas não coincidem.";
    return;
  }

  const sucesso = await authStore.atualizarSenha(email.value, novaSenha.value);
  if (sucesso) {
    passo.value = 3;
    setTimeout(() => {
      irLogin();
    }, 4000);
  }
};
</script>

<template>
  <div class="pagina">
    <div class="orange-glow"></div>

    <div class="container-flex">

      <!-- PASSO 1 -->
      <div v-if="passo === 1" class="card-login">
        <button class="btn-voltar" @click="irLogin">← Esqueci minha senha</button>
        <h2>Insira seu email</h2>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <form @submit.prevent="handleEnviarEmail" class="formulario" :class="{ 'em-carregamento': authStore.loading }">
          <div class="campo">
            <label for="email">EMAIL</label>
            <div class="input-wrapper">
              <input name="email" id="email" type="email" autocomplete="email" v-model="email" placeholder="insira seu email para continuar" :disabled="authStore.loading" required />
            </div>
          </div>

          <p class="texto-informativo">Após clicar em continuar, verifique seu email para redefinir sua senha.</p>

          <button type="submit" class="botao-principal" :disabled="authStore.loading">
            {{ authStore.loading ? "ENVIANDO..." : "Continuar" }}
          </button>
        </form>
      </div>

      <!-- PASSO 2 -->
      <div v-if="passo === 2" class="card-login">
        <button class="btn-voltar" @click="passo = 1">← Criar uma nova senha</button>
        <h2>Insira sua nova senha</h2>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <form @submit.prevent="handleRedefinirSenha" class="formulario" :class="{ 'em-carregamento': authStore.loading }">
          <div class="campo">
            <label for="novaSenha">SENHA</label>
            <div class="input-wrapper">
              <input type="password" id="novaSenha" v-model="novaSenha" placeholder="Nova senha" :disabled="authStore.loading" required />
            </div>
          </div>

          <div class="campo">
            <label for="confirmarSenha">CONFIRME SUA SENHA</label>
            <div class="input-wrapper">
              <input type="password" id="confirmarSenha" v-model="confirmarSenha" placeholder="Confirme a nova senha" :disabled="authStore.loading" required />
            </div>
          </div>

          <p class="texto-informativo">Clique em continuar para mudar sua senha.</p>

          <button type="submit" class="botao-principal" :disabled="authStore.loading">
            {{ authStore.loading ? "SALVANDO..." : "Continuar" }}
          </button>
        </form>
      </div>

      <!-- PASSO 3 -->
      <div v-if="passo === 3" class="card-login card-sucesso">
        <div class="icone-sucesso">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6D29" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2>Senha alterada!</h2>
        <p class="texto-informativo centralizado">Sua senha foi atualizada com sucesso.<br>Redirecionando...</p>
        <button @click="irLogin" class="botao-principal">VOLTAR AO LOGIN</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #161316;
  color: #FFFFFF;
  font-family: "Poppins", sans-serif;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
}

.orange-glow {
  position: absolute;
  top: -100px;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(255, 109, 41, 0.35) 0%, rgba(22, 19, 22, 0) 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 1;
}

.container-flex {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
}

.card-login {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.btn-voltar {
  background: none;
  border: none;
  color: #FF6D29;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: left;
  padding: 0;
  margin-bottom: 1.2rem;
  cursor: pointer;
}

.card-login h2 {
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #FFFFFF;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.campo label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #BABABA;
  letter-spacing: 0.5px;
}

.input-wrapper {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 44px;
}

.input-wrapper input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #FFFFFF;
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
}

.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.texto-informativo {
  font-size: 0.75rem;
  color: #BABABA;
  text-align: center;
  line-height: 1.4;
}

.texto-informativo.centralizado {
  margin-bottom: 1.5rem;
}

.botao-principal {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #FF6D29 0%, #453027 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  margin-top: 0.5rem;
}

.botao-principal:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.error-message {
  color: #ff5252;
  background-color: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  text-align: center;
}

.em-carregamento {
  opacity: 0.5;
  pointer-events: none;
}

button:disabled, input:disabled {
  cursor: not-allowed !important;
}

.card-sucesso {
  align-items: center;
  text-align: center;
}

.icone-sucesso {
  background: rgba(255, 109, 41, 0.1);
  border: 2px solid #FF6D29;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .card-login {
    padding: 3rem 2.5rem;
  }
}
</style>
