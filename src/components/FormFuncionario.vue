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

    <!-- IMAGEM -->
    <div>
      <img
        v-if="preview"
        :src="preview"
        class="preview-img"
      />

      <input type="file" @change="carregarImagem" />
    </div>

    <input v-model="dados.nome" placeholder="Nome" />
    <input v-model="dados.cargo" placeholder="Cargo" />
    <input v-model="dados.salario" placeholder="Salário" />

    <button @click="salvar">
      {{ modoEdicao ? 'CONFIRMAR' : 'SALVAR' }}
    </button>

    <button @click="cancelar">Cancelar</button>
  </div>
</template>