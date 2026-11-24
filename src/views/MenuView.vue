<template>
  <div class="cardapio-page">

    <div class="cardapio-header">
      <div class="textos-topo">
        <h2>Cardápio</h2>
        <p>Organize e monte os pratos com suas receitas.</p>
      </div> 
      
      <div class="acoes-cabecalho"><button @click="criarCategoria" class="btn-adicionar">+ Categoria</button><button @click="abrirModalNovoPrato" class="btn-adicionar"> + Adicionar Prato </button></div>
    </div>
    <!-- GRID DOS PRATOS -->
    <p v-if="mensagemFeedback" class="menu-feedback" role="status">{{ mensagemFeedback }}</p>
    <p v-if="cardapioStore.erro" class="erro-cardapio">{{ cardapioStore.erro }}</p>
    <p v-else-if="cardapioStore.carregando" class="erro-cardapio">Carregando cardapio...</p>
    <div v-else-if="!listaPratos.length" class="empty-state">
      <h3>Nenhum prato cadastrado</h3>
      <p>Clique em "Adicionar Prato" para cadastrar o primeiro.</p>
    </div>
    <section v-else class="category-groups">
      <section v-for="categoria in categoriasComPratos" :key="categoria.id" class="category-group">
        <header><div><h3>{{ categoria.nome }}</h3><p>{{ categoria.pratos.length }} {{ categoria.pratos.length === 1 ? 'prato' : 'pratos' }}</p></div></header>
        <div class="dish-grid">
          <button v-for="prato in categoria.pratos" :key="prato.id" class="dish-mini-card" @click="selecionarPrato(prato.id)">
            <span class="dish-name">{{ prato.nome }}</span>
            <span class="dish-details">{{ prato.sob_orcamento ? 'Sob orcamento' : `${moeda(prato.preco)} / ${prato.unidade}` }}</span>
            <span class="dish-status" :class="{ available: prato.disponivel }">{{ prato.disponivel ? 'Disponivel no site' : 'Aguardando liberacao' }}</span>
          </button>
        </div>
      </section>
    </section>

        <!-- MODAL DE DETALHES DO PRATO -->
    <div v-if="pratoSelecionado" class="modal-overlay" @click.self="fecharDetalhes" >
      <div class="modal-detalhe-prato">
      <!-- COLUNA ESQUERDA -->
        <div class="detalhe-coluna-esquerda">
          <span class="detail-category">{{ pratoSelecionado.categoriaNome }}</span>
          <div class="modo-fazer-container">
            <h5>Modo de Fazer:</h5>
            <p> {{ pratoSelecionado.modoFazer || 'Nenhum modo de preparo detalhado para este prato.' }} </p>
          </div>
        </div>
      <!-- COLUNA DIREITA -->
        <div class="detalhe-coluna-direita">
          <div class="topo-detalhe-titulo">
            <h4> {{ (pratoSelecionado.nome || '').toUpperCase() }} </h4>
            <span class="preco-tag">{{ pratoSelecionado.sob_orcamento ? 'Sob orçamento' : moeda(pratoSelecionado.preco) }}</span>
          </div>
          <p class="categoria-label"> <strong>Categoria:</strong> {{ pratoSelecionado.categoriaNome }} </p>
          
          <h5>Ingredientes:</h5>
          <ul class="lista-ingredientes-grid">
            <li v-for="(ing, idx) in pratoSelecionado.ingredientes" :key="idx" > • {{ ing }} </li>
            <li v-if=" !pratoSelecionado.ingredientes || pratoSelecionado.ingredientes.length === 0 " class="sem-itens" > Sem ingredientes vinculados.</li>
          </ul>
          <!-- AÇÕES -->
          <div class="acoes-detalhe">
            <button @click="abrirEdicao(pratoSelecionado)" class="btn-fechar-detalhe">Editar</button>
            <button @click="alternarDisponibilidade(pratoSelecionado)" class="btn-fechar-detalhe">{{ pratoSelecionado.disponivel ? 'Desativar' : 'Ativar' }}</button>
            <button @click="fecharDetalhes" class="btn-fechar-detalhe" > Fechar </button>
            <button @click="deletarPrato(pratoSelecionado.id)" class="btn-deletar-prato" > Excluir Prato </button>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL DE NOVO PRATO -->
    <div v-if="exibirModal" class="modal-overlay" @click.self="exibirModal = false" >
      <div class="modal-card">
        <h3>{{ formPrato.id ? 'EDITAR PRATO' : 'NOVO PRATO' }}</h3>
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
              <input type="number" step="0.01" v-model="formPrato.preco" placeholder="45.00" :required="!formPrato.sob_orcamento" :disabled="formPrato.sob_orcamento" />
            </div>
            <div class="form-group">
              <label>Categoria:</label>
              <select v-model="formPrato.categoria" required >
                <option v-for="categoria in cardapioStore.categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nome }}</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label><input v-model="formPrato.sob_orcamento" type="checkbox"> Sob orçamento, sem preço fixo</label></div>
          <div class="form-group"><label><input v-model="formPrato.disponivel" type="checkbox"> Disponibilizar no site público</label></div>
          <div class="form-group"><label>Unidade de venda:</label><input v-model="formPrato.unidade" required maxlength="30" placeholder="Ex.: kg, cento (100 unidades)"></div>
          <!-- MODO DE FAZER -->
          <div class="form-group">
            <label> Modo de Fazer / Descrição: </label>
            <textarea v-model="formPrato.modoFazer" rows="3" placeholder="Insira o passo a passo da receita..." ></textarea>
          </div>
          <!-- BOTÕES -->
          <p v-if="erroPrato" class="modal-feedback error" role="alert">{{ erroPrato }}</p>
          <div class="modal-actions">
            <button type="button" @click="exibirModal = false" class="btn-modal-voltar" > Voltar </button>
            <button type="submit" class="btn-modal-salvar">{{ formPrato.id ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRATO' }}</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="exibirModalCategoria" class="modal-overlay" @click.self="exibirModalCategoria = false">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
        <h3 id="category-modal-title">Nova categoria</h3>
        <form class="modal-form" @submit.prevent="salvarCategoria">
          <div class="form-group"><label for="nome-categoria">Nome da categoria</label><input id="nome-categoria" v-model.trim="nomeCategoria" maxlength="100" required autofocus></div>
          <p v-if="erroCategoria" class="modal-feedback error" role="alert">{{ erroCategoria }}</p>
          <div class="modal-actions"><button type="button" class="btn-modal-voltar" @click="exibirModalCategoria = false">Cancelar</button><button type="submit" class="btn-modal-salvar" :disabled="salvandoCategoria">{{ salvandoCategoria ? 'Salvando…' : 'Salvar categoria' }}</button></div>
        </form>
      </section>
    </div>
    <div v-if="pratoPendenteExclusao" class="modal-overlay" @click.self="pratoPendenteExclusao = null">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-dish-title">
        <h3 id="delete-dish-title">Excluir prato?</h3>
        <p class="delete-copy">Confirma a remoção de <strong>{{ pratoPendenteExclusao.nome }}</strong> do cardápio?</p>
        <p v-if="erroExclusao" class="modal-feedback error" role="alert">{{ erroExclusao }}</p>
        <div class="modal-actions"><button type="button" class="btn-modal-voltar" @click="pratoPendenteExclusao = null">Cancelar</button><button type="button" class="btn-delete-confirm" :disabled="excluindoPrato" @click="confirmarExclusao">{{ excluindoPrato ? 'Excluindo…' : 'Excluir prato' }}</button></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCardapioStore } from '@/stores/cardapio';

// STORE DO CARDÁPIO


const cardapioStore = useCardapioStore();
const moeda = (valor) => valor == null ? 'Sob orçamento' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor));
// A lista de pratos agora vem da store
const listaPratos = computed(() => cardapioStore.pratos);
const categoriasComPratos = computed(() => cardapioStore.categorias.map((categoria) => ({ ...categoria, pratos: listaPratos.value.filter((prato) => String(prato.categoria) === String(categoria.id)) })).filter((categoria) => categoria.pratos.length));

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
const exibirModalCategoria = ref(false)
const nomeCategoria = ref('')
const erroCategoria = ref('')
const salvandoCategoria = ref(false)
const erroPrato = ref('')
const mensagemFeedback = ref('')
const pratoPendenteExclusaoId = ref(null)
const erroExclusao = ref('')
const excluindoPrato = ref(false)
const pratoPendenteExclusao = computed(() => listaPratos.value.find((prato) => prato.id === pratoPendenteExclusaoId.value))

