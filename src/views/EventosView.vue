<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">
        <div class="header-filters">
          <h2 class="title">Eventos do dia</h2>
          <div class="date-picker-mock">
            <span>Data ∧</span>
            <strong>17/07/2026</strong>
          </div>
        </div>

        <div v-if="eventos.length > 0" class="cards-grid">
          <div
            v-for="evento in eventos"
            :key="evento.id"
            class="evento-card"
            @click="abrirDetalhes(evento)"
          >
            <div class="card-header">
              <h3>#{{ evento.id }} - {{ evento.tipo }}</h3>
              <span class="status-badge" :style="{ backgroundColor: getCorEvento(evento.tipo) }"></span>
            </div>

            <div class="info-block"><small>Valor do orçamento</small><strong>{{ evento.orcamento }}</strong></div>
            <div class="info-block"><small>Cliente</small><span>{{ evento.cliente }}</span></div>
            <div class="info-block"><small>Número de pessoas</small><span>{{ evento.pessoas }}</span></div>
            <div class="info-block"><small>Data e hora</small><span>{{ evento.dataHora }}</span></div>
            <div class="info-block"><small>Endereço</small><span>{{ evento.endereco }}</span></div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Nenhum evento agendado ainda.</p>
        </div>
      </div>

      <!-- Modal de Detalhes -->
      <div v-if="eventoDetalhe" class="modal-overlay" @click.self="eventoDetalhe = null">
        <div class="modal-content">
          <button class="close-btn" @click="eventoDetalhe = null">✕</button>

          <div class="modal-header">
            <span class="status-badge large" :style="{ backgroundColor: getCorEvento(eventoDetalhe.tipo) }"></span>
            <h2>#{{ eventoDetalhe.id }} - {{ eventoDetalhe.tipo }}</h2>
          </div>

          <div class="grid-details">
            <div class="info-block"><small>Valor do orçamento</small><strong>{{ eventoDetalhe.orcamento }}</strong></div>
            <div class="info-block"><small>Cliente</small><span>{{ eventoDetalhe.cliente }} - {{ eventoDetalhe.contato }}</span></div>
            <div class="info-block"><small>Número de pessoas</small><span>{{ eventoDetalhe.pessoas }}</span></div>
            <div class="info-block"><small>Data e hora</small><span>{{ eventoDetalhe.dataHora }}</span></div>
            <div class="info-block full-width"><small>Endereço</small><span>{{ eventoDetalhe.endereco }}</span></div>
          </div>

          <div class="lists-container">
            <div class="list-box">
              <h4>Cardápio</h4>
              <ul><li v-for="(item, i) in eventoDetalhe.cardapio" :key="i">✓ {{ item }}</li></ul>
            </div>
            <div class="list-box">
              <h4>Funcionários</h4>
              <ul><li v-for="(func, i) in eventoDetalhe.funcionarios" :key="i">✓ {{ func }}</li></ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const eventos = ref([
  {
    id: '0001',
    tipo: 'Aniversário',
    orcamento: 'R$ 12.000,00',
    cliente: 'Giovana Rosa',
    contato: '(47) 9999-9999',
    pessoas: 40,
    dataHora: '17/07/2026 19:00',
    endereco: 'Rua Central, 120 - Joinville, SC',
    cardapio: ['0.5kg Salmão Grelhado', '2kg Picanha'],
    funcionarios: ['Thayná - Cozinheira']
  },
  {
    id: '0002',
    tipo: 'Casamento',
    orcamento: 'R$ 25.500,00',
    cliente: 'Mariana Lima',
    contato: '(47) 9888-8888',
    pessoas: 100,
    dataHora: '17/07/2026 17:00',
    endereco: 'Estrada Das Flores, 50 - Joinville, SC',
    cardapio: ['Buffet Completo', 'Mesa de Doces'],
    funcionarios: ['Luiza - Cozinheira', 'Thayná - Cozinheira']
  },
  {
    id: '0003',
    tipo: 'Corporativo',
    orcamento: 'R$ 8.200,00',
    cliente: 'Empresa Tech',
    contato: '(47) 3434-0000',
    pessoas: 30,
    dataHora: '17/07/2026 21:00',
    endereco: 'Rua Blumenau, 300 - Joinville, SC',
    cardapio: ['Finger Foods', 'Drinks'],
    funcionarios: ['Carlos - Garçom']
  },
  {
    id: '0004',
    tipo: 'Formatura',
    orcamento: 'R$ 18.000,00',
    cliente: 'Comissão Formatura',
    contato: '(47) 9777-7777',
    pessoas: 80,
    dataHora: '17/07/2026 22:00',
    endereco: 'Rua XV de Novembro, 1000 - Joinville, SC',
    cardapio: ['Jantar Completo'],
    funcionarios: ['Equipe Completa']
  }
]);

const eventoDetalhe = ref(null);

function getCorEvento(tipo) {
  const tp = tipo?.toLowerCase() || '';
  if (tp.includes('aniversário') || tp.includes('aniversario')) return '#90caf9'; // Azul
  if (tp.includes('casamento')) return '#f8bbd0'; // Rosa
  if (tp.includes('corporativo')) return '#c8e6c9'; // Verde
  return '#e0e0e0'; // Formatura/Outro: Cinza
}

function abrirDetalhes(evento) {
  eventoDetalhe.value = evento;
}
</script>

<style scoped>
.page-layout { display: flex; min-height: 100vh; background-color: #f4f5f7; font-family: 'Poppins', sans-serif; }
.main-content { flex: 1; display: flex; flex-direction: column; }
.page-body { padding: 20px 30px; }
.header-filters { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.title { font-size: 1.4rem; font-weight: 700; color: #333; }
.date-picker-mock { background: #fff; padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; display: flex; gap: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }

.cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.evento-card { background: #ffffff; padding: 20px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-header h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
.status-badge { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
.status-badge.large { width: 18px; height: 18px; }

.info-block { background: #f9f9f9; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; }
.info-block small { display: block; color: #888; font-size: 10px; }
.info-block span, .info-block strong { font-size: 0.85rem; color: #333; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #ffffff; padding: 30px; border-radius: 20px; width: 600px; max-width: 90%; position: relative; }
.modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.close-btn { position: absolute; right: 20px; top: 20px; border: none; background: transparent; cursor: pointer; font-size: 18px; }

.grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
.full-width { grid-column: span 2; }
.lists-container { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.list-box { background: #f9f9f9; padding: 12px; border-radius: 10px; }
.list-box h4 { font-size: 0.85rem; margin-bottom: 8px; color: #555; }
.list-box ul { list-style: none; padding: 0; margin: 0; font-size: 0.8rem; }

@media (max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .cards-grid { grid-template-columns: 1fr; } .grid-details, .lists-container { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
</style>
