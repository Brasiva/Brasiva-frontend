<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

// Controle de fluxo das etapas: 1 = Pedir Email, 2 = Nova Senha, 3 = Sucesso
const passo = ref(1); 

const email = ref("");
const novaSenha = ref("");
const confirmarSenha = ref("");

const irLogin = () => {
  router.push("/login"); 
};

// Passo 1: Envia o e-mail real chamando a Pinia Store
const handleEnviarEmail = async () => {
  const sucesso = await authStore.enviarEmailRecuperacao(email.value);
  
  if (sucesso) {
    passo.value = 2; // Avança para a tela de colocar a nova senha
  }
};

// Passo 2: Envia a nova senha informada para o backend persistir
const handleRedefinirSenha = async () => {
  if (novaSenha.value !== confirmarSenha.value) {
    authStore.error = "As senhas não coincidem.";
    return;
  }

  const sucesso = await authStore.atualizarSenha(email.value, novaSenha.value);

  if (sucesso) {
    passo.value = 3; // Vai para a tela de sucesso total
    
    // Redireciona automaticamente para o login após 4 segundos
    setTimeout(() => {
      irLogin();
    }, 4000);
  }
};
</script>

<template>
  <div class="pagina">
    <div class="bg-imagem"></div>

    <div class="container-flex">

      <div v-if="passo === 1" class="card-login">
        <button class="btn-voltar" @click="irLogin">← Esqueci minha senha</button>
        <h2>Insira seu email</h2>

        <p v-if="erroLocal" class="error-message">{{ erroLocal }}</p>

        <form @submit.prevent="handleEnviarEmail" class="formulario" :class="{ 'em-carregamento': carregando }">
          <div class="campo">
            <label for="email">EMAIL</label>
            <input name="email" id="email" type="email" autocomplete="email" v-model="email" placeholder="insira seu email para continuar" :disabled="carregando" required />
          </div>

          <p class="texto-informativo">Após clicar em continuar, verifique seu email para redefinir sua senha.</p>

          <button type="submit" class="botao-principal" :disabled="carregando">
            {{ carregando ? "ENVIANDO..." : "Continuar" }}
          </button>
        </form>
      </div>

      <div v-if="passo === 2" class="card-login">
        <button class="btn-voltar" @click="passo = 1">← Criar uma nova senha</button>
        <h2>Insira sua nova senha</h2>

        <p v-if="erroLocal" class="error-message">{{ erroLocal }}</p>

        <form @submit.prevent="handleRedefinirSenha" class="formulario" :class="{ 'em-carregamento': carregando }">
          <div class="campo">
            <label for="novaSenha">SENHA</label>
            <input type="password" id="novaSenha" v-model="novaSenha" placeholder="Nova senha" :disabled="carregando" required />
          </div>

          <div class="campo">
            <label for="confirmarSenha">CONFIRME SUA SENHA</label>
            <input type="password" id="confirmarSenha" v-model="confirmarSenha" placeholder="Confirme a nova senha" :disabled="carregando" required />
          </div>

          <p class="texto-informativo">Clique em continuar para mudar sua senha.</p>

          <button type="submit" class="botao-principal" :disabled="carregando">
            {{ carregando ? "SALVANDO..." : "Continuar" }}
          </button>
        </form>
      </div>

      <div v-if="passo === 3" class="card-login card-sucesso">
        <div class="icone-sucesso">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2>Senha alterada!</h2>
        <p class="texto-informativo centralizado">Sua senha foi atualizada com sucesso.<br>Redirecionando...</p>
        <button @click="irLogin" class="botao-principal">VOLTAR AO LOGIN</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
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

.em-carregamento {
  opacity: 0.6;
  pointer-events: none;
}

button:disabled, input:disabled {
  cursor: not-allowed !important;
}

button:disabled {
  background: #999 !important;
  transform: none !important;
}

/* MOBILE FIRST - COMPLETAMENTE CENTRALIZADO */
.pagina {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center;     /* Centraliza verticalmente */
  position: relative;
  overflow: hidden;
  color: rgb(255, 255, 255);
  font-family: "Poppins", sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.bg-imagem {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: url("../img/background-image.png") center center / cover no-repeat;
  transition: transform 0.3s ease;
}

.container-flex {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-login {
  width: 100%;
  background: rgba(255, 255, 255, 0.27);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2.5rem 1.8rem;
  box-sizing: border-box;
  color: #000000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
}

.btn-voltar {
  background: none;
  border: none;
  color: #000000;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: left;
  padding: 0;
  margin-bottom: 1.2rem;
  cursor: pointer;
}

.card-login h2 {
  font-size: 1.25rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.campo label {
  font-size: 1rem;
  font-weight: 700;
}

.campo input {
  width: 100%;
  height: 38px;
  border: 1px solid black;
  border-radius: 6px;
  padding: 0 0.7rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.45);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
}

.campo input::placeholder {
  color: #333333;
  font-size: 0.8rem;
}

.texto-informativo {
  font-size: 0.75rem;
  color: #1e1e1e;
  text-align: center;
  font-weight: 500;
  margin: -0.2rem 0;
  line-height: 1.4;
}

.texto-informativo.centralizado {
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.botao-principal {
  width: 60%;
  height: 38px;
  margin: 0.5rem auto 0 auto;
  border: none;
  border-radius: 999px;
  background: #FF9500;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.botao-principal:hover {
  background: #ffa826;
  transform: translateY(-2px);
}

.card-sucesso {
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.icone-sucesso {
  background: #ffffff;
  border: 2px solid #FF9500;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

/* DESKTOP RESPONSIVO - APENAS GIRA O BACKGROUND */
@media (min-width: 768px) {
  .bg-imagem {
    width: 100vh;
    height: 100vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: center;
  }

  .card-login {
    max-width: 450px;
    padding: 4rem 3.5rem;
  }
}
</style>