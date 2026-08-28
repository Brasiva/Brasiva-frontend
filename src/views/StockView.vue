<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">
        <div class="header-page">
          <div>
            <h2 class="title">Estoque</h2>
            <p class="subtitle">
              Controle os produtos e materiais disponíveis
            </p>
          </div>
          <div class="header-buttons">
            <button class="btn-compras" @click="mostrarListaCompras = true">
              <span class="material-symbols-outlined">shopping_cart</span>
              Lista de compras
            </button>

            <button class="btn-primary" @click="abrirNovoProduto">
              <span class="material-symbols-outlined">add</span>
              Adicionar produto
            </button>
            <ListaCompras :produtos="produtos" :mostrar="mostrarListaCompras" @fechar="mostrarListaCompras = false" />
          </div>
        </div>
        <div class="stock-summary">
          <div class="summary-card">
            <div class="summary-icon blue">
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <strong>{{ produtos.length }}</strong>
              <small>Produtos cadastrados</small>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon green">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <strong>{{ produtosDisponiveis }}</strong>
              <small>Em estoque</small>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon orange">
              <span class="material-symbols-outlined">warning</span>
            </div>
            <div>
              <strong>{{ produtosBaixos }}</strong>
              <small>Estoque baixo</small>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon red">
              <span class="material-symbols-outlined">error</span>
            </div>
            <div>
              <strong>{{ produtosEsgotados }}</strong>
              <small>Esgotados</small>
            </div>
          </div>
        </div>
        <div class="filters-card">
          <div class="search-box">
            <span class="material-symbols-outlined">search</span>
            <input v-model="pesquisa" type="text" placeholder="Pesquisar produto..." />
          </div>
          <select v-model="categoriaSelecionada">
            <option value="">Todas as categorias</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Materiais">Materiais</option>
            <option value="Descartáveis">Descartáveis</option>
          </select>
          <select v-model="statusSelecionado">
            <option value="">Todos os status</option>
            <option value="normal">Normal</option>
            <option value="baixo">Estoque baixo</option>
            <option value="esgotado">Esgotado</option>
          </select>
        </div>
        <div v-if="produtosFiltrados.length" class="products-grid">
          <div v-for="produto in produtosFiltrados" :key="produto.id" class="product-card">
            <div class="product-header">
              <div class="product-icon">
                <span class="material-symbols-outlined">
                  {{ produto.icone }}
                </span>
              </div>
              <div class="product-actions">
                <button class="icon-button" title="Editar" @click="editarProduto(produto)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="icon-button delete" title="Excluir" @click="excluirProduto(produto.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div class="product-info">
              <h3>{{ produto.nome }}</h3>
              <span class="category">
                {{ produto.categoria }}
              </span>
            </div>

            <div class="stock-info">
              <div>
                <small>Quantidade</small>
                <strong>{{ produto.quantidade }} {{ produto.unidade }}</strong>
              </div>
              <span class="status-badge" :class="getStatus(produto).classe">
                {{ getStatus(produto).texto }}
              </span>
            </div>

            <div class="stock-bar">
              <div class="stock-progress" :class="getStatus(produto).classe"
                :style="{ width: calcularPorcentagem(produto) + '%' }"></div>
            </div>

            <div class="product-footer">
              <span>Mínimo: {{ produto.minimo }} {{ produto.unidade }}</span>
              <strong>R$ {{ produto.valor.toFixed(2).replace('.', ',') }}</strong>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <span class="material-symbols-outlined">
            inventory
          </span>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente alterar os filtros ou cadastre um novo produto.</p>
        </div>
      </div>
    </div>
    <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-content">
        <button class="close-button" @click="fecharModal">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="modal-header">
          <div class="modal-icon">
            <span class="material-symbols-outlined">
              inventory_2
            </span>
          </div>
          <div>
            <h2>
              {{ modoEdicao ? 'Editar produto' : 'Novo produto' }}
            </h2>
            <p>Preencha as informações do produto.</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="input-group full">
            <label>Nome do produto</label>
            <input v-model="form.nome" type="text" placeholder="Ex.: Arroz" />
          </div>
          <div class="input-group">
            <label>Categoria</label>
            <select v-model="form.categoria">
              <option value="">Selecione</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Materiais">Materiais</option>
              <option value="Descartáveis">Descartáveis</option>
            </select>
          </div>
          <div class="input-group">
            <label>Unidade</label>
            <select v-model="form.unidade">
              <option value="un">Unidade</option>
              <option value="kg">Kg</option>
              <option value="L">Litro</option>
              <option value="cx">Caixa</option>
              <option value="pct">Pacote</option>
            </select>
          </div>
          <div class="input-group">
            <label>Quantidade</label>
            <input v-model.number="form.quantidade" type="number" min="0" />
          </div>
          <div class="input-group">
            <label>Quantidade mínima</label>
            <input v-model.number="form.minimo" type="number" min="0" />
          </div>
          <div class="input-group full">
            <label>Valor unitário</label>
            <input v-model.number="form.valor" type="number" min="0" step="0.01" placeholder="0,00" />
          </div>
        </div>
        <div class="modal-buttons">
          <button class="btn-secondary" @click="fecharModal">
            Cancelar
          </button>
          <button class="btn-primary" @click="salvarProduto">
            {{ modoEdicao ? 'Salvar alterações' : 'Cadastrar produto' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/appStore.js'
import ListaCompras from '@/components/ListaCompras.vue'

const appStore = useAppStore()

const pesquisa = ref('')
const categoriaSelecionada = ref('')
const statusSelecionado = ref('')
const mostrarModal = ref(false)
const modoEdicao = ref(false)
const mostrarListaCompras = ref(false)

const form = ref({
  id: null,
  nome: '',
  categoria: '',
  unidade: 'un',
  quantidade: 0,
  minimo: 0,
  valor: 0
})

const produtos = computed(() => appStore.produtos)

const produtosFiltrados = computed(() => {
  return produtos.value.filter(produto => {
    const correspondePesquisa =
      produto.nome
        .toLowerCase()
        .includes(pesquisa.value.toLowerCase())

    const correspondeCategoria =
      !categoriaSelecionada.value ||
      produto.categoria === categoriaSelecionada.value

    const correspondeStatus =
      !statusSelecionado.value ||
      getStatus(produto).classe === statusSelecionado.value

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeStatus
    )
  })
})

const produtosDisponiveis = computed(() => {
  return produtos.value.filter(
    produto => produto.quantidade > produto.minimo
  ).length
})

const produtosBaixos = computed(() => {
  return produtos.value.filter(
    produto =>
      produto.quantidade > 0 &&
      produto.quantidade <= produto.minimo
  ).length
})

const produtosEsgotados = computed(() => {
  return produtos.value.filter(
    produto => produto.quantidade === 0
  ).length
})

function getStatus(produto) {
  if (produto.quantidade === 0) {
    return {
      texto: 'Esgotado',
      classe: 'esgotado'
    }
  }

  if (produto.quantidade <= produto.minimo) {
    return {
      texto: 'Estoque baixo',
      classe: 'baixo'
    }
  }

  return {
    texto: 'Normal',
    classe: 'normal'
  }
}

function calcularPorcentagem(produto) {
  if (produto.quantidade === 0) {
    return 0
  }

  const referencia = Math.max(
    produto.minimo * 3,
    produto.quantidade
  )

  return Math.min(
    (produto.quantidade / referencia) * 100,
    100
  )
}

function abrirNovoProduto() {
  modoEdicao.value = false

  form.value = {
    id: null,
    nome: '',
    categoria: '',
    unidade: 'un',
    quantidade: 0,
    minimo: 0,
    valor: 0
  }

  mostrarModal.value = true
}

function editarProduto(produto) {
  modoEdicao.value = true
  form.value = { ...produto }

  mostrarModal.value = true
}

function salvarProduto() {
  if (!form.value.nome || !form.value.categoria) {
    return
  }

  if (modoEdicao.value) {
    appStore.atualizarProduto({
      ...form.value
    })
  } else {
    appStore.adicionarProduto({
      ...form.value
    })
  }

  fecharModal()
}

function excluirProduto(id) {
  if (!confirm('Deseja realmente excluir este produto?')) {
    return
  }

  appStore.excluirProduto(id)
}

function fecharModal() {
  mostrarModal.value = false
}
</script>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
}
.main-content {
  flex: 1;
  min-width: 0;
}
.page-body {
  padding: 20px 16px 40px;
}
.header-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}
.title {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
  font-weight: 700;
}
.subtitle {
  margin: 5px 0 0;
  color: #888;
  font-size: 0.85rem;
}
.btn-primary {
  border: none;
  background-color: #90caf9;
  color: #18344a;
  min-height: 42px;
  padding: 9px 16px;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: 0.2s;
}

