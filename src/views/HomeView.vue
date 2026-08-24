<template>
  <div class="page-layout">
    <div class="main-content">

      <Header />

      <div class="page-body">

        <!-- Banner Dinâmico com dados do Usuário e Data Atual -->
        <div class="welcome-banner">
          <h2>Bem vindo novamente, {{ authStore.usuario?.name || 'Usuário' }}</h2>
          <p>{{ dataFormatada }}</p>
        </div>

        <!-- 4 Cards de Métricas -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📅</div>
            <div class="metric-value orange-text">{{ appStore.eventos.length }}</div>
            <div class="metric-label">Eventos esse mês</div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">📦</div>
            <div class="metric-value orange-text">32</div>
            <div class="metric-label">Itens em estoque</div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-value orange-text">12</div>
            <div class="metric-label">Funcionários</div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-value orange-text">R$ 8.450</div>
            <div class="metric-label">Saldo do mês</div>
          </div>
        </div>

        <!-- Seção de Pedidos Disponíveis -->
        <div class="section-header">
          <h3>Pedidos disponíveis</h3>
          <div class="actions">
            <button class="btn-orange" @click="$router.push('/pedidos')">Ver todos</button>
            <button class="btn-filter">Filtrar ∧</button>
          </div>
        </div>

        <!-- Grid de Cards de Pedidos sem cor pastel -->
        <div class="pedidos-grid">
          <div v-for="pedido in appStore.pedidos" :key="pedido.id" class="pedido-card">

            <div class="client-header">
              <img :src="pedido.fotoCliente" class="client-avatar" alt="Avatar Cliente" />
              <div>
                <strong>{{ pedido.cliente }}</strong>
                <small>{{ pedido.dataPedido }}</small>
              </div>
            </div>

            <div class="info-box full">
              <small>$ Valor do orçamento</small>
              <strong>{{ pedido.orcamento }}</strong>
            </div>

            <div class="info-row">
              <div class="info-box">
                <small>✓ Tipo</small>
                <span>{{ pedido.tipo }}</span>
              </div>
              <div class="info-box">
                <small>🕒 Data e hora</small>
                <span>{{ pedido.dataHora }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-box">
                <small>👥 Número de pessoas</small>
                <span>{{ pedido.pessoas }}</span>
              </div>
              <div class="info-box">
                <small>📍 Endereço</small>
                <span>{{ pedido.endereco }}</span>
              </div>
            </div>

            <button class="btn-acessar" @click="$router.push('/pedidos')">
              Acessar Pedido ➔
            </button>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/appStore.js';
import { useAuthStore } from "@/stores/auth.js";
import Header from '@/components/Header.vue';

const appStore = useAppStore();
const authStore = useAuthStore();

// Formata a data atual em português (ex: quinta-feira, 16 de julho de 2026)
const dataFormatada = computed(() => {
  const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('pt-BR', opcoes);
});
</script>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-body {
  padding: 20px 16px 40px;
}

/* ================= BANNER ================= */

.welcome-banner {
  width: 100%;
  min-height: 140px;
  padding: 24px;
  margin-bottom: 20px;
  border-radius: 15px;
  background: #c2c5c8;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.welcome-banner h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
}

.welcome-banner p {
  margin: 6px 0 0;
  font-size: 0.8rem;
  opacity: 0.9;
  text-transform: capitalize;
}

/* ================= MÉTRICAS ================= */

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 25px;
}

.metric-card {
  background-color: #fff;
  padding: 18px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metric-icon {
  width: 38px;
  height: 38px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #fff3e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff8a00;
  line-height: 1.2;
}

.metric-label {
  margin-top: 5px;
  color: #888;
  font-size: 0.75rem;
  font-weight: 500;
}

/* ================= SEÇÃO PEDIDOS ================= */

.section-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 700;
}

.actions {
  width: 100%;
  display: flex;
  gap: 8px;
}

.btn-orange,
.btn-filter {
  flex: 1;
  min-height: 36px;
  border-radius: 9px;
  padding: 7px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-orange {
  border: none;
  background-color: #ff8a00;
  color: #fff;
}

.btn-orange:hover {
  background-color: #e87d00;
}

.btn-filter {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  color: #666;
}

.btn-filter:hover {
  background-color: #f8f8f8;
}

/* ================= PEDIDOS ================= */

.pedidos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.pedido-card {
  background-color: #fff;
  padding: 16px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ================= CLIENTE ================= */

.client-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f1f1f1;
}

.client-header strong {
  display: block;
  color: #333;
  font-size: 0.85rem;
  font-weight: 600;
}

.client-header small {
  display: block;
  margin-top: 2px;
  color: #999;
  font-size: 0.68rem;
}

/* ================= INFORMAÇÕES ================= */

.info-box {
  flex: 1;
  min-width: 0;
  padding: 9px 11px;
  border-radius: 9px;
  background-color: #f9f9f9;
}

.info-box.full {
  margin-bottom: 8px;
}

.info-box small {
  display: block;
  margin-bottom: 3px;
  color: #999;
  font-size: 0.65rem;
}

.info-box span,
.info-box strong {
  display: block;
  color: #333;
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

/* ================= BOTÃO ACESSAR ================= */

.btn-acessar {
  width: 100%;
  min-height: 38px;
  margin-top: 5px;
  padding: 9px 12px;
  border: none;
  border-radius: 9px;
  background-color: #ff8a00;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-acessar:hover {
  background-color: #e87d00;
}

/* ================= TABLET ================= */

@media (min-width: 600px) {
  .page-body {
    padding: 25px 30px 40px;
  }

  .welcome-banner {
    min-height: 150px;
    padding: 28px;
  }

  .welcome-banner h2 {
    font-size: 1.4rem;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .section-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .actions {
    width: auto;
  }

  .btn-orange,
  .btn-filter {
    flex: none;
    min-width: 90px;
  }

  .pedidos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
}

/* ================= DESKTOP ================= */

@media (min-width: 768px) {
  .page-body {
    padding: 30px;
  }

  .welcome-banner {
    min-height: 160px;
    padding: 30px;
  }

  .welcome-banner h2 {
    font-size: 1.5rem;
  }

  .welcome-banner p {
    font-size: 0.85rem;
  }

  .metric-card {
    padding: 20px;
  }

  .metric-value {
    font-size: 1.7rem;
  }

  .pedidos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* ================= DESKTOP GRANDE ================= */

@media (min-width: 1024px) {
  .page-body {
    padding: 30px 40px;
  }

  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .pedidos-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .welcome-banner {
    min-height: 150px;
  }

  .welcome-banner h2 {
    font-size: 1.6rem;
  }
}
</style>
