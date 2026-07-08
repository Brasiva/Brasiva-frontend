<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// 1. Importar a mesma store do Pinia que criamos
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore(); // Instanciar a store

// Estados do formulário
const email = ref("");
const senha = ref("");

const irCadastro = () => {
  router.push("/cadastro");
};

// 2. Chamar a Action de login e validar a entrada
const handleLogin = async () => {
  const sucesso = await authStore.login(email.value, senha.value);

  if (sucesso) {
    // Redireciona para a página interna principal (ex: Home/Dashboard)
    router.push("/");
  }
};

const recuperarSenha = () => {
  router.push("/recuperar-senha");
};
</script>

<template>
  <div class="pagina">
    <div class="container-flex">

      <div class="branding">
        <h1>BRASIVA</h1>
        <p class="subtitulo">Gerenciamento completo.</p>

        <div class="sessao-cadastro-desktop">
          <p>BEM VINDO DE VOLTA!<br><span>Crie uma nova conta agora mesmo.</span></p>
          <button class="botao-secundario" :disabled="authStore.loading" @click="irCadastro">CADASTRAR-SE</button>
        </div>
      </div>

      <div class="card-login">
        <h2>ACESSE SUA CONTA</h2>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <form @submit.prevent="handleLogin" class="formulario" :class="{ 'em-carregamento': authStore.loading }">
          <div class="campo">
            <label for="email">EMAIL</label>
            <input type="email" id="email" v-model="email" placeholder="Insira seu email para continuar" :disabled="authStore.loading" required />
          </div>

          <div class="campo">
            <label for="senha">SENHA</label>
            <input type="password" id="senha" v-model="senha" :disabled="authStore.loading" required />
          </div>

          <button type="button" class="link-esqueci" :disabled="authStore.loading" @click="recuperarSenha">
            Esqueceu sua senha? Clique aqui
          </button>

          <button type="submit" class="botao-principal" :disabled="authStore.loading">
            {{ authStore.loading ? "ENTRANDO..." : "ACESSAR" }}
          </button>
        </form>
      </div>

      <div class="sessao-cadastro-mobile">
        <p>BEM VINDO DE VOLTA!<br><span>Crie uma nova conta agora mesmo.</span></p>
        <button class="botao-secundario" :disabled="authStore.loading" @click="irCadastro">CADASTRAR-SE</button>
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

.card-login {
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  color: #000000;
}

.card-login h2 {
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

.link-esqueci {
  background: none;
  border: none;
  color: #e63900;
  font-size: 0.75rem;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  text-align: center;
  margin-top: -0.5rem;
  text-decoration: underline;
}

/* Botões */
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

/* Seções Alternativas (Ir para Cadastro) */
.sessao-cadastro-desktop {
  display: none; /* Oculto no mobile */
}

.sessao-cadastro-mobile {
  text-align: center;
  margin-top: 2.5rem;
  width: 100%;
}

.sessao-cadastro-mobile p, .sessao-cadastro-desktop p {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.sessao-cadastro-mobile p span, .sessao-cadastro-desktop p span {
  font-weight: 400;
  font-size: 0.95rem;
}

.botao-secundario {
  width: 200px;
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

/* DESKTOP RESPONSIVO*/

@media (min-width: 768px) {
  .pagina {
    justify-content: center;
    padding: 0 10%;
  }

  .container-flex {
    max-width: 1100px;
    flex-direction: row-reverse;
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

  .sessao-cadastro-desktop {
    display: block;
    text-align: left;
  }


  .card-login {
    max-width: 450px;
    padding: 2.5rem 2rem;
  }

  .sessao-cadastro-mobile {
    display: none;
  }
}
</style>
