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
    <img
      :src="funcionario.foto || '/avatar.png'"
      class="foto"
    />

    <p>Nome: {{ funcionario.nome }}</p>
    <p>Salário: R$ {{ funcionario.salario }}</p>
    <p>Cargo: {{ funcionario.cargo }}</p>

    <button @click="$emit('editar', funcionario)">✏️</button>
    <button @click="$emit('excluir', funcionario.id)">🗑️</button>
  </div>
</template>