.header-buttons {
  display: flex;
  gap: 10px;
}
.btn-compras {
  min-height: 42px;
  padding: 9px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  color: #555;
  font-family: 'Poppins', sans-serif;
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
}
.btn-compras:hover {
  background: #f7f7f7;
}
@media (max-width: 599px) {
  .header-buttons {
    flex-direction: column;
  }

  .btn-compras {
    width: 100%;
    justify-content: center;
  }
}

.btn-primary:hover {
  background-color: #64b5f6;
}

.btn-primary .material-symbols-outlined {
  font-size: 19px;
}
.stock-summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  padding: 15px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.summary-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-icon .material-symbols-outlined {
  font-size: 21px;
}
.summary-icon.blue {
  background-color: #e3f2fd;
  color: #1976d2;
}
.summary-icon.green {
  background-color: #e8f5e9;
  color: #43a047;
}
.summary-icon.orange {
  background-color: #fff3e0;
  color: #ef8c00;
}
.summary-icon.red {
  background-color: #ffebee;
  color: #e53935;
}
.summary-card strong {
  display: block;
  color: #333;
  font-size: 1.15rem;
}
.summary-card small {
  color: #888;
  font-size: 0.68rem;
}
/* FILTROS */

.filters-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 14px;
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f7f7f7;
  border-radius: 9px;
  padding: 0 12px;
}
.search-box .material-symbols-outlined {
  color: #999;
  font-size: 20px;
}
.search-box input {
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
}
.filters-card select {
  height: 40px;
  border: 1px solid #eee;
  border-radius: 9px;
  padding: 0 10px;
  background-color: #fff;
  color: #555;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
}

