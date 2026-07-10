<template>
  <div class="cardapio-page">
    
    <div class="cardapio-header">
      <div class="textos-topo">
        <h2>Cardápio</h2>
        <p>Organize e monte os pratos com suas receitas.</p>
      </div>
      <button @click="abrirModalNovoPrato" class="btn-adicionar">
        + Adicionar Prato
      </button>
    </div>

    <div class="cardapio-grid">
      <div 
        v-for="prato in listaPratos" 
        :key="prato.id" 
        class="prato-container"
      >
        <div 
          v-if="pratoSelecionadoId !== prato.id" 
          class="card-prato-compacto"
          @click="selecionarPrato(prato.id)"
        >
          <div class="placeholder-imagem-card">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <div class="faixa-titulo">
            {{ (prato.nome || '').toUpperCase() }}
          </div>
        </div>

        <div v-else class="card-prato-detalhado">
          <div class="detalhe-coluna-esquerda">
            <div class="placeholder-imagem-detalhe">
              <i class="fa-solid fa-bowl-food"></i>
            </div>
            
            <div class="modo-fazer-container">
              <h5>Modo de Fazer:</h5>
              <p>{{ prato.modoFazer || 'Nenhum modo de preparo detalhado para este prato.' }}</p>
            </div>
          </div>

          <div class="detalhe-coluna-direita">
            <div class="topo-detalhe-titulo">
              <h4>{{ (prato.nome || '').toUpperCase() }}</h4>
              <span class="preco-tag">R$ {{ Number(prato.preco).toFixed(2) }}</span>
            </div>

            <p class="categoria-label"><strong>Categoria:</strong> {{ prato.categoria }}</p>

            <h5>Ingredientes:</h5>
            <ul class="lista-ingredientes-grid">
              <li v-for="(ing, idx) in prato.ingredientes" :key="idx">
                • {{ ing }}
              </li>
              <li v-if="!prato.ingredientes || prato.ingredientes.length === 0" class="sem-itens">
                Sem ingredientes vinculados.
              </li>
            </ul>

            <div class="acoes-detalhe">
              <button @click.stop="fecharDetalhes" class="btn-fechar-detalhe">Fechar</button>
              <button @click.stop="deletarPrato(prato.id)" class="btn-deletar-prato">Excluir Prato</button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="exibirModal" class="modal-overlay" @click.self="exibirModal = false">
      <div class="modal-card">
        <h3>+ NOVO PRATO -</h3>
        
        <form @submit.prevent="salvarNovoPrato" class="modal-form">
          <div class="form-group">
            <label>Nome do Prato:</label>
            <input type="text" v-model="formPrato.nome" placeholder="Ex: Salmão Grelhado" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Preço Sugerido (R$):</label>
              <input type="number" step="0.01" v-model="formPrato.preco" placeholder="45.00" required />
            </div>
            <div class="form-group">
              <label>Categoria:</label>
              <select v-model="formPrato.categoria" required>
                <option value="Prato Principal">Prato Principal</option>
                <option value="Acompanhamento">Acompanhamento</option>
                <option value="Sobremesa">Sobremesa</option>
                <option value="Bebida">Bebidas</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="label-estoque-info">Ingredientes Necessários:</label>
            <div class="estoque-checkbox-scroll">
              <label v-for="item in listaMockEstoque" :key="item" class="checkbox-item">
                <input 
                  type="checkbox" 
                  :value="item" 
                  v-model="formPrato.ingredientesSelecionados" 
                />
                <span>{{ item }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Modo de Fazer / Descrição:</label>
            <textarea v-model="formPrato.modoFazer" rows="3" placeholder="Insira o passo a passo da receita..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="exibirModal = false" class="btn-modal-voltar">Voltar</button>
            <button type="submit" class="btn-modal-salvar">CADASTRAR PRATO</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dados estáticos de exemplo para a apresentação
const listaPratos = ref([
  {
    id: 1,
    nome: 'Salmão Grelhado',
    preco: 65.00,
    categoria: 'Prato Principal',
    modoFazer: 'Grelhar o salmão na chapa por 5 minutos de cada lado com azeite e ervas finas.',
    ingredientes: ['Filé de Salmão', 'Azeite', 'Alecrim', 'Sal']
  },
  {
    id: 2,
    nome: 'Feijoada Completa',
    preco: 45.00,
    categoria: 'Prato Principal',
    modoFazer: 'Cozinhar o feijão com as carnes salgadas previamente dessalgadas por 3 horas.',
    ingredientes: ['Feijão Preto', 'Carne de Porco', 'Linguiça', 'Louro']
  },
  {
    id: 3,
    nome: 'Pudim de Leite',
    preco: 15.00,
    categoria: 'Sobremesa',
    modoFazer: 'Bater os ingredientes no liquidificador e assar em banho-maria com calda de açúcar.',
    ingredientes: ['Leite Condensado', 'Leite', 'Ovos', 'Açúcar']
  }
]);

// Opções estáticas para simular o estoque no preenchimento do formulário
const listaMockEstoque = ref([
  'Filé de Salmão', 'Feijão Preto', 'Arroz Branco', 'Batata', 'Ovos', 'Leite Condensado', 'Carne Moída', 'Frango'
]);

// Controle dos estados de tela
const pratoSelecionadoId = ref(null);
const exibirModal = ref(false);

const formPrato = ref({
  nome: '',
  preco: '',
  categoria: 'Prato Principal',
  modoFazer: '',
  ingredientesSelecionados: []
});

const selecionarPrato = (id) => {
  pratoSelecionadoId.value = id;
};

const fecharDetalhes = () => {
  pratoSelecionadoId.value = null;
};

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

const salvarNovoPrato = () => {
  // Cria e adiciona o prato localmente na lista da tela
  listaPratos.value.push({
    id: Date.now(),
    nome: formPrato.value.nome,
    preco: Number(formPrato.value.preco) || 0,
    categoria: formPrato.value.categoria,
    modoFazer: formPrato.value.modoFazer,
    ingredientes: [...formPrato.value.ingredientesSelecionados]
  });
  
  exibirModal.value = false;
};

const deletarPrato = (id) => {
  if (confirm("Tem certeza que deseja remover este prato?")) {
    listaPratos.value = listaPratos.value.filter(p => p.id !== id);
    pratoSelecionadoId.value = null;
  }
};
</script>

<style scoped>
.cardapio-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 1rem 1rem 3rem 1rem;
  box-sizing: border-box;
}

