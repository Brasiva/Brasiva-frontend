<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">

        <div class="header-area">
          <div>
            <span class="section-label">Agenda</span>
            <h2 class="title">Eventos</h2>
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
            >
              <span class="material-symbols-outlined">
                close
              </span>
            </button>
          </div>
        </div>

        <div
          v-if="eventosFiltrados.length"
          class="cards-grid"
        >
          <div
            v-for="evento in eventosFiltrados"
            :key="evento.id"
            class="evento-card"
            @click="abrirDetalhes(evento)"
          >

            <div class="card-header">
              <div>
                <span class="card-id">
                  #{{ evento.id }}
                </span>

                <h3>{{ evento.tipo }}</h3>
              </div>

              <span
                class="status-dot"
                :style="{
                  backgroundColor:
                    appStore.getCorEvento(evento.tipo)
                }"
              ></span>
            </div>

            <div class="info-block">
              <small>Valor do orçamento</small>
              <strong>{{ evento.orcamento }}</strong>
            </div>

            <div class="info-block">
              <small>Cliente</small>
              <span>{{ evento.cliente }}</span>
            </div>

            <div class="info-row">
              <div class="info-block">
                <small>Pessoas</small>
                <span>{{ evento.pessoas }}</span>
              </div>

              <div class="info-block">
                <small>Data</small>
                <span>{{ formatarData(evento.dataHora) }}</span>
              </div>
            </div>

            <div class="info-block">
              <small>Data e hora</small>
              <span>{{ evento.dataHora }}</span>
            </div>

            <div class="info-block">
              <small>Endereço</small>
              <span>{{ evento.endereco }}</span>
            </div>

          </div>
        </div>

        <div v-else class="empty-state">
          <span class="material-symbols-outlined">
            event_busy
          </span>

          <p>
            {{
              dataFiltro
                ? 'Nenhum evento encontrado nessa data.'
                : 'Nenhum evento agendado ainda.'
            }}
          </p>
        </div>

      </div>

      <div
        v-if="eventoDetalhe"
        class="modal-overlay"
        @click.self="fecharDetalhes"
      >
        <div class="modal-content">

          <button
            class="close-btn"
            @click="fecharDetalhes"
          >
            <span class="material-symbols-outlined">
              close
            </span>
          </button>

          <div class="modal-title">
            <div
              class="modal-icon"
              :style="{
                backgroundColor:
                  appStore.getCorEvento(eventoDetalhe.tipo)
              }"
            >
              <span class="material-symbols-outlined">
                event
              </span>
            </div>

            <div>
              <span>#{{ eventoDetalhe.id }}</span>
              <h2>{{ eventoDetalhe.tipo }}</h2>
            </div>
          </div>

          <div class="grid-details">

            <div class="info-block">
              <small>Valor do orçamento</small>
              <strong>{{ eventoDetalhe.orcamento }}</strong>
            </div>

            <div class="info-block">
              <small>Cliente</small>
              <span>
                {{ eventoDetalhe.cliente }}
              </span>
            </div>

            <div class="info-block">
              <small>Número de pessoas</small>
              <span>{{ eventoDetalhe.pessoas }}</span>
            </div>

            <div class="info-block">
              <small>Data e hora</small>
              <span>{{ eventoDetalhe.dataHora }}</span>
            </div>

            <div class="info-block full">
              <small>Endereço</small>
              <span>{{ eventoDetalhe.endereco }}</span>
            </div>

          </div>

          <div class="lists-container">

            <div class="list-box">
              <h4>
                <span class="material-symbols-outlined">
                  restaurant_menu
                </span>
                Cardápio
              </h4>

              <ul>
                <li
                  v-for="(item, i) in eventoDetalhe.cardapio"
                  :key="i"
                >
                  <span class="material-symbols-outlined">
                    check
                  </span>
                  {{ item }}
                </li>
              </ul>
            </div>

            <div class="list-box">
              <h4>
                <span class="material-symbols-outlined">
                  groups
                </span>
                Funcionários
              </h4>

              <ul>
                <li
                  v-for="(func, i) in eventoDetalhe.funcionarios"
                  :key="i"
                >
                  <span class="material-symbols-outlined">
                    check
                  </span>
                  {{ func }}
                </li>
              </ul>
            </div>

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

const eventoDetalhe = ref(null)
const dataFiltro = ref('')

const eventosFiltrados = computed(() => {
  if (!dataFiltro.value) {
    return appStore.eventos
  }

  return appStore.eventos.filter(
    evento => evento.dataISO === dataFiltro.value
  )
})

function abrirDetalhes(evento) {
  eventoDetalhe.value = evento
}

function fecharDetalhes() {
  eventoDetalhe.value = null
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

.evento-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 17px;
  cursor: pointer;
  transition: .2s;
}

.evento-card:hover {
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
  width: 600px;
  max-width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.close-btn {
  position: absolute;
  right: 13px;
  top: 13px;
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

.lists-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.list-box {
  background: #fafafa;
  border-radius: 9px;
  padding: 12px;
}

.list-box h4 {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 8px;
  color: #555;
  font-size: .72rem;
}

.list-box h4 span {
  font-size: 17px;
}

.list-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-box li {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: .68rem;
  margin-bottom: 5px;
}

.list-box li span {
  font-size: 14px;
  color: #4f9b59;
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
    gap: 12px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .lists-container,
  .grid-details {
    grid-template-columns: 1fr;
  }

  .full {
    grid-column: span 1;
  }
}
</style>
