<template>
  <div class="page-layout">
    <div class="main-content">
      <Header v-if="temHeader" />

      <div class="page-body">
        <h2 class="title">Pedidos disponíveis</h2>

        <!-- Lista de pedidos -->
        <div v-if="pedidos.length > 0" class="cards-grid">
          <div
            v-for="pedido in pedidos"
            :key="pedido.id"
            class="pedido-card"
          >
            <div class="card-header">
              <h3>#{{ pedido.id }} - {{ pedido.tipo }}</h3>
              <span class="status-badge"></span>
            </div>

            <div class="info-block">
              <small>Valor do orçamento</small>
              <strong>{{ pedido.orcamento }}</strong>
            </div>

            <div class="info-block">
              <small>Cliente</small>
              <span>{{ pedido.cliente }}</span>
            </div>

            <div class="info-block">
              <small>Número de pessoas</small>
              <span>{{ pedido.pessoas }}</span>
            </div>

            <div class="info-block">
              <small>Data e hora</small>
              <span>{{ pedido.dataHora }}</span>
            </div>

            <button class="btn-acessar" @click="abrirModal(pedido)">
              Acessar Pedido
            </button>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Nenhum pedido pendente no momento.</p>
        </div>
      </div>

      <!-- Modal de detalhe/aceite de pedido -->
      <div v-if="pedidoSelecionado" class="modal-overlay" @click.self="pedidoSelecionado = null">
        <div class="modal-content">
          <button class="close-btn" @click="pedidoSelecionado = null">✕</button>

          <h2>#{{ pedidoSelecionado.id }} - {{ pedidoSelecionado.tipo }}</h2>

          <div class="grid-details">
            <div class="info-block"><small>Cliente</small><span>{{ pedidoSelecionado.cliente }}</span></div>
            <div class="info-block"><small>Valor</small><strong>{{ pedidoSelecionado.orcamento }}</strong></div>
            <div class="info-block"><small>Data/Hora</small><span>{{ pedidoSelecionado.dataHora }}</span></div>
            <div class="info-block"><small>Pessoas</small><span>{{ pedidoSelecionado.pessoas }}</span></div>
          </div>

          <div class="modal-actions">
            <button class="btn-recusar" @click="recusarPedido(pedidoSelecionado.id)">Recusar</button>
            <button class="btn-aceitar" @click="aceitarPedido(pedidoSelecionado)">Aceitar Pedido</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pedidos = ref([
  {
    id: '0001',
    tipo: 'Casamento',
    orcamento: 'R$ 22.023,10',
    cliente: 'Giovana Rosa',
    pessoas: 50,
    dataHora: '28/07/2026 19:00 - 20:00',
    endereco: 'Rua das Bobs, 0 - Centro - Joinville, SC'
  },
  {
    id: '0002',
    tipo: 'Aniversário',
    orcamento: 'R$ 5.400,00',
    cliente: 'Carlos Eduardo',
    pessoas: 30,
    dataHora: '17/07/2026 18:00',
    endereco: 'Av. Brasil, 1500 - Joinville, SC'
  }
]);

const pedidoSelecionado = ref(null);

function abrirModal(pedido) {
  pedidoSelecionado.value = pedido;
}

function recusarPedido(id) {
  pedidos.value = pedidos.value.filter(p => p.id !== id);
  pedidoSelecionado.value = null;
}

function aceitarPedido(pedido) {
  pedidos.value = pedidos.value.filter(p => p.id !== pedido.id);
  pedidoSelecionado.value = null;
  alert('Pedido aceito com sucesso! Ele foi movido para os Eventos.');
}
</script>

<style scoped>
.page-layout { display: flex; min-height: 100vh; background-color: #f4f5f7; font-family: 'Poppins', sans-serif; }
.main-content { flex: 1; display: flex; flex-direction: column; }
.page-body { padding: 20px 30px; }
.title { font-size: 1.4rem; font-weight: 700; color: #333; margin-bottom: 20px; }

.cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.pedido-card { background: #ffffff; padding: 20px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-header h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
.status-badge { width: 12px; height: 12px; border-radius: 50%; background: #f8bbd0; }

.info-block { background: #f9f9f9; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; }
.info-block small { display: block; color: #888; font-size: 10px; }
.info-block span, .info-block strong { font-size: 0.85rem; color: #333; }

.btn-acessar { width: 100%; background: #333; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 10px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #ffffff; padding: 25px; border-radius: 16px; width: 450px; max-width: 90%; position: relative; }
.close-btn { position: absolute; right: 15px; top: 15px; border: none; background: transparent; cursor: pointer; font-size: 16px; }

.grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
.modal-actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-recusar { flex: 1; background: #ffebee; color: #c62828; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-aceitar { flex: 1; background: #e8f5e9; color: #2e7d32; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; }

@media (max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .cards-grid { grid-template-columns: 1fr; } }
</style>
