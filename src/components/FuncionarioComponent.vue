<script setup>
import { ref, onMounted } from 'vue';


const funcionario = ref({
    nome: '',
    cargo: '',
    salario: 0,
    fotoUrl: ''
});

const buscarDadosFuncionario = async () => {
    try {
        // Substitua pela URL real do seu endpoint
        const response = await fetch('https://api.exemplo.com/funcionario/1');
        const dados = await response.json();
        
        // Atualizamos o estado com o que veio do backend
        funcionario.value = dados;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
};

onMounted(() => {
    buscarDadosFuncionario();
});
</script>

<template>
    <div class="card-funcionario">
        <img :src="funcionario.fotoUrl" :alt="funcionario.nome" width="100">

        <p><strong>Nome:</strong> {{ funcionario.nome }}</p>
        <p><strong>Cargo:</strong> {{ funcionario.cargo }}</p>
        <p><strong>Salário:</strong> R$ {{ funcionario.salario.toLocaleString('pt-BR') }}</p>
    </div>
</template>

<style scoped>
.card-funcionario {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    max-width: 300px;
}
</style>