// FORMULÁRIO DE NOVO PRATO

const formPrato = ref({
  id: null,
  nome: '',
  preco: '',
  categoria: cardapioStore.categorias[0]?.id || '',
  unidade: 'unidade',
  disponivel: false,
  sob_orcamento: false,
  modoFazer: '',
  ingredientesSelecionados: []
});

// ESTOQUE

// Por enquanto continua estático.
// Depois podemos vincular isso ao estoque do banco.


// CARREGAR PRATOS

onMounted(async () => { try { await cardapioStore.buscarPratosDoServidor() } catch { /* Error is shown by the store. */ } });

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
  erroPrato.value = ''
  formPrato.value = {
    id: null,
    nome: '',
    preco: '',
    categoria: cardapioStore.categorias[0]?.id || '',
    unidade: 'unidade',
    disponivel: false,
    sob_orcamento: false,
    modoFazer: '',
    ingredientesSelecionados: []
  };
  exibirModal.value = true;
};

// SALVAR NOVO PRATO

const salvarNovoPrato = async () => {
  const novoPrato = {
    nome: formPrato.value.nome,
    preco: formPrato.value.sob_orcamento ? null : Number(formPrato.value.preco),
    categoria: formPrato.value.categoria,
    modoFazer: formPrato.value.modoFazer,
    unidade: formPrato.value.unidade || 'unidade',
    disponivel: formPrato.value.disponivel,
    sob_orcamento: formPrato.value.sob_orcamento,
    ingredientes: [...formPrato.value.ingredientesSelecionados]
  };
  try {
    if (formPrato.value.id) await cardapioStore.atualizarPrato({ ...novoPrato, id: formPrato.value.id, disponivel: formPrato.value.disponivel, sob_orcamento: formPrato.value.sob_orcamento })
    else await cardapioStore.adicionarPrato(novoPrato)
    exibirModal.value = false
    mensagemFeedback.value = formPrato.value.id ? 'Prato atualizado.' : 'Prato cadastrado.'
  }
  catch { erroPrato.value = 'Não foi possível salvar o prato. Verifique a conexão e os dados.' }
};

