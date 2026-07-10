<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const nome = ref("");
const email = ref("");
const senha = ref("");

const irLogin = () => {
  router.push("/login");
};

const handleRegister = async () => {
  const sucesso = await authStore.register({
    nome: nome.value,
    email: email.value,
    senha: senha.value,
  });

  if (sucesso) {
    router.push("/login");
  }
};
</script>

<template>
  <div class="pagina">
    <div class="bg-imagem"></div>

    <div class="container-flex">

      <div class="branding">
        <h1>BRASIVA</h1>
        
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

/* MOBILE FIRST */
.pagina {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden; /* Segura o fundo rotacionado */
  color: white;
  font-family: "Poppins", sans-serif;
  padding: 0.4rem 0.1rem;
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
  background: url("@/assets/background-image.png") center center / cover no-repeat;
  transition: transform 0.3s ease;
}

.container-flex {
  position: relative;
  z-index: 2; /* Mantém os elementos acima da imagem */
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
  font-size: 4rem;
  font-weight: 400;
  line-height: 1;
  color: #ffffff;
  margin: 0 0 1rem 0;
}

/* Card mais transparente com desfoque de fundo */
.card-cadastro {
  width: 100%;
  background: rgba(255, 255, 255, 0.249); /* Alterado de 0.65 para maior transparência */
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  color: #000000; /* Texto claro para contraste */
  border: 1px solid rgba(255, 255, 255, 0.2);
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
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.campo label {
  font-size: 1.2rem;
  font-weight: 700;
}

/* Inputs adaptados para a nova transparência */
.campo input {
  width: 100%;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  border-color: black;
  padding: 0 0.7rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.45);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
}

.campo input::placeholder {
  color: #dddddd;
  font-size: 0.75rem;
}

/* Botões atualizados para o Laranja Claro (#FF9500) */
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
  height: 38px;
  border: none;
  border-radius: 999px;
  background: #FF9500;
  color: rgb(0, 0, 0);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.botao-secundario:hover {
  background: #ffa826;
  transform: translateY(-2px);
}

/* DESKTOP RESPONSIVO (Gira o Fundo para a Horizontal) */
@media (min-width: 768px) {
  .pagina {
    justify-content: center;
    padding: 0 10%;
  }

  /* Gira a imagem vertical simulando proporção horizontal estável */
  .bg-imagem {
    width: 100vh;
    height: 100vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: center;
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
    font-size: 6.5rem;
    margin: 0 0 2rem 0;
  }

  .sessao-login-desktop {
    display: block;
    text-align: left;
  }
  

  .card-cadastro {
    max-width: 450px;
    padding: 5rem 4rem;
  }

  .sessao-login-mobile {
    display: none;
  }
}
</style>