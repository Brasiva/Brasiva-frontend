<script>
import FuncionarioCard from '../components/FuncionarioCard.vue'
import FormFuncionario from '../components/FormFuncionario.vue'

export default {
    components: {
    FuncionarioCard,
    FormFuncionario
    },

    data() {
    return {
        funcionarios: [
        {
            id: 1,
            nome: 'João',
            salario: 3000,
            cargo: 'Cozinheiro'
        }
        ],

        mostrarForm: false,
        modoEdicao: false,

        funcionarioSelecionado: null
    }
    },

    methods: {
    // abrir novo
    novoFuncionario() {
        this.modoEdicao = false
        this.funcionarioSelecionado = null
        this.mostrarForm = true
    },

    // abrir edição
    editarFuncionario(func) {
        this.modoEdicao = true
        this.funcionarioSelecionado = func
        this.mostrarForm = true
    },

    // excluir
    excluirFuncionario(id) {
        this.funcionarios = this.funcionarios.filter(f => f.id !== id)
    },

    // salvar (novo ou edição)
    salvarFuncionario(dados) {
    if (this.modoEdicao) {
        const index = this.funcionarios.findIndex(f => f.id === dados.id)
        this.funcionarios[index] = dados
    } else {
        dados.id = Date.now()
        this.funcionarios.push(dados)
    }

    this.fecharForm()
    },

    fecharForm() {
        this.mostrarForm = false
        this.funcionarioSelecionado = null
    }
    }
}
</script>

<template>
    <div>
    <h1>Funcionários</h1>

    <button @click="novoFuncionario">
        + Adicionar Funcionário
    </button>

    <!-- LISTA -->
    <div class="grid">
        <FuncionarioCard
        v-for="func in funcionarios"
        :key="func.id"
        :funcionario="func"
        @editar="editarFuncionario"
        @excluir="excluirFuncionario"
        />
    </div>

    <!-- FORM (APARECE SÓ QUANDO CLICA) -->
    <FormFuncionario
        v-if="mostrarForm"
        :funcionario="funcionarioSelecionado"
        :modoEdicao="modoEdicao"
        @salvar="salvarFuncionario"
        @cancelar="fecharForm"
    />
    </div>
</template>