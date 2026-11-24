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
          <div class="form-group"><label><input v-model="formPrato.disponivel" type="checkbox"> Disponibilizar no site p?blico</label></div>
          <div class="form-group"><label>Unidade de venda:</label><input v-model="formPrato.unidade" required maxlength="30" placeholder="Ex.: kg, cento (100 unidades)"></div>
          <!-- MODO DE FAZER -->
          <div class="form-group">
            <label> Modo de Fazer / Descrição: </label>
            <textarea v-model="formPrato.modoFazer" rows="3" placeholder="Insira o passo a passo da receita..." ></textarea>
          </div>
          <!-- BOTÕES -->
          <div class="modal-actions">
            <button type="button" @click="exibirModal = false" class="btn-modal-voltar" > Voltar </button>
            <button type="submit" class="btn-modal-salvar">{{ formPrato.id ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRATO' }}</button>
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
  }
  catch { alert('Não foi possível salvar o prato. Verifique a conexão e os dados.') }
};

const abrirEdicao = (prato) => {
  formPrato.value = { id: prato.id, nome: prato.nome, preco: prato.preco, categoria: prato.categoria, modoFazer: prato.modoFazer, unidade: prato.unidade, disponivel: prato.disponivel, sob_orcamento: prato.sob_orcamento, ingredientesSelecionados: [] }
  pratoSelecionadoId.value = null
  exibirModal.value = true
}

const alternarDisponibilidade = async (prato) => {
  try { await cardapioStore.atualizarPrato({ ...prato, disponivel: !prato.disponivel }); pratoSelecionadoId.value = prato.id }
  catch { alert('Não foi possível atualizar a disponibilidade.') }
}

const criarCategoria = async () => {
  const nome = prompt('Nome da nova categoria:')?.trim();
  if (!nome) return;
  try { await cardapioStore.adicionarCategoria(nome) }
  catch { alert('Não foi possível criar a categoria.') }
};

// DELETAR PRATO

const deletarPrato = async (id) => {
  if (confirm('Tem certeza que deseja remover este prato?')) {
    try { await cardapioStore.removerPrato(id); pratoSelecionadoId.value = null }
    catch { alert('Não foi possível excluir o prato.') }
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
</style>
