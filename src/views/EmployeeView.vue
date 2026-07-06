<script>
import EmployeeCard from '../components/EmployeeCard.vue'
import FormEmployee from '../components/FormEmployee.vue'

export default {
    components: {
    EmployeeCard,
    FormEmployee
    },

    data() {
    return {
        funcionarios: [],

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
    <div class="content">
    <div class="header-page">
        <div class="title">
        <h1>Funcionários</h1>
        <h2>Informe-se sobre os funcionários e suas ocupações</h2>
        </div>

        <button @click="novoFuncionario">
            + Adicionar Funcionário
        </button>
    </div>
    

    <!-- LISTA -->
    <div class="grid">
        <EmployeeCard
        v-for="func in funcionarios"
        :key="func.id"
        :funcionario="func"
        @editar="editarFuncionario"
        @excluir="excluirFuncionario"
        />
    </div>

    <!-- FORM (APARECE SÓ QUANDO CLICA) -->
    <!-- MODAL -->
    <div v-if="mostrarForm" class="overlay">

        <FormEmployee
            :funcionario="funcionarioSelecionado"
            :modoEdicao="modoEdicao"
            @salvar="salvarFuncionario"
            @cancelar="fecharForm"
        />

    </div>
    </div>
</template>

<style scoped>
    .title h1,
    .title h2 {
        margin: 4px;
    }
    .content .header-page .title h1 {
    font-family: 'Unbounded', sans-serif;
    }
    .content .header-page .title h2 {
        font-family: 'Urbanist', sans-serif;
    }
    .content .grid {
        display: grid;
        grid-template-columns: repeat(3, 380px);
        gap: 30px;
        padding: 20px;
        justify-content: space-between;
    }
    .content button {
        border-style: none;
        background-color: #FF9500;
        border-radius: 20px;
        padding: 5px 10px;
        color: white;
        font-family: 'Urbanist';
        font-weight: bold;
        font-size: 1.1rem;
    }
    .header-page {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    .title {
        display: flex;
        flex-direction: column;
    }
    .overlay {
        position: fixed;
        top: 0;
        left: 0;

        width: 100vw;
        height: 100vh;

        background: rgba(0, 0, 0, 0.4);

        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 999;
    }
</style>