const abrirEdicao = (prato) => {
  erroPrato.value = ''
  formPrato.value = { id: prato.id, nome: prato.nome, preco: prato.preco, categoria: prato.categoria, modoFazer: prato.modoFazer, unidade: prato.unidade, disponivel: prato.disponivel, sob_orcamento: prato.sob_orcamento, ingredientesSelecionados: [] }
  pratoSelecionadoId.value = null
  exibirModal.value = true
}

const alternarDisponibilidade = async (prato) => {
  try { await cardapioStore.atualizarPrato({ ...prato, disponivel: !prato.disponivel }); pratoSelecionadoId.value = prato.id }
  catch { mensagemFeedback.value = 'Não foi possível atualizar a disponibilidade.' }
}

const criarCategoria = () => {
  nomeCategoria.value = ''
  erroCategoria.value = ''
  exibirModalCategoria.value = true
}

const salvarCategoria = async () => {
  if (!nomeCategoria.value.trim()) return
  salvandoCategoria.value = true
  erroCategoria.value = ''
  try {
    await cardapioStore.adicionarCategoria(nomeCategoria.value.trim())
    exibirModalCategoria.value = false
    mensagemFeedback.value = 'Categoria criada.'
  } catch {
    erroCategoria.value = 'Não foi possível criar a categoria. Verifique a conexão e tente novamente.'
  } finally {
    salvandoCategoria.value = false
  }
}

// DELETAR PRATO

