<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">

        <section class="welcome-card">
          <div>
            <span class="welcome-label">Bem-vindo ao BRASIVA</span>
            <h1>Olá, {{ nomeUsuario }}!</h1>
            <p>Confira o resumo do gerenciamento do seu negócio.</p>
          </div>

          <span class="material-symbols-outlined welcome-icon">
            dashboard
          </span>
        </section>

        <section class="metrics-grid">

          <div class="metric-card">
            <div class="metric-icon orange">
              <span class="material-symbols-outlined">
                inventory_2
              </span>
            </div>

            <div class="metric-content">
              <small>Estoque baixo</small>
              <strong>{{ appStore.itensEstoqueBaixo }}</strong>
              <span>itens precisam de atenção</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon blue">
              <span class="material-symbols-outlined">
                shopping_cart
              </span>
            </div>

            <div class="metric-content">
              <small>Pedidos pendentes</small>
              <strong>{{ appStore.pedidosPendentes }}</strong>
              <span>pedidos aguardando aceite</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon green">
              <span class="material-symbols-outlined">
                event
              </span>
            </div>

            <div class="metric-content">
              <small>Eventos</small>
              <strong>{{ appStore.eventosAgendados }}</strong>
              <span>eventos agendados</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon purple">
              <span class="material-symbols-outlined">
                groups
              </span>
            </div>

            <div class="metric-content">
              <small>Funcionários</small>
              <strong>{{ totalFuncionarios }}</strong>
              <span>funcionários cadastrados</span>
            </div>
          </div>

        </section>

        <section class="home-section">
          <div class="section-header">
            <div>
              <span class="section-label">Pedidos</span>
              <h2>Pedidos disponíveis</h2>
            </div>

            <button class="view-button" @click="$router.push('/pedidos')">
              Ver todos
              <span class="material-symbols-outlined">
                arrow_forward
              </span>
            </button>
          </div>

          <div v-if="pedidosRecentes.length" class="cards-grid">
            <div
              v-for="pedido in pedidosRecentes"
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
                <small>Valor do orçamento</small>
                <strong>{{ pedido.orcamento }}</strong>
              </div>

              <button
                class="card-button"
                @click="$router.push('/pedidos')"
              >
                Acessar pedido
              </button>
            </div>
          </div>

          <div v-else class="empty-state">
            <span class="material-symbols-outlined">
              shopping_cart
            </span>
            <p>Nenhum pedido pendente.</p>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore.js'
import { useFuncionarioStore } from '@/stores/funcionarios'

const appStore = useAppStore()
const funcionarioStore = useFuncionarioStore()

const nomeUsuario = computed(() => {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || '{}'
    )

    return (
      usuario.nome ||
      usuario.first_name ||
      usuario.username ||
      'usuário'
    )
  } catch {
    return 'usuário'
  }
})

const pedidosRecentes = computed(() => {
  return appStore.pedidos.slice(0, 3)
})

const totalFuncionarios = computed(() => {
  return funcionarioStore.funcionarios?.length || 0
})

onMounted(async () => {
  await funcionarioStore.buscarFuncionarios()
})

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

.welcome-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  border: 1px solid #eee;
}

.welcome-label {
  font-size: .72rem;
  color: #ff9500;
  font-weight: 700;
  text-transform: uppercase;
}

.welcome-card h1 {
  margin: 4px 0;
  font-size: 1.45rem;
  color: #333;
}

.welcome-card p {
  margin: 0;
  color: #888;
  font-size: .78rem;
}

.welcome-icon {
  font-size: 42px;
  color: #ff9500;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.metric-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 17px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.metric-icon {
  width: 43px;
  height: 43px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon.orange {
  background: #fff1df;
  color: #ff9500;
}

.metric-icon.blue {
  background: #eaf4ff;
  color: #4689c8;
}

.metric-icon.green {
  background: #edf8ef;
  color: #4f9b59;
}

.metric-icon.purple {
  background: #f2edff;
  color: #8064c7;
}

.metric-icon span {
  font-size: 22px;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-content small {
  color: #888;
  font-size: .68rem;
}

.metric-content strong {
  color: #333;
  font-size: 1.25rem;
}

.metric-content span {
  color: #aaa;
  font-size: .62rem;
}

.home-section {
  background: transparent;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-label {
  color: #ff9500;
  font-size: .68rem;
  font-weight: 700;
  text-transform: uppercase;
}

.section-header h2 {
  margin: 2px 0 0;
  color: #333;
  font-size: 1.15rem;
}

.view-button {
  border: 0;
  background: transparent;
  color: #ff9500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: .72rem;
  font-weight: 600;
}

.view-button span {
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
  font-size: .65rem;
  color: #999;
}

.card-header h3 {
  margin: 1px 0 0;
  font-size: .92rem;
  color: #333;
}

.status-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.info-block {
  background: #fafafa;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 7px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
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

.card-button {
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
  padding: 40px;
  text-align: center;
  color: #999;
}

.empty-state span {
  font-size: 30px;
  color: #ccc;
}

.empty-state p {
  font-size: .75rem;
}

@media (max-width: 1100px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .page-body {
    padding: 20px 15px;
  }

  .metrics-grid,
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .welcome-card {
    padding: 18px;
  }

  .welcome-icon {
    display: none;
  }
}
</style>
