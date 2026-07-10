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

.content {
    width: 100%;
    padding: 15px;
}

/* ================= HEADER ================= */

.header-page {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
    margin-bottom: 15px;
}

.title {
    display: flex;
    flex-direction: column;
}

.title h1 {
    margin: 0;
    font-family: 'Unbounded', sans-serif;
    font-size: 1.5rem;
    color: #FF9500;
}

.title h2 {
    margin: 5px 0 0;
    font-family: 'Urbanist', sans-serif;
    font-size: 0.9rem;
    color: #666;
}


/* BOTÃO */

.content button {
    border: none;
    background-color: #FF9500;
    border-radius: 15px;
    padding: 10px 18px;
    color: white;
    font-family: 'Urbanist', sans-serif;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    transition: .3s;
}

.content button:hover {
    background-color: #e78700;
}


/* ================= GRID ================= */

.content .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
}


/* ================= FORM OVERLAY ================= */

.overlay {
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background: rgba(0,0,0,0.45);

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 15px;

    z-index: 999;
}


/* ================= STATUS ================= */

.status-info {
    padding: 15px;
    color: #FF9500;
    font-weight: bold;
    font-family: 'Urbanist';
}

.status-error {
    padding: 15px;
    color: red;
    font-weight: bold;
    font-family: 'Urbanist';
}


/* ================================================= */
/* TABLET */
/* ================================================= */

@media (min-width: 600px) {

    .header-page {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }


    .content button {
        width: auto;
    }


    .title h1 {
        font-size: 1.8rem;
    }


    .content .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
    }

}


/* ================================================= */
/* DESKTOP */
/* ================================================= */

@media (min-width: 1024px) {

    .content {
        padding: 25px;
    }


    .title h1 {
        font-size: 2rem;
    }


    .title h2 {
        font-size: 1rem;
    }


    .content .grid {
        grid-template-columns: repeat(3, minmax(280px, 1fr));
        gap: 30px;
        padding: 20px;
    }


    .content button {
        font-size: 1.1rem;
        padding: 12px 22px;
    }

}

</style>