const deletarPrato = (id) => {
  pratoSelecionadoId.value = null
  pratoPendenteExclusaoId.value = id
  erroExclusao.value = ''
}

const confirmarExclusao = async () => {
  if (!pratoPendenteExclusao.value || excluindoPrato.value) return
  excluindoPrato.value = true
  erroExclusao.value = ''
  try {
    await cardapioStore.removerPrato(pratoPendenteExclusao.value.id)
    pratoPendenteExclusaoId.value = null
    mensagemFeedback.value = 'Prato removido do cardápio.'
  } catch {
    erroExclusao.value = 'Não foi possível excluir o prato. Tente novamente.'
  } finally {
    excluindoPrato.value = false
  }
}
</script>
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
.acoes-cabecalho{display:flex;gap:9px;flex-wrap:wrap}
.header-actions{display:flex;gap:10px;flex-wrap:wrap}
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
/* ================= ESTADO VAZIO ================= */
.empty-state {
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 15px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state .material-symbols-outlined {
  font-size: 45px;
  color: #FF9500;
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
  width: 445px;
  max-width: 92%;
  padding: 1rem;
  max-height: 90vh;
  background-color: #ffffff;
  color: #000;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  box-sizing: border-box;

} 
/*IMAGEM DETALHADA*/ 
.placeholder-imagem-detalhe { 
  width: 100%;
  height: 180px; 
  background-color: rgba(255, 255, 255, 0.2); 
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.placeholder-imagem-detalhe i { 
  font-size: 90px; 
  color: rgb(35, 35, 35); 
} 
/*MODO DE FAZER*/ 
.modo-fazer-container {
  width: 100%;
}
.modo-fazer-container h5 { 
  margin: 0.8rem 0 0.3rem 0; 
  text-decoration: underline; 
  font-size: 0.9rem; 
} 
.modo-fazer-container p { 
  font-size: 0.8rem; 
  line-height: 1.4; 
  margin: 0 0 1.2rem 0; 
}
/*COLUNAS*/ 
.detalhe-coluna-esquerda { 
  width: 100%; 
} 
.detalhe-coluna-direita { 
  width: 100%;
  padding-left: 0;
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
  background: #FF9500; 
  color: #000000; 
  padding: 0.4rem 0.8rem; 
  border-radius: 10px; 
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
  background: #FF9500; 
  color: #ffffff; 
  border: none; 
  padding: 0.4rem 0.8rem; 
  border-radius: 7px;
  cursor: pointer; 
} 
.btn-deletar-prato { 
  background-color: #bc160a; 
  border: none; 
  color: #ffffff;
  padding: 0.4rem 0.8rem;
  border-radius: 7px;
  font-size: 0.75rem; 
  cursor: pointer;
} 
/*MODAL NOVO PRATO*/ 
.modal-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
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
.modal-card label {
  font-size: 0.8rem; 
  color: #3a3a3a; 
  margin: 0.5rem 0 1rem 0; 
}
.modal-form { 
  display: flex; 
  flex-direction: column; 
  gap: 0.8rem;
}
.modal-card input {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
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
.form-group input, .form-group select,  .form-group textarea { 
  border-radius: 6px; 
  border: none; 
  padding: 0.5rem; 
  font-family: inherit; 
  font-size: 0.85rem; 
  box-sizing: border-box;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
} 
/*ESTOQUE*/ 
.estoque-checkbox-scroll { 
  color: #000; 
  border-radius: 6px; 
  max-height: 100px; 
  overflow-y: auto; 
  padding: 0.5rem; 
  display: flex; 
  flex-direction: column; 
  gap: 0.3rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
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
  background: #FF9500; 
  border: none; 
  color: #000000;
  padding: 0.4rem 0.8rem; 
  border-radius: 20px;
  font-weight: bold; 
  cursor: pointer; 
} 
.btn-modal-salvar { 
  background: #64b5f6; 
  color: #000000; 
  border: none; 
  padding: 0.5rem 1rem; 
  border-radius: 20px; 
  font-weight: bold; 
  cursor: pointer; 
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

.category-groups{display:grid;gap:22px}.category-group{padding:18px 20px;border:1px solid #e8e7e4;border-radius:16px;background:#fff;box-shadow:0 4px 14px #1d23290a}.category-group>header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.category-group h3{margin:0;color:#343638;font-size:1.05rem}.category-group header p{margin:4px 0 0;color:#85898d;font-size:.78rem}.dish-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}.dish-mini-card{display:grid;gap:8px;min-height:96px;padding:14px;text-align:left;border:1px solid #e8e7e4;border-radius:12px;background:#fff;cursor:pointer;transition:transform .18s,box-shadow .18s}.dish-mini-card:hover{transform:translateY(-2px);box-shadow:0 7px 18px #1d232912}.dish-name{font-size:.9rem;font-weight:700;color:#383532}.dish-details{font-size:.82rem;color:#6f716f}.dish-status{justify-self:start;padding:4px 8px;border-radius:20px;background:#f4eee8;color:#8a593f;font-size:.68rem;font-weight:700}.dish-status.available{background:#eaf3eb;color:#49714e}.detail-category{display:inline-flex;align-self:flex-start;padding:7px 10px;border-radius:18px;background:#f5eee9;color:#81513d;font-size:.8rem;font-weight:700}
@media(max-width:600px){.category-group{padding:14px}.dish-grid{grid-template-columns:1fr 1fr}.dish-mini-card{padding:11px}}

/* Componentes limpos para ações e modais do cardápio */
.cardapio-page{color:#343638}.btn-adicionar{background:#f7f5f2;color:#4d5155;border:1px solid #e2e1de;border-radius:9px}.btn-adicionar:hover{background:#eee9e3;border-color:#d8c9bb}.dish-mini-card:focus-visible,.btn-adicionar:focus-visible,.acoes-detalhe button:focus-visible,.modal-actions button:focus-visible{outline:3px solid #d7b79c;outline-offset:2px}.modal-overlay{background:rgba(24,27,29,.48);backdrop-filter:blur(3px)}.modal-card,.modal-detalhe-prato{background:#fff;color:#373633;border:1px solid #ebe7e2;border-radius:16px;box-shadow:0 18px 48px #1517192b}.modal-card h3{color:#373633}.modal-card label{color:#55514d}.modal-form{gap:14px}.form-group{gap:5px}.form-group label{margin:0;font-size:.82rem;font-weight:650}.form-group input,.form-group select,.form-group textarea,.modal-card input,.estoque-checkbox-scroll{min-height:40px;border:1px solid #dedbd7;border-radius:8px;background:#fff;color:#363738;padding:9px 11px;font:inherit;font-size:.86rem}.form-group input:focus-visible,.form-group select:focus-visible,.form-group textarea:focus-visible{outline:3px solid #d7b79c;outline-offset:1px}.form-group input[type=checkbox]{min-height:auto;accent-color:#94745d}.preco-tag,.detail-category{background:#f4eee8;color:#76533e;border:1px solid #e9dfd5}.topo-detalhe-titulo{border-bottom-color:#eee8e2}.acoes-detalhe{justify-content:flex-end;flex-wrap:wrap;gap:8px}.acoes-detalhe button,.modal-actions button{min-height:38px;border:1px solid #dedbd7;border-radius:9px;background:#fff;color:#4d5155;padding:8px 12px;font:inherit;font-size:.82rem;font-weight:600;cursor:pointer;transition:background .18s,border-color .18s}.acoes-detalhe button:hover,.modal-actions button:hover{background:#f7f5f2;border-color:#d8c9bb}.acoes-detalhe .btn-deletar-prato{border-color:#ecd7d3;background:#fbf3f1;color:#9a4037}.acoes-detalhe .btn-deletar-prato:hover{background:#f5e5e1}.modal-actions{justify-content:flex-end}.modal-actions .btn-modal-salvar{border-color:#d9c8b6;background:#f4eee8;color:#624737}.modal-actions .btn-modal-salvar:hover{background:#eee3d8}.modal-actions .btn-modal-voltar{background:#fff;color:#555}.modal-actions button:disabled{opacity:.55;cursor:not-allowed}
:global(html.dark-mode) .cardapio-page{background:#1d2022;color:#eceae7}:global(html.dark-mode) .textos-topo h2,:global(html.dark-mode) .category-group h3,:global(html.dark-mode) .dish-name{color:#f0ece7}:global(html.dark-mode) .textos-topo p,:global(html.dark-mode) .category-group header p,:global(html.dark-mode) .dish-details{color:#b9b5b0}:global(html.dark-mode) .category-group,:global(html.dark-mode) .dish-mini-card,:global(html.dark-mode) .modal-card,:global(html.dark-mode) .modal-detalhe-prato{background:#262a2c;border-color:#393d3f;color:#eceae7;box-shadow:0 8px 28px #0003}:global(html.dark-mode) .dish-mini-card:hover{box-shadow:0 8px 24px #0005}:global(html.dark-mode) .dish-status{background:#393330;color:#e6cbb6}:global(html.dark-mode) .dish-status.available{background:#2d3d32;color:#b9d6bc}:global(html.dark-mode) .modal-card h3,:global(html.dark-mode) .modal-card label,:global(html.dark-mode) .topo-detalhe-titulo h4,:global(html.dark-mode) .modal-detalhe-prato h5,:global(html.dark-mode) .categoria-label,:global(html.dark-mode) .modo-fazer-container p{color:#eceae7}:global(html.dark-mode) .form-group input,:global(html.dark-mode) .form-group select,:global(html.dark-mode) .form-group textarea,:global(html.dark-mode) .modal-card input,:global(html.dark-mode) .estoque-checkbox-scroll{background:#1f2325;border-color:#484d4f;color:#f0eeeb}:global(html.dark-mode) .acoes-detalhe button,:global(html.dark-mode) .modal-actions button,:global(html.dark-mode) .btn-adicionar{background:#303537;border-color:#494e50;color:#f1efec}:global(html.dark-mode) .acoes-detalhe button:hover,:global(html.dark-mode) .modal-actions button:hover,:global(html.dark-mode) .btn-adicionar:hover{background:#3a4042}:global(html.dark-mode) .acoes-detalhe .btn-deletar-prato{background:#432d2a;border-color:#68413b;color:#f0b7ae}:global(html.dark-mode) .acoes-detalhe .btn-deletar-prato:hover{background:#543532}:global(html.dark-mode) .preco-tag,:global(html.dark-mode) .detail-category{background:#393330;border-color:#51443a;color:#e6cbb6}:global(html.dark-mode) .topo-detalhe-titulo{border-bottom-color:#414648}:global(html.dark-mode) .modal-overlay{background:#090b0ccc}
@media(max-width:600px){.acoes-detalhe{justify-content:stretch}.acoes-detalhe button{flex:1}.modal-card{padding:18px}}
.menu-feedback{margin:0 0 14px;padding:10px 12px;border:1px solid #e5ddd5;border-radius:9px;background:#faf7f3;color:#614d40;font-size:.84rem}.modal-feedback{margin:0;font-size:.82rem}.modal-feedback.error{color:#a33b32}.delete-copy{color:#635f5b;line-height:1.55}.btn-delete-confirm{min-height:38px;border:1px solid #ecd7d3;border-radius:9px;background:#fbf3f1;color:#9a4037;padding:8px 12px;font:inherit;font-size:.82rem;font-weight:650;cursor:pointer}.btn-delete-confirm:hover{background:#f5e5e1}.btn-delete-confirm:focus-visible{outline:3px solid #d7b79c;outline-offset:2px}.btn-delete-confirm:disabled{opacity:.55;cursor:wait}:global(html.dark-mode) .menu-feedback{background:#302b27;border-color:#4b413a;color:#e1cbb6}:global(html.dark-mode) .delete-copy{color:#c5bfba}:global(html.dark-mode) .modal-feedback.error{color:#efa49a}:global(html.dark-mode) .btn-delete-confirm{background:#432d2a;border-color:#68413b;color:#f0b7ae}:global(html.dark-mode) .btn-delete-confirm:hover{background:#543532}
</style>
