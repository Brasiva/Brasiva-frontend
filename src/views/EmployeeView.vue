<script>
import EmployeeCard from '../components/EmployeeCard.vue'
import FormEmployee from '../components/FormEmployee.vue'
import { mapActions, mapState } from 'pinia'
import { useFuncionarioStore } from '../stores/funcionarios'

export default {
  components: {
    EmployeeCard,
    FormEmployee
  },

  data() {
    return {
      mostrarForm: false,
      modoEdicao: false,
      funcionarioSelecionado: null
    }
  },

  computed: {
    ...mapState(useFuncionarioStore, [
      'funcionarios',
      'carregando',
      'erro'
    ])
  },

  mounted() {
    this.buscarFuncionarios()
  },

  methods: {
    ...mapActions(useFuncionarioStore, [
      'buscarFuncionarios',
      'adicionarFuncionario',
      'atualizarFuncionario',
      'removerFuncionario'
    ]),

    novoFuncionario() {
      this.modoEdicao = false
      this.funcionarioSelecionado = null
      this.mostrarForm = true
    },

    editarFuncionario(func) {
      this.modoEdicao = true
      this.funcionarioSelecionado = func
      this.mostrarForm = true
    },

    async excluirFuncionario(id) {
      if (confirm('Deseja realmente excluir este funcionário?')) {
        await this.removerFuncionario(id)
      }
    },

    async salvarFuncionario(dados) {
      try {
        if (this.modoEdicao) {
          await this.atualizarFuncionario(
            this.funcionarioSelecionado.id,
            dados
          )
        } else {
          await this.adicionarFuncionario(dados)
        }

        this.fecharForm()
      } catch (error) {
        alert('Falha ao salvar registro no servidor.')
      }
    },

    fecharForm() {
      this.mostrarForm = false
      this.funcionarioSelecionado = null
    }
  }
}
</script>

<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">

        <div class="header-page">
          <div class="title">
            <h1>Funcionários</h1>
            <p>
              Informe-se sobre os funcionários e suas ocupações
            </p>
          </div>

          <button
            class="add-button"
            @click="novoFuncionario"
          >
            <span class="material-symbols-outlined">
              add
            </span>
            Adicionar funcionário
          </button>
        </div>

        <div
          v-if="carregando"
          class="status-info"
        >
          <span class="material-symbols-outlined">
            progress_activity
          </span>

          Carregando dados...
        </div>

        <div
          v-if="erro"
          class="status-error"
        >
          <span class="material-symbols-outlined">
            error
          </span>

          {{ erro }}
        </div>

        <div
          v-if="!carregando && funcionarios.length"
          class="grid"
        >
          <EmployeeCard
            v-for="func in funcionarios"
            :key="func.id"
            :funcionario="func"
            @editar="editarFuncionario"
            @excluir="excluirFuncionario"
          />
        </div>

        <div
          v-if="!carregando && !funcionarios.length && !erro"
          class="empty-state"
        >
          <span class="material-symbols-outlined">
            group
          </span>

          <h3>Nenhum funcionário cadastrado</h3>

          <p>
            Clique em "Adicionar funcionário" para cadastrar o primeiro.
          </p>
        </div>

      </div>

      <div
        v-if="mostrarForm"
        class="overlay"
        @click.self="fecharForm"
      >
        <FormEmployee
          :funcionario="funcionarioSelecionado"
          :modoEdicao="modoEdicao"
          @salvar="salvarFuncionario"
          @cancelar="fecharForm"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-body {
  width: 100%;
  padding: 20px 16px 40px;
}

.header-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 22px;
}

.title h1 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
  font-weight: 700;
}

.title p {
  margin: 5px 0 0;
  color: #888;
  font-size: 0.85rem;
}

.add-button {
  width: 100%;
  min-height: 44px;
  border: none;
  border-radius: 10px;
  background-color: #90caf9;
  color: #333;
  padding: 10px 18px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: 0.2s;
}

.add-button:hover {
  background-color: #64b5f6;
}

.add-button .material-symbols-outlined {
  font-size: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.status-info,
.status-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;
  padding: 12px 14px;
  border-radius: 10px;
  margin-bottom: 18px;
  font-size: 0.8rem;
}

.status-info {
  color: #1976d2;
}

.status-error {
  color: #c62828;
  background-color: #ffebee;
}

.status-info .material-symbols-outlined,
.status-error .material-symbols-outlined {
  font-size: 19px;
}

.empty-state {
  background-color: #fff;
  border-radius: 15px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state .material-symbols-outlined {
  font-size: 45px;
  color: #90caf9;
}

.empty-state h3 {
  margin: 12px 0 5px;
  color: #333;
  font-size: 1rem;
}

.empty-state p {
  margin: 0;
  color: #888;
  font-size: 0.8rem;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 999;
  overflow-y: auto;
}

@media (min-width: 600px) {
  .page-body {
    padding: 25px 30px;
  }

  .header-page {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .add-button {
    width: auto;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 768px) {
  .page-body {
    padding: 30px;
  }

  .title h1 {
    font-size: 1.6rem;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }
}

@media (min-width: 1024px) {
  .page-body {
    padding: 30px 40px;
  }

  .title h1 {
    font-size: 1.8rem;
  }

  .title p {
    font-size: 0.9rem;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(260px, 1fr));
    gap: 20px;
  }
}
</style>
