<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const senha = ref("");

const irCadastro = () => {
  router.push("/cadastro");
};

const handleLogin = async () => {
  const sucesso = await authStore.login(email.value, senha.value);
  if (sucesso) {
    router.push("/home");
  }
};

const recuperarSenha = () => {
  router.push("/recuperar-senha");
};
</script>

<template>
  <div class="pagina">
    <div class="orange-glow"></div>

    <div class="container-flex">
      <div class="branding">
        <h1 class="logo">BRASIVA</h1>

        <div class="sessao-cadastro-desktop">
          <p>BEM-VINDO DE VOLTA!<br><span>Crie uma nova conta agora mesmo.</span></p>
          <button class="botao-secundario" :disabled="authStore.loading" @click="irCadastro">CADASTRAR-SE</button>
        </div>
      </div>

      <div class="card-login">
        <h2>ACESSE SUA CONTA</h2>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <form @submit.prevent="handleLogin" class="formulario" :class="{ 'em-carregamento': authStore.loading }">
          <div class="campo">
            <label for="email">EMAIL</label>
            <div class="input-wrapper">
              <input name="email" id="email" autocomplete="email" v-model="email" placeholder="seu@email.com" :disabled="authStore.loading" required />
            </div>
          </div>

          <div class="campo">
            <label for="senha">SENHA</label>
            <div class="input-wrapper">
              <input type="password" id="senha" v-model="senha" placeholder="••••••••" :disabled="authStore.loading" required />
            </div>
          </div>

          <button type="button" class="link-esqueci" :disabled="authStore.loading" @click="recuperarSenha">
            Esqueci minha senha
          </button>

          <button type="submit" class="botao-principal" :disabled="authStore.loading">
            {{ authStore.loading ? "ENTRANDO..." : "ACESSAR" }}
          </button>
        </form>

        <div class="sessao-cadastro-mobile">
          <p>BEM-VINDO DE VOLTA!<br><span>Crie uma nova conta agora mesmo.</span></p>
          <button class="botao-secundario" :disabled="authStore.loading" @click="irCadastro">CADASTRAR-SE</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
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
  padding: 1.5rem 1rem;
  box-sizing: border-box;
}

.orange-glow {
  position: absolute;
  top: -80px;
  width: 320px;
  height: 320px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branding {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo {
  font-family: "Imbue", serif;
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 0 15px rgba(255, 109, 41, 0.3);
}

.card-login {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-login h2 {
  font-size: 1.25rem;
  font-weight: 700;
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

.link-esqueci {
  background: none;
  border: none;
  color: #FF6D29;
  font-size: 0.8rem;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  text-align: right;
  margin-top: -0.4rem;
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

.sessao-cadastro-desktop {
  display: none;
}

.sessao-cadastro-mobile {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sessao-cadastro-mobile p, .sessao-cadastro-desktop p {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.8rem;
  color: #FFFFFF;
}

.sessao-cadastro-mobile p span, .sessao-cadastro-desktop p span {
  font-weight: 400;
  font-size: 0.8rem;
  color: #BABABA;
}

.botao-secundario {
  width: 100%;
  height: 40px;
  border: 1px solid rgba(255, 109, 41, 0.4);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: #FFFFFF;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.botao-secundario:hover {
  background: rgba(255, 109, 41, 0.1);
  transform: translateY(-2px);
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

/* DESKTOP RESPONSIVO */
@media (min-width: 768px) {
  .orange-glow {
    width: 600px;
    height: 600px;
  }

  .container-flex {
    max-width: 900px;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 4rem;
  }

  .branding {
    text-align: left;
    margin-bottom: 0;
    flex: 1;
  }

  .logo {
    font-size: 5.5rem;
    margin-bottom: 1.5rem;
  }

  .sessao-cadastro-desktop {
    display: block;
  }

  .sessao-cadastro-desktop .botao-secundario {
    width: 180px;
  }

  .card-login {
    max-width: 400px;
    padding: 3rem 2.5rem;
  }

  .sessao-cadastro-mobile {
    display: none;
  }
}
</style>
