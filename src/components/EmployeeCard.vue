<script scoped>
export default {
  props: {
    funcionario: Object
  },
  methods: {
    editar() {
      this.$emit('editar', this.funcionario)
    },
    excluir() {
      this.$emit('excluir', this.funcionario.id)
    }
  }
}
</script>

<template>
  <div class="card">
  <div class="conteudo">
    <img
      :src="funcionario.foto || '/avatar.png'"
      class="foto"
    />

    <div class="info">
      <p><strong>Nome:</strong> {{ funcionario.nome }}</p>
      <p><strong>Salário:</strong> R$ {{ funcionario.salario }}</p>
      <p><strong>Cargo:</strong> {{ funcionario.cargo }}</p>

      <div class="acoes">
        <button @click="$emit('editar', funcionario)">
          <font-awesome-icon icon="fa-solid fa-user-pen" />
        </button>
        <button @click="$emit('excluir', funcionario.id)">
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.card {
  background: #fff4d4;
  border-radius: 12px;
  padding: 15px;
  width: 290px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.conteudo {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.foto {
  width: 140px;
  height: 140px;
  border-radius: 10px; /* quadradinho igual sua referência */
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Urbanist';
}

.acoes {
  margin-top: 10px;
  padding-left: 2.9vw;
}

button {
  margin-right: 8px;
  background: orange;
  border: none;
  border-radius: 6px;
  padding: 5px 8px;
  cursor: pointer;
  font-size: 1.1vw;
}
</style>