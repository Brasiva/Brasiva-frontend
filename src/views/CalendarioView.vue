<template>
  <div class="page-layout">
    <div class="main-content">

      <div class="page-body">
        <div class="calendar-container">

          <div class="calendar-header">
            <div>
              <span class="year-label">2026</span>
              <h2 class="month-label">Julho</h2>
            </div>
          </div>

          <!-- Dias da semana -->
          <div class="weekdays-grid">
            <span v-for="dia in diasSemana" :key="dia">{{ dia }}</span>
          </div>

          <!-- Dias de Julho -->
          <div class="days-grid">
            <div
              v-for="dia in 31"
              :key="dia"
              class="day-cell"
              @click="abrirModalDia(dia)"
            >
              <span class="day-number">{{ dia }}</span>

              <!-- Exibe as pílulas coloridas dos eventos confirmados naquele dia -->
              <div class="mini-events-list">
                <div
                  v-for="ev in getEventosDoDia(dia)"
                  :key="ev.id"
                  class="mini-event-bar"
                  :style="{ backgroundColor: appStore.getCorEvento(ev.tipo) }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Legenda -->
          <div class="legend-box">
            <h4>Legenda</h4>
            <div class="legend-items">
              <div class="legend-item"><span class="dot" style="background-color: #90caf9"></span> Aniversário</div>
              <div class="legend-item"><span class="dot" style="background-color: #f8bbd0"></span> Casamento</div>
              <div class="legend-item"><span class="dot" style="background-color: #c8e6c9"></span> Corporativo</div>
              <div class="legend-item"><span class="dot" style="background-color: #e0e0e0"></span> Formatura</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Modal ao clicar no dia -->
      <div v-if="diaSelecionado" class="modal-overlay" @click.self="diaSelecionado = null">
        <div class="modal-content">
          <button class="close-btn" @click="diaSelecionado = null">✕</button>

          <h3 class="modal-title">Eventos do dia</h3>
          <p class="modal-date">{{ String(diaSelecionado).padStart(2, '0') }}/07/2026</p>

          <div v-if="getEventosDoDia(diaSelecionado).length > 0" class="modal-events-list">
            <div
              v-for="ev in getEventosDoDia(diaSelecionado)"
              :key="ev.id"
              class="event-pill-item"
              :style="{ backgroundColor: appStore.getCorEvento(ev.tipo) }"
              @click="$router.push('/eventos')"
            >
              <span>{{ ev.tipo }} {{ ev.hora }}</span>
            </div>
          </div>

          <div v-else class="no-events">
            Nenhum evento neste dia.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/appStore.js';

const appStore = useAppStore();
const diaSelecionado = ref(null);
const diasSemana = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

function getEventosDoDia(dia) {
  const diaPadded = String(dia).padStart(2, '0');
  const dataAlvo = `2026-07-${diaPadded}`;
  return appStore.eventos.filter(e => e.dataISO === dataAlvo);
}

function abrirModalDia(dia) {
  diaSelecionado.value = dia;
}
</script>

<style scoped>
.page-layout { display: flex; min-height: 100vh; background: #eef0f2; font-family: 'Poppins', sans-serif; }
.main-content { flex: 1; padding: 20px 40px; }

.calendar-container { background: #fff; border-radius: 20px; padding: 25px; }
.year-label { font-size: 1.1rem; color: #aaa; font-weight: 600; }
.month-label { font-size: 1.8rem; margin: 0; color: #111; font-weight: 800; }

.weekdays-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; font-size: 0.75rem; color: #333; margin: 15px 0 10px 0; }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }

.day-cell { background: #fafafa; border-radius: 12px; min-height: 75px; padding: 8px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #f0f0f0; }
.day-cell:hover { background: #f0f4f8; }
.day-number { font-size: 0.85rem; font-weight: 700; color: #333; }

.mini-events-list { display: flex; flex-direction: column; gap: 3px; }
.mini-event-bar { height: 6px; border-radius: 3px; width: 100%; }

.legend-box { margin-top: 25px; background: #f9f9f9; padding: 15px; border-radius: 12px; width: fit-content; }
.legend-box h4 { margin: 0 0 8px 0; font-size: 0.8rem; color: #666; }
.legend-items { display: flex; gap: 15px; font-size: 0.8rem; color: #333; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #fff; width: 320px; border-radius: 16px; padding: 20px; position: relative; text-align: center; }
.close-btn { position: absolute; right: 15px; top: 15px; border: none; background: transparent; cursor: pointer; font-size: 16px; }
.modal-title { font-size: 1.1rem; margin: 0; font-weight: 700; color: #333; }
.modal-date { font-size: 0.85rem; color: #ff8a00; font-weight: 700; margin: 4px 0 15px 0; }

.modal-events-list { display: flex; flex-direction: column; gap: 10px; }
.event-pill-item { padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; color: #333; cursor: pointer; text-align: left; }
.no-events { font-size: 0.85rem; color: #888; padding: 10px 0; }
</style>
