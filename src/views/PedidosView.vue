<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">

        <div class="header-area">
          <div>
            <span class="section-label">Gerenciamento</span>
            <h2 class="title">Pedidos disponíveis</h2>
          </div>

          <div class="date-filter">
            <span class="material-symbols-outlined">
              calendar_month
            </span>

            <input
              v-model="dataFiltro"
              type="date"
            />

            <button
              v-if="dataFiltro"
              class="clear-filter"
              @click="dataFiltro = ''"
              title="Limpar filtro"
            >
              <span class="material-symbols-outlined">
                close
              </span>
            </button>
          </div>
        </div>

        <div
          v-if="pedidosFiltrados.length"
          class="cards-grid"
        >
          <div
            v-for="pedido in pedidosFiltrados"
            :key="pedido.id"
            class="pedido-card"
          >
            <div class="card-header">
              <div>
                <span class="card-id">#{{ pedido.id }}</span>
                <h3>{{ pedido.tipo }}</h3>
              </div>

              <span
                class="status-dot"
                :style="{
                  backgroundColor: appStore.getCorEvento(pedido.tipo)
                }"
              ></span>
            </div>

            <div class="info-block">
              <small>Valor do orçamento</small>
              <strong>{{ pedido.orcamento }}</strong>
            </div>

            <div class="info-block">
              <small>Cliente</small>
              <span>{{ pedido.cliente }}</span>
            </div>

            <div class="info-row">
              <div class="info-block">
                <small>Pessoas</small>
                <span>{{ pedido.pessoas }}</span>
              </div>

              <div class="info-block">
                <small>Data</small>
                <span>{{ formatarData(pedido.dataHora) }}</span>
              </div>
            </div>

            <div class="info-block">
              <small>Data e hora</small>
              <span>{{ pedido.dataHora }}</span>
            </div>

            <button
              class="btn-acessar"
              @click="abrirModal(pedido)"
            >
              Acessar pedido
            </button>
          </div>
        </div>

        <div v-else class="empty-state">
          <span class="material-symbols-outlined">
            search_off
          </span>

          <p>
            {{
              dataFiltro
                ? 'Nenhum pedido encontrado nessa data.'
                : 'Nenhum pedido pendente no momento.'
            }}
          </p>
        </div>

      </div>

      <div
        v-if="pedidoSelecionado"
        class="modal-overlay"
        @click.self="fecharModal"
      >
        <div class="modal-content">

          <button
            class="close-btn"
            @click="fecharModal"
          >
            <span class="material-symbols-outlined">
              close
            </span>
          </button>

          <div class="modal-title">
            <div
              class="modal-icon"
              :style="{
                backgroundColor: appStore.getCorEvento(
                  pedidoSelecionado.tipo
                )
              }"
            >
              <span class="material-symbols-outlined">
                receipt_long
              </span>
            </div>

            <div>
              <span>#{{ pedidoSelecionado.id }}</span>
              <h2>{{ pedidoSelecionado.tipo }}</h2>
            </div>
          </div>

          <div class="grid-details">

            <div class="info-block">
              <small>Cliente</small>
              <span>{{ pedidoSelecionado.cliente }}</span>
            </div>

            <div class="info-block">
              <small>Valor</small>
              <strong>{{ pedidoSelecionado.orcamento }}</strong>
            </div>

            <div class="info-block">
              <small>Data e hora</small>
              <span>{{ pedidoSelecionado.dataHora }}</span>
            </div>

            <div class="info-block">
              <small>Pessoas</small>
              <span>{{ pedidoSelecionado.pessoas }}</span>
            </div>

            <div class="info-block full">
              <small>Endereço</small>
              <span>{{ pedidoSelecionado.endereco }}</span>
            </div>

          </div>

          <div class="modal-actions">
            <button
              class="btn-recusar"
              @click="recusarPedido"
            >
              Recusar
            </button>

            <button
              class="btn-aceitar"
              @click="aceitarPedido"
            >
              <span class="material-symbols-outlined">
                check
              </span>
              Aceitar pedido
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/appStore.js'

