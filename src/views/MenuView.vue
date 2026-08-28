<template>
  <div class="cardapio-page">

    <div class="cardapio-header">
      <div class="textos-topo">
        <h2>Cardápio</h2>
        <p>Organize e monte os pratos com suas receitas.</p>
      </div> 
      
      <button @click="abrirModalNovoPrato" class="btn-adicionar"> + Adicionar Prato </button>
    </div>
    <!-- GRID DOS PRATOS -->
    <div class="cardapio-grid">
      <div v-for="prato in listaPratos" :key="prato.id" class="prato-container" >
      <!-- CARD COMPACTO -->
        <div class="card-prato-compacto"
        @click="selecionarPrato(prato.id)" >
          <div class="placeholder-imagem-card">
          <i class="fa-solid fa-utensils"></i>
          </div>
          <div class="faixa-titulo"> {{ (prato.nome || '').toUpperCase() }}</div>
        </div>
      </div>
    </div>

        <!-- MODAL DE DETALHES DO PRATO -->
    <div v-if="pratoSelecionado" class="modal-overlay" @click.self="fecharDetalhes" >
      <div class="modal-detalhe-prato">
      <!-- COLUNA ESQUERDA -->
        <div class="detalhe-coluna-esquerda">
          <div class="placeholder-imagem-detalhe">
            <i class="fa-solid fa-bowl-food"></i>
          </div>
          <div class="modo-fazer-container">
            <h5>Modo de Fazer:</h5>
            <p> {{ pratoSelecionado.modoFazer || 'Nenhum modo de preparo detalhado para este prato.' }} </p>
          </div>
        </div>
      <!-- COLUNA DIREITA -->
        <div class="detalhe-coluna-direita">
          <div class="topo-detalhe-titulo">
            <h4> {{ (pratoSelecionado.nome || '').toUpperCase() }} </h4>
            <span class="preco-tag"> R$ {{ Number(pratoSelecionado.preco).toFixed(2) }} </span>
          </div>
          <p class="categoria-label"> <strong>Categoria:</strong> {{ pratoSelecionado.categoria }} </p>
          
          <h5>Ingredientes:</h5>
          <ul class="lista-ingredientes-grid">
            <li v-for="(ing, idx) in pratoSelecionado.ingredientes" :key="idx" > • {{ ing }} </li>
            <li v-if=" !pratoSelecionado.ingredientes || pratoSelecionado.ingredientes.length === 0 " class="sem-itens" > Sem ingredientes vinculados.</li>
          </ul>
          <!-- AÇÕES -->
          <div class="acoes-detalhe">
            <button @click="fecharDetalhes" class="btn-fechar-detalhe" > Fechar </button>
            <button @click="deletarPrato(pratoSelecionado.id)" class="btn-deletar-prato" > Excluir Prato </button>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL DE NOVO PRATO -->
    <div v-if="exibirModal" class="modal-overlay" @click.self="exibirModal = false" >
      <div class="modal-card">
        <h3>+ NOVO PRATO -</h3>
        <form @submit.prevent="salvarNovoPrato" class="modal-form" >
          <!-- NOME -->
          <div class="form-group">
            <label>Nome do Prato:</label>
            <input type="text" v-model="formPrato.nome" placeholder="Ex: Salmão Grelhado" required />
          </div>
          <!-- PREÇO E CATEGORIA -->
          <div class="form-row">
            <div class="form-group">
              <label>Preço Sugerido (R$):</label>
              <input type="number" step="0.01" v-model="formPrato.preco" placeholder="45.00" required />
            </div>
            <div class="form-group">
              <label>Categoria:</label>
              <select v-model="formPrato.categoria" required >
                <option value="Prato Principal"> Prato Principal </option>
                <option value="Acompanhamento"> Acompanhamento </option>
                <option value="Sobremesa"> Sobremesa </option>
                <option value="Bebida"> Bebidas </option>
              </select>
            </div>
          </div>
          <!-- INGREDIENTES -->
          <div class="form-group">
            <label class="label-estoque-info"> Ingredientes Necessários: </label>
            <div class="estoque-checkbox-scroll">
              <label v-for="item in listaMockEstoque" :key="item" class="checkbox-item" > 
                <input type="checkbox" :value="item" v-model="formPrato.ingredientesSelecionados" /> <span>{{ item }}</span>
              </label>
            </div>
          </div>
          <!-- MODO DE FAZER -->
          <div class="form-group">
            <label> Modo de Fazer / Descrição: </label>
            <textarea v-model="formPrato.modoFazer" rows="3" placeholder="Insira o passo a passo da receita..." ></textarea>
          </div>
          <!-- BOTÕES -->
          <div class="modal-actions">
            <button type="button" @click="exibirModal = false" class="btn-modal-voltar" > Voltar </button>
            <button type="submit" class="btn-modal-salvar" > CADASTRAR PRATO </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCardapioStore } from '@/stores/cardapio';