/* PRODUTOS */
.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}
.product-card {
  background-color: #fff;
  border-radius: 15px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background-color: #e3f2fd;
  color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-icon .material-symbols-outlined {
  font-size: 22px;
}
.product-actions {
  display: flex;
  gap: 5px;
}
.icon-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-button:hover {
  background-color: #e8e8e8;
}
.icon-button.delete {
  color: #d9534f;
}
.icon-button .material-symbols-outlined {
  font-size: 18px;
}
.product-info {
  margin: 13px 0;
}
.product-info h3 {
  margin: 0 0 4px;
  color: #333;
  font-size: 0.95rem;
  font-weight: 700;
}
.category {
  color: #999;
  font-size: 0.68rem;
}
.stock-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: #f8f8f8;
  padding: 9px 11px;
  border-radius: 9px;
}
.stock-info small {
  display: block;
  color: #999;
  font-size: 0.62rem;
}
.stock-info strong {
  color: #333;
  font-size: 0.82rem;
}
.status-badge {
  padding: 4px 7px;
  border-radius: 6px;
  font-size: 0.58rem;
  font-weight: 600;
}
.status-badge.normal {
  background-color: #e8f5e9;
  color: #388e3c;
}
.status-badge.baixo {
  background-color: #fff3e0;
  color: #ef8c00;
}
.status-badge.esgotado {
  background-color: #ffebee;
  color: #d32f2f;
}
.stock-bar {
  height: 5px;
  background-color: #eeeeee;
  border-radius: 10px;
  margin: 12px 0;
  overflow: hidden;
}
.stock-progress {
  height: 100%;
  border-radius: 10px;
}
.stock-progress.normal {
  background-color: #81c784;
}
.stock-progress.baixo {
  background-color: #ffb74d;
}
.stock-progress.esgotado {
  background-color: #e57373;
}
.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.product-footer span {
  color: #999;
  font-size: 0.65rem;
}
.product-footer strong {
  color: #333;
  font-size: 0.78rem;
}
/* ESTADO VAZIO */
.empty-state {
  background-color: #fff;
  border-radius: 15px;
  padding: 50px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.empty-state .material-symbols-outlined {
  color: #aaa;
  font-size: 45px;
}
.empty-state h3 {
  margin: 10px 0 5px;
  color: #444;
  font-size: 1rem;
}

.empty-state p {
  margin: 0;
  color: #999;
  font-size: 0.75rem;
}
/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}
/* MODAL */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

