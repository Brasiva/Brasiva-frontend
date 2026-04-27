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

    <button @click="$emit('editar', funcionario)"><font-awesome-icon icon="fa-solid fa-user-pen" /></button>
    <button @click="$emit('excluir', funcionario.id)"><font-awesome-icon icon="fa-solid fa-trash-can" /></button>
  </div>
</template>