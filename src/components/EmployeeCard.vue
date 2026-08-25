<template>
  <div class="employee-card">

    <div class="card-header">

      <div class="employee-photo">
        <img
          v-if="fotoUrl"
          :src="fotoUrl"
          :alt="funcionario.nome"
        />

        <span
          v-else
          class="material-symbols-outlined"
        >
          person
        </span>
      </div>

      <div class="employee-title">
        <h3>{{ funcionario.nome }}</h3>
        <span>{{ funcionario.cargo }}</span>
      </div>

    </div>

    <div class="info-block">
      <small>Telefone</small>

      <span>
        {{ funcionario.telefone || 'Não informado' }}
      </span>
    </div>

    <div class="info-block">
      <small>Pagamento</small>

      <strong>
        {{ formatarPagamento(funcionario.pagamento) }}
      </strong>
    </div>

    <div class="card-actions">

      <button
        class="edit-button"
        type="button"
        @click="$emit('editar', funcionario)"
      >
        <span class="material-symbols-outlined">
          edit
        </span>

        Editar
      </button>

      <button
        class="delete-button"
        type="button"
        @click="$emit('excluir', funcionario.id)"
      >
        <span class="material-symbols-outlined">
          delete
        </span>

        Excluir
      </button>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    funcionario: {
      type: Object,
      required: true
    }
  },

  computed: {
    fotoUrl() {
      if (!this.funcionario.foto?.url) {
        return ''
      }

      return this.funcionario.foto.url.replace(
        'http://127.0.0.1:8000',
        import.meta.env.VITE_API_URL
      )
    }
  },

  methods: {
    formatarPagamento(valor) {
      if (
        valor === null ||
        valor === undefined ||
        valor === ''
      ) {
        return 'Não informado'
      }

      return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  }
}
</script>

<style scoped>
.employee-card {
  background-color: #ffffff;
  padding: 18px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 15px;
}

.employee-photo {
  width: 58px;
  height: 58px;
  min-width: 58px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #e3f2fd;
  color: #90caf9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.employee-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.employee-photo .material-symbols-outlined {
  font-size: 30px;
}

.employee-title {
  min-width: 0;
}

.employee-title h3 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.employee-title span {
  display: block;
  margin-top: 3px;
  color: #888;
  font-size: 0.75rem;
}

.info-block {
  background-color: #f9f9f9;
  padding: 9px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.info-block small {
  display: block;
  margin-bottom: 3px;
  color: #888;
  font-size: 10px;
}

.info-block span,
.info-block strong {
  color: #333;
  font-size: 0.82rem;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.edit-button,
.delete-button {
  flex: 1;
  min-height: 40px;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: 0.2s;
}

.edit-button {
  background-color: #e3f2fd;
  color: #1976d2;
}

.edit-button:hover {
  background-color: #bbdefb;
}

.delete-button {
  background-color: #ffebee;
  color: #c62828;
}

.delete-button:hover {
  background-color: #ffcdd2;
}

.edit-button .material-symbols-outlined,
.delete-button .material-symbols-outlined {
  font-size: 17px;
}
</style>