.cardapio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.textos-topo h2 {
  color: #FF9500;
  font-size: 1.6rem;
  margin: 0;
}
.textos-topo p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.btn-adicionar {
  background-color: #FF9500;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 149, 0, 0.2);
}

/* Grid Ajustado */
.cardapio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
}

.card-prato-compacto {
  background-color: #ffffff;
  border: 4px solid #FF9500;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}
.card-prato-compacto:hover {
  transform: scale(1.02);
}

.placeholder-imagem-card {
  height: 120px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-imagem-card i{
    font-size:60px;
    color:#FF9500;
}

.faixa-titulo {
  background-color: #FF9500;
  color: white;
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  font-size: 0.85rem;
}

/* Modo Detalhado Expandido */
.card-prato-detalhado {
  grid-column: 1 / -1; 
  background-color: #FF9500;
  color: white;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.placeholder-imagem-detalhe {
  height: 140px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-imagem-detalhe i{
    font-size:90px;
    color:#FF9500;
}

.modo-fazer-container h5 { margin: 0.8rem 0 0.2rem 0; text-decoration: underline; }
.modo-fazer-container p { font-size: 0.8rem; line-height: 1.4; margin: 0; }

.topo-detalhe-titulo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.4);
  padding-bottom: 0.3rem;
}
.topo-detalhe-titulo h4 { margin: 0; font-size: 1.2rem; font-weight: bold; }
.preco-tag { background: white; color: #FF9500; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: bold; font-size: 0.9rem; }

.categoria-label { font-size: 0.8rem; margin: 0.3rem 0; }

.card-prato-detalhado h5 { font-size: 0.9rem; margin: 0.8rem 0 0.3rem 0; }
.lista-ingredientes-grid {
  list-style: none; padding: 0; margin: 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem;
  font-size: 0.8rem;
}

.acoes-detalhe {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn-fechar-detalhe { background: white; color: #FF9500; border: none; padding: 0.4rem 1rem; border-radius: 12px; font-weight: bold; cursor: pointer; }
.btn-deletar-prato { background: none; border: none; color: #ffeef0; text-decoration: underline; font-size: 0.75rem; cursor: pointer; }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;
}
.modal-card {
  background: #FF9500; color: white; padding: 1.5rem; border-radius: 16px;
  width: 92%; max-width: 450px; max-height: 85vh; overflow-y: auto;
}
.modal-card h3 { text-align: center; margin: 0 0 1rem 0; font-size: 1.2rem; }
.modal-form { display: flex; flex-direction: column; gap: 0.8rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-size: 0.75rem; font-weight: bold; margin-bottom: 0.2rem; }
.form-group input, .form-group select, .form-group textarea {
  border-radius: 6px; border: none; padding: 0.5rem; font-family: inherit; font-size: 0.85rem;
}

.estoque-checkbox-scroll {
  background: white; color: #000; border-radius: 6px;
  max-height: 100px; overflow-y: auto; padding: 0.5rem;
  display: flex; flex-direction: column; gap: 0.3rem;
}
.checkbox-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; }

.modal-actions { display: flex; justify-content: space-between; margin-top: 0.5rem; }
.btn-modal-voltar { background: none; border: none; color: white; font-weight: bold; cursor: pointer; }
.btn-modal-salvar { background: white; color: #FF9500; border: none; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; cursor: pointer; }

@media (min-width: 768px) {
  .card-prato-detalhado {
    flex-direction: row;
  }
  .detalhe-coluna-esquerda { width: 40%; }
  .detalhe-coluna-direita { width: 60%; padding-left: 1.5rem; }
}
</style>