.close-button:hover {
  background-color: #e8e8e8;
  color: #444;
}

.close-button .material-symbols-outlined {
  font-size: 18px;
}

/* CABEÇALHO DO MODAL */

.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-right: 35px;
}

.modal-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 9px;
  background-color: #e3f2fd;
  color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon .material-symbols-outlined {
  font-size: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
}

.modal-header p {
  margin: 2px 0 0;
  color: #888;
  font-size: 0.65rem;
}

/* FORMULÁRIO */

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group.full {
  grid-column: 1 / -1;
}

.input-group label {
  color: #555;
  font-size: 0.68rem;
  font-weight: 600;
}

.input-group input,
.input-group select {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 9px;
  background-color: #fff;
  color: #333;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.72rem;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #90caf9;
  box-shadow: 0 0 0 3px rgba(144, 202, 249, 0.18);
}

/* BOTÕES DO MODAL */

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}

.btn-secondary {
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #555;
  font-family: 'Poppins', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-secondary:hover {
  background-color: #e4e4e4;
}

.modal-buttons .btn-primary {
  width: auto;
  min-height: 36px;
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 0.72rem;
}

.modal-buttons .btn-primary .material-symbols-outlined {
  font-size: 17px;
}
/* DESKTOP */

@media (min-width: 1024px) {
  .page-body {
    padding: 30px 40px 50px;
  }
  .stock-summary {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
  .summary-card {
    padding: 17px;
 }
}
/* DESKTOP GRANDE */
@media (min-width: 1300px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 599px) {
  .page-body {
    padding: 18px 14px 90px;
  }
  .header-page {
    gap: 12px;
    margin-bottom: 16px;
  }
  .title {
    font-size: 1.25rem;
  }
  .subtitle {
    font-size: 0.75rem;
  }
  .btn-primary {
    width: 100%;
    min-height: 40px;
  }
  .stock-summary {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .summary-card {
    padding: 11px;
    gap: 9px;
    min-width: 0;
  }
  .summary-icon {
    width: 35px;
    height: 35px;
    min-width: 35px;
  }
  .summary-icon .material-symbols-outlined {
    font-size: 18px;
  }
  .summary-card strong {
    font-size: 1rem;
  }
  .summary-card small {
    font-size: 0.58rem;
  }
  .filters-card {
    padding: 11px;
    margin-bottom: 16px;
  }
  .products-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 6px;
  }
  .product-card {
    padding: 14px;
    border-radius: 13px;
  }
  .product-info {
    margin: 10px 0;
  }
  .product-info h3 {
    font-size: 0.9rem;
  }
  .stock-info {
    padding: 8px 10px;
  }
  .product-footer span {
    font-size: 0.6rem;
  }
  .product-footer strong {
    font-size: 0.72rem;
  }
  .modal-content {
    width: calc(100% - 30px);
    padding: 18px;
    border-radius: 16px;
  }
}
</style>
