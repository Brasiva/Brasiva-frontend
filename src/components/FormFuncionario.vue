<script>
export default {
  props: {
    funcionario: Object,
    modoEdicao: Boolean
  },
  data() {
    return {
      dados: {
        id: null,
        nome: '',
        salario: '',
        cargo: '',
        foto: ''
      },
      preview: ''
    }
  },
  watch: {
    funcionario: {
      immediate: true,
      handler(novo) {
        if (novo) {
          this.dados = { ...novo }
          this.preview = novo.foto
        }
      }
    }
  },
  methods: {
    carregarImagem(event) {
      const file = event.target.files[0]

      if (!file) return

      const reader = new FileReader()

      reader.onload = (e) => {
        this.preview = e.target.result
        this.dados.foto = e.target.result
      }

      reader.readAsDataURL(file)
    },

    salvar() {
      this.$emit('salvar', this.dados)
    },

    cancelar() {
      this.$emit('cancelar')
    }
  }
}
</script>

<template>
  <div class="form-card">
    <h3>
      {{ modoEdicao ? 'EDITAR INFORMAÇÕES' : 'NOVO FUNCIONÁRIO' }}
    </h3>

    <div class="form-content">

      <!-- IMAGEM -->
      <div class="image-container">

        <!-- SEM IMAGEM -->
        <label v-if="!preview" class="upload-box">
          <div class="placeholder">
            adicionar foto
          </div>
          <input type="file" accept="image/*" @change="carregarImagem" />
        </label>

        <!-- COM IMAGEM -->
        <div v-else class="preview-wrapper">
          <img :src="preview" class="preview-img" />

          <!-- BOTÃO SEPARADO -->
          <label class="change-button">
            alterar foto
            <input type="file" accept="image/*" @change="carregarImagem" />
          </label>
        </div>

      </div>

      <!-- CAMPOS -->
      <div class="form-fields">

        <div class="input-group">
          <label>Nome</label>
          <input v-model="dados.nome" placeholder="Ex.: João da Silva"/>
        </div>

        <div class="input-group">
          <label>Cargo</label>
          <input v-model="dados.cargo" placeholder="Ex.: Cozinheiro"/>
        </div>

        <div class="input-group">
          <label>Salário</label>
          <input v-model="dados.salario" placeholder="Ex.: 4000"/>
        </div>

      </div>
    </div>

    <div class="buttons">
      <button @click="salvar" class="confirm">
        {{ modoEdicao ? 'CONFIRMAR' : 'SALVAR' }}
      </button>

      <button @click="cancelar" class="cancel">CANCELAR</button>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  background: #FFA323;
  margin: 0 25vw;
  padding: 2vw 1vw;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Urbanist', sans-serif;
}

.form-card h3 {
  margin-top: 0;
  text-align: center;
  color: #ffffff;
}

.form-card input,
.form-card button {
  font-size: 1rem;
}

.form-card input {
  width: 90%;
  margin: 8px;
  padding: 10px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 2px;
}

.form-card button {
  margin: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #E48500;
  color: white;
  cursor: pointer;
}

.form-card button:hover {
  background-color: #555555;
}

.form-card .buttons {
  display: flex;
  justify-content: center;
}

.form-card .confirm,
.form-card .cancel {
  background-color: #E48500;
  font-family: 'Urbanist', sans-serif;
}

.form-card .form-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-left: 1vw;
}

/* ===== IMAGEM ===== */

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 2vw;
}

/* upload inicial */
.upload-box {
  width: 160px;
  height: 160px;
  cursor: pointer;
}

.upload-box input {
  display: none;
}

/* placeholder */
.placeholder {
  height: 100%;
  background: #d9d9d9;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9rem;
  border-radius: 6px;
}

/* preview */
.preview-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* imagem NÃO clicável */
.preview-img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  pointer-events: none; /* ISSO AQUI É O PULO DO GATO */
}

/* botão separado */
.change-button {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ffffff;
  cursor: pointer;
  text-decoration: underline;
}

.change-button input {
  display: none;
}

/* ===== INPUTS ===== */

.form-fields {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  margin-left: 10px;
  font-size: 1.1rem;
  color: #000000;
}
</style>