// STORE DO CARDÁPIO


const cardapioStore = useCardapioStore();
// A lista de pratos agora vem da store
const listaPratos = computed(() => cardapioStore.pratos);

// CONTROLE DO PRATO SELECIONADO

// Guarda apenas o ID do prato selecionado
const pratoSelecionadoId = ref(null);

// Busca o prato completo usando o ID
const pratoSelecionado = computed(() => {
  return listaPratos.value.find(
    prato => prato.id === pratoSelecionadoId.value
  );
});

// CONTROLE DOS MODAIS

const exibirModal = ref(false);

// FORMULÁRIO DE NOVO PRATO

const formPrato = ref({
  nome: '',
  preco: '',
  categoria: 'Prato Principal',
  modoFazer: '',
  ingredientesSelecionados: []
});

// ESTOQUE

// Por enquanto continua estático.
// Depois podemos vincular isso ao estoque do banco.
const listaMockEstoque = ref([
  'Filé de Salmão',
  'Feijão Preto',
  'Arroz Branco',
  'Batata',
  'Ovos',
  'Leite Condensado',
  'Carne Moída',
  'Frango'
]);

// CARREGAR PRATOS

onMounted(async () => {
  await cardapioStore.buscarPratosDoServidor();
});

// ABRIR DETALHES

const selecionarPrato = (id) => {
  pratoSelecionadoId.value = id;
};

// FECHAR DETALHES

const fecharDetalhes = () => {
  pratoSelecionadoId.value = null;
};

// ABRIR MODAL DE NOVO PRATO

const abrirModalNovoPrato = () => {
  formPrato.value = {
    nome: '',
    preco: '',
    categoria: 'Prato Principal',
    modoFazer: '',
    ingredientesSelecionados: []
  };
  exibirModal.value = true;
};

// SALVAR NOVO PRATO

const salvarNovoPrato = async () => {
  const novoPrato = {
    nome: formPrato.value.nome,
    preco: Number(formPrato.value.preco) || 0,
    categoria: formPrato.value.categoria,
    modoFazer: formPrato.value.modoFazer,
    ingredientes: [...formPrato.value.ingredientesSelecionados]
  };
  await cardapioStore.adicionarPrato(novoPrato);
  exibirModal.value = false;
};

// DELETAR PRATO

