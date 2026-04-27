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
        <img
          v-if="preview"
          :src="preview"
          class="preview-img"
        />

        <input type="file" @change="carregarImagem" />
      </div>

      <div class="form-fields">
        <input v-model="dados.nome" placeholder="Nome" />
        <input v-model="dados.cargo" placeholder="Cargo" />
        <input v-model="dados.salario" placeholder="Salário" />
      </div>
    </div>

    <button @click="salvar" class="confirm">
      {{ modoEdicao ? 'CONFIRMAR' : 'SALVAR' }}
    </button>

    <button @click="cancelar" class="cancel">CANCELAR</button>
  </div>
</template>

<style scoped>
.form-card {
  background: #FFA323;
  margin: 0 20vw;
  padding: 2vw 4vw ;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Urbanist', sans-serif;
}
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.form-card h3 {
  margin-top: 0;
  text-align: center;
  color: #ffffff;
}
.form-card input {
  display: block;
  justify-content: center;
  width: 93%;
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
.form-card .confirm, .form-card .cancel {
  background-color: #E48500;
  font-family: 'Urbanist', sans-serif;
}
.form-card .form-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.image-container input {
  text-align: center;
}
.preview-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}
</style>