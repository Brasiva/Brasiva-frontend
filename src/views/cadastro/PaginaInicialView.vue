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

    <div class="conteudo">
      <h1>BRASIVA</h1>

      <p class="subtitulo">
        Gerenciamento completo.
      </p>

      <InstallButton class="instalar" />

      <div class="botoes">
        <button class="botao" @click="irCadastro">
          CADASTRAR-SE
        </button>

        <button class="botao" @click="irLogin">
          FAZER LOGIN
        </button>
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

  color: white;
  font-family: "Poppins", sans-serif;

  background: url("../img/background-image.png") center center / cover no-repeat;
}

.conteudo {
  width: 100%;
  max-width: 420px;


  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 2rem;
}

.conteudo h1 {
  font-family: "Imbue", serif;
  font-size: 4rem;
  font-weight: 300;
  line-height: 1;
}

.conteudo p {
  margin-top: .2rem;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.15rem;
  font-weight: 400;
  text-align: center;
}

.subtitulo{
    margin-top: .3rem;
    margin-bottom: .8rem;
}

.instalar{
    margin-bottom: 2rem;
}

.botoes {
  width: 100%;

  display: flex;
  flex-direction: column;

  align-items: center;

  gap: 1rem;
}

.botao {
  width: 230px;
  height: 35px;

  border: none;
  border-radius: 999px;

  background: #FF4800;
  color: white;

  font-size: .95rem;
  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.botao:hover {
  background: #ff6627;
  transform: translateY(-2px);
}

.botao:active {
  transform: scale(.97);
}

/* DESKTOP */

@media (min-width: 768px) {

  .pagina {
    justify-content: flex-start;
    padding-left: 8%;
  }

  .conteudo {
    max-width: 500px;
    align-items: center;   /* continua centralizado */
    text-align: center;
  }

  .conteudo h1 {
    font-size: 6rem;
  }

  .subtitulo {
    font-size: 1.3rem;
    margin-top: .2rem;
    margin-bottom: .8rem;
    text-align: center;
    width: 100%;
  }

  .instalar {
    margin-bottom: 2.5rem;
  }

  .botoes {
    position: fixed;
    left: 50%;
    top: 58%;
    transform: translateX(-50%);
    bottom: 12%;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    width: 260px;
    align-items: center;
  }

  .botao {
    width: 230px;
    height: 40px;
    font-size: 1rem;
  }
}
</style>
