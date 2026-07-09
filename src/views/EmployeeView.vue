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
        // Mapeia a lista reativa vinda do backend
        ...mapState(useFuncionarioStore, ['funcionarios', 'carregando', 'erro'])
    },

    mounted() {
        // Busca os dados do backend real assim que carregar a página
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
            if (confirm("Deseja realmente excluir este funcionário?")) {
                await this.removerFuncionario(id)
            }
        },

        async salvarFuncionario(dados) {
            try {
                if (this.modoEdicao) {
                    await this.atualizarFuncionario(this.funcionarioSelecionado.id, dados)
                } else {
                    await this.adicionarFuncionario(dados)
                }
                this.fecharForm()
            } catch (error) {
                alert("Falha ao salvar registro no servidor.")
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
        
        <div v-if="carregando" class="status-info">Carregando dados...</div>
        <div v-if="erro" class="status-error">{{ erro }}</div>

        <div class="grid">
            <EmployeeCard
                v-for="func in funcionarios"
                :key="func.id"
                :funcionario="func"
                @editar="editarFuncionario"
                @excluir="excluirFuncionario"
            />
        </div>

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
    /* Seus estilos mantidos originais */
    .title h1, .title h2 { margin: 4px; }
    .content .header-page .title h1 { font-family: 'Unbounded', sans-serif; }
    .content .header-page .title h2 { font-family: 'Urbanist', sans-serif; }
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
    .header-page { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
    .title { display: flex; flex-direction: column; }
    .overlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 999;
    }
    .status-info { padding: 20px; color: #FF9500; font-weight: bold; }
    .status-error { padding: 20px; color: red; font-weight: bold; }
</style>