const appStore = useAppStore()

const pedidoSelecionado = ref(null)
const dataFiltro = ref('')

const pedidosFiltrados = computed(() => {
  if (!dataFiltro.value) {
    return appStore.pedidos
  }

  return appStore.pedidos.filter(
    pedido => pedido.dataISO === dataFiltro.value
  )
})

function abrirModal(pedido) {
  pedidoSelecionado.value = pedido
}

function fecharModal() {
  pedidoSelecionado.value = null
}

function recusarPedido() {
  if (!pedidoSelecionado.value) {
    return
  }

  appStore.recusarPedido(
    pedidoSelecionado.value.id
  )

  fecharModal()
}

function aceitarPedido() {
  if (!pedidoSelecionado.value) {
    return
  }

  appStore.aceitarPedido(
    pedidoSelecionado.value
  )

  fecharModal()
}

function formatarData(dataHora) {
  return dataHora?.split(' ')[0] || ''
}
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background: #f4f5f7;
  font-family: 'Poppins', sans-serif;
}

.main-content {
  min-height: 100vh;
}

.page-body {
  padding: 28px 35px;
  max-width: 1450px;
  margin: 0 auto;
}

.header-area {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 22px;
}

.section-label {
  color: #ff9500;
  font-size: .68rem;
  font-weight: 700;
  text-transform: uppercase;
}

.title {
  color: #333;
  font-size: 1.25rem;
  margin: 2px 0 0;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 9px;
  padding: 6px 9px;
}

.date-filter > span {
  font-size: 18px;
  color: #888;
}

.date-filter input {
  border: 0;
  outline: 0;
  color: #555;
  font-family: inherit;
  font-size: .72rem;
}

.clear-filter {
  border: 0;
  background: transparent;
  color: #999;
  cursor: pointer;
  display: flex;
}

.clear-filter span {
  font-size: 17px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.pedido-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 17px;
  transition: .2s;
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(0, 0, 0, .06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 13px;
}

.card-id {
  color: #999;
  font-size: .65rem;
}

.card-header h3 {
  color: #333;
  font-size: .92rem;
  margin: 1px 0 0;
}

.status-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.info-block {
  background: #fafafa;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 7px;
}

.info-block small {
  display: block;
  color: #999;
  font-size: .58rem;
  margin-bottom: 2px;
}

.info-block span,
.info-block strong {
  color: #444;
  font-size: .73rem;
}

.btn-acessar {
  width: 100%;
  border: 0;
  background: #333;
  color: #fff;
  border-radius: 8px;
  padding: 9px;
  margin-top: 5px;
  font-size: .7rem;
  font-weight: 600;
  cursor: pointer;
}

.empty-state {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 45px;
  text-align: center;
  color: #999;
}

.empty-state span {
  font-size: 32px;
  color: #ccc;
}

.empty-state p {
  font-size: .75rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  z-index: 2000;
}

.modal-content {
  position: relative;
  width: 450px;
  max-width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.close-btn {
  position: absolute;
  top: 13px;
  right: 13px;
  border: 0;
  background: #f5f5f5;
  width: 31px;
  height: 31px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn span {
  font-size: 18px;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 18px;
}

.modal-title > div:last-child > span {
  color: #999;
  font-size: .65rem;
}

.modal-title h2 {
  margin: 1px 0;
  color: #333;
  font-size: 1.1rem;
}

.modal-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon span {
  color: #555;
  font-size: 21px;
}

.grid-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.full {
  grid-column: span 2;
}

.modal-actions {
  display: flex;
  gap: 9px;
  margin-top: 17px;
}

.btn-recusar,
.btn-aceitar {
  flex: 1;
  border: 0;
  border-radius: 8px;
  padding: 10px;
  font-size: .7rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-recusar {
  background: #fff1f1;
  color: #c62828;
}

.btn-aceitar {
  background: #edf8ef;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn-aceitar span {
  font-size: 17px;
}

@media (max-width: 1050px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .page-body {
    padding: 20px 15px;
  }

  .header-area {
    align-items: flex-start;
    flex-direction: column;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