const deletarPrato = async (id) => {
  if (confirm('Tem certeza que deseja remover este prato?')) {
    await cardapioStore.removerPrato(id);
    pratoSelecionadoId.value = null;
  }
};
</script>
```


<style scoped>
/*PÁGINA*/
.cardapio-page { 
  display: flex; 
  flex-direction: column; 
  padding: 2rem; 
  box-sizing: border-box; 
  min-height: 100vh; 
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
}
/*CABEÇALHO*/
.cardapio-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 1.5rem; 
  gap: 1rem;
}
.textos-topo h2 { 
  font-size: 1.6rem;
  margin: 0; 
} 
.textos-topo p { 
  margin: 5px 0 0; 
  color: #888; 
  font-size: 0.85rem; 
} 
/*BOTÃO ADICIONAR*/ 
.btn-adicionar { 
  min-height: 44px; 
  box-sizing: border-box; 
  border: none; 
  padding: 10px 18px; 
  border-radius: 10px; 
  background-color: #90caf9; 
  color: #333; 
  font-family: 'Poppins', sans-serif; 
  font-size: 0.85rem; 
  font-weight: 600; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 7px; 
  transition: background-color 0.2s ease; 
} 
.btn-adicionar:hover { 
  background-color: #64b5f6; 
} 
/*GRID*/ 
.cardapio-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
  gap: 2rem; 
} 
.prato-container { 
  display: flex; 
  justify-content: center; 
} 
/*CARD COMPACTO*/ 
.card-prato-compacto { 
  background-color: #ffffff; 
  padding: 16px; 
  border-radius: 8px; 
  overflow: hidden; 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); 
  width: 100%;
  height: 100%;
  max-width: 250px;
  min-height: 250px;
  box-sizing: border-box; 
} 
.card-prato-compacto:hover { 
  transform: scale(1.02); 
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); 
} 
/*IMAGEM DO CARD*/ 
.placeholder-imagem-card { 
  height: 170px; 
  background-color: #ffffff; 
  display: flex; 
  align-items: center;
  justify-content: center; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); 
} 
.placeholder-imagem-card i { 
  font-size: 60px; 
  color: #FF9500; 
} 
/*TÍTULO*/ 
.faixa-titulo { 
  background-color: #f0f0f0; 
  border-radius: 6px; 
  border: 1px solid #ddd; 
  text-align: center; 
  padding: 0.5rem 0.8rem; 
  margin-top: 20px; 
  font-size: 0.85rem; 
  -webkit-text-stroke: 0.4px; 
} 
/*OVERLAY DOS MODAIS*/ 
.modal-overlay { 
  position: fixed;
  inset: 0; 
  width: 100vw; 
  height: 100vh; 
  background: rgba(0, 0, 0, 0.5); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 1rem; 
  box-sizing: border-box; 
  z-index: 99999; 
} 
/*MODAL DE DETALHES*/ 
.modal-detalhe-prato { 
  position: relative;
  z-index: 100000;
  background-color: #FF9500;
  color: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 92%;
  max-width: 750px;
  max-height: 85vh;
  overflow-y: auto;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 1.2rem;
} 
/*IMAGEM DETALHADA*/ 
.placeholder-imagem-detalhe { 
  height: 180px; 
  background-color: rgba(255, 255, 255, 0.2); 
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
} 
.placeholder-imagem-detalhe i { 
  font-size: 90px; 
  color: white; 
} 
/*MODO DE FAZER*/ 
.modo-fazer-container h5 { 
  margin: 0.8rem 0 0.3rem 0; 
  text-decoration: underline; 
  font-size: 0.9rem; 
} 
.modo-fazer-container p { 
  font-size: 0.8rem; 
  line-height: 1.4; 
  margin: 0; 
} 
/*COLUNAS*/ 
.detalhe-coluna-esquerda { 
  width: 100%; 
} 
.detalhe-coluna-direita { 
  width: 100%; 
} 
/*TÍTULO DO DETALHE*/ 
.topo-detalhe-titulo { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  gap: 1rem; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.4); 
  padding-bottom: 0.5rem; 
} 
.topo-detalhe-titulo h4 { 
  margin: 0; 
  font-size: 1.2rem; 
  font-weight: 600; 
} 
/*PREÇO*/ 
.preco-tag { 
  background: white; 
  color: #FF9500; 
  padding: 0.2rem 0.6rem; 
  border-radius: 12px; 
  font-weight: 600; 
  font-size: 0.9rem; 
  white-space: nowrap; 
} 
/*CATEGORIA*/ 
.categoria-label { 
  font-size: 0.8rem; 
  margin: 0.8rem 0; 
} 
/*INGREDIENTES*/ 
.modal-detalhe-prato h5 { 
  font-size: 0.9rem; 
  margin: 0.8rem 0 0.3rem 0; 
} 
.lista-ingredientes-grid { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 0.3rem; 
  font-size: 0.8rem; 
} 
.sem-itens { 
  grid-column: 1 / -1; 
} 
/*AÇÕES DO DETALHE*/ 
.acoes-detalhe { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; gap: 1rem; 
  margin-top: 1.5rem; 
} 
.btn-fechar-detalhe { 
  background: white; 
  color: #FF9500; 
  border: none; 
  padding: 0.4rem 1rem; 
  border-radius: 12px; 
  font-weight: bold; 
  cursor: pointer; 
} 
.btn-deletar-prato { 
  background: none; 
  border: none; 
  color: #ffeef0; 
  text-decoration: underline; 
  font-size: 0.75rem; 
  cursor: pointer; 
} 
/*MODAL NOVO PRATO*/ 
.modal-card { 
  background: #FF9500; 
  color: white; 
  padding: 1.5rem; 
  border-radius: 16px; 
  width: 92%; 
  max-width: 450px; 
  max-height: 85vh; 
  overflow-y: auto; 
  box-sizing: border-box; 
} 
.modal-card h3 { 
  text-align: center; 
  margin: 0 0 1rem 0; 
  font-size: 1.2rem; 
} 
.modal-form { 
  display: flex; 
  flex-direction: column; 
  gap: 0.8rem; 
} 
/*FORMULÁRIO*/ 
.form-row { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 0.8rem; 
} 
.form-group { 
  display: flex; 
  flex-direction: column; 
} 
.form-group label { 
  font-size: 0.75rem; 
  font-weight: bold; 
  margin-bottom: 0.2rem; 
} 
.form-group input, .form-group select, .form-group textarea { 
  border-radius: 6px; 
  border: none; 
  padding: 0.5rem; 
  font-family: inherit; 
  font-size: 0.85rem; 
  box-sizing: border-box; 
} 
/*ESTOQUE*/ 
.estoque-checkbox-scroll { 
  background: white; 
  color: #000; 
  border-radius: 6px; 
  max-height: 100px; 
  overflow-y: auto; 
  padding: 0.5rem; 
  display: flex; 
  flex-direction: column; 
  gap: 0.3rem; 
} 
.checkbox-item { 
  display: flex; 
  align-items: center; 
  gap: 0.4rem; 
  font-size: 0.8rem; 
} 
/*BOTÕES DO MODAL*/ 
.modal-actions { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 0.5rem; 
  gap: 1rem; 
} 
.btn-modal-voltar { 
  background: none; 
  border: none; 
  color: white; 
  font-weight: bold; 
  cursor: pointer; 
} 
.btn-modal-salvar { 
  background: white; 
  color: #FF9500; 
  border: none; 
  padding: 0.5rem 1rem; 
  border-radius: 20px; 
  font-weight: bold; 
  cursor: pointer; 
} 
/*DESKTOP*/ 
@media (min-width: 768px) { 
  .modal-detalhe-prato { 
    flex-direction: row; 
  } 
  .detalhe-coluna-esquerda { 
    width: 40%; 
  } 
  .detalhe-coluna-direita { 
    width: 60%; 
    padding-left: 1rem; 
  } 
} 
/*MOBILE*/ 
@media (max-width: 500px) { 
  .cardapio-page { 
    padding: 1rem; 
  } 
  .cardapio-header { 
    align-items: flex-start; 
  } 
  .btn-adicionar { 
    font-size: 0.75rem; 
    padding: 8px 12px; 
  } 
  .cardapio-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1rem; 
  } 
  .prato-container { 
    width: 100%; 
  } 
  .card-prato-compacto { 
    max-width: none; 
    padding: 10px; 
  } 
  .placeholder-imagem-card { 
    height: 100px; 
  } 
  .placeholder-imagem-card i { 
    font-size: 45px; 
  } 
  .faixa-titulo { 
    font-size: 0.7rem; 
    padding: 0.45rem 0.3rem; 
  } 
  .modal-detalhe-prato { 
    width: 95%; 
    padding: 1rem; 
    max-height: 90vh; 
  } 
  .topo-detalhe-titulo h4 { 
    font-size: 1rem; 
  } 
  .preco-tag { 
    font-size: 0.75rem; 
  } 
  .form-row { 
    grid-template-columns: 1fr; 
  }
}
</style>