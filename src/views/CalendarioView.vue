<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">

        <div class="calendar-container">

          <div class="calendar-header">

            <div class="month-title">
              <span>{{ ano }}</span>
              <h2>{{ meses[mes] }}</h2>
            </div>

            <div class="calendar-actions">
              <button @click="hoje">
                Hoje
              </button>

              <button @click="anterior">
                <span class="material-symbols-outlined">
                  chevron_left
                </span>
              </button>

              <button @click="proximo">
                <span class="material-symbols-outlined">
                  chevron_right
                </span>
              </button>
            </div>

          </div>

          <div class="weekdays-grid">
            <span
              v-for="dia in semana"
              :key="dia"
            >
              {{ dia }}
            </span>
          </div>

          <div class="days-grid">

            <div
              v-for="(dia, i) in dias"
              :key="i"
              class="day-cell"
              :class="{
                today:
                  dia === hojeNumero &&
                  mes === hojeMes &&
                  ano === hojeAno,
                vazio: !dia,
                'has-events': dia && eventosDoDia(dia).length
              }"
              @click="dia && abrir(dia)"
            >

              <span
                v-if="dia"
                class="day-number"
              >
                {{ dia }}
              </span>

              <div
                v-if="dia"
                class="mini-events"
              >
                <div
                  v-for="ev in eventosDoDia(dia).slice(0, 3)"
                  :key="ev.id"
                  class="event-line"
                  :style="{
                    backgroundColor:
                      appStore.getCorEvento(ev.tipo)
                  }"
                >
                  <span>{{ ev.tipo }}</span>
                </div>

                <small
                  v-if="eventosDoDia(dia).length > 3"
                  class="more-events"
                >
                  +{{ eventosDoDia(dia).length - 3 }}
                </small>
              </div>

            </div>

          </div>

          <div class="legend-box">
            <h4>Legenda</h4>

            <div class="legend-items">

              <div>
                <span
                  class="dot"
                  style="background:#90caf9"
                ></span>
                Aniversário
              </div>

              <div>
                <span
                  class="dot"
                  style="background:#f8bbd0"
                ></span>
                Casamento
              </div>

              <div>
                <span
                  class="dot"
                  style="background:#c8e6c9"
                ></span>
                Corporativo
              </div>

              <div>
                <span
                  class="dot"
                  style="background:#e0e0e0"
                ></span>
                Formatura
              </div>

            </div>
          </div>

        </div>

      </div>

      <div
        v-if="selecionado"
        class="modal-overlay"
        @click.self="selecionado = null"
      >

        <div class="modal-content">

          <button
            class="close-btn"
            @click="selecionado = null"
          >
            <span class="material-symbols-outlined">
              close
            </span>
          </button>

          <div class="modal-heading">
            <span class="material-symbols-outlined">
              event
            </span>

            <div>
              <h3>Eventos do dia</h3>

              <p>
                {{ String(selecionado).padStart(2, '0') }}/{{ String(mes + 1).padStart(2, '0') }}/{{ ano }}
              </p>
            </div>
          </div>

          <div
            v-if="eventosDoDia(selecionado).length"
            class="modal-events"
          >

            <div
              v-for="ev in eventosDoDia(selecionado)"
              :key="ev.id"
              class="event-item"
              @click="abrirEvento(ev)"
            >

              <div
                class="event-color"
                :style="{
                  backgroundColor:
                    appStore.getCorEvento(ev.tipo)
                }"
              ></div>

              <div class="event-info">
                <strong>
                  #{{ ev.id }} - {{ ev.tipo }}
                </strong>

                <span>
                  {{ ev.cliente }}
                </span>

                <small>
                  {{ ev.hora }}
                </small>
              </div>

              <span class="material-symbols-outlined arrow">
                chevron_right
              </span>

            </div>

          </div>

          <p
            v-else
            class="no-events"
          >
            Nenhum evento neste dia.
          </p>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore.js'

const router = useRouter()
const appStore = useAppStore()

const hojeData = new Date()

const mes = ref(hojeData.getMonth())
const ano = ref(hojeData.getFullYear())
const selecionado = ref(null)

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

const semana = [
  'DOM',
  'SEG',
  'TER',
  'QUA',
  'QUI',
  'SEX',
  'SÁB'
]

const hojeNumero = hojeData.getDate()
const hojeMes = hojeData.getMonth()
const hojeAno = hojeData.getFullYear()

const dias = computed(() => {
  const inicio = new Date(
    ano.value,
    mes.value,
    1
  ).getDay()

  const total = new Date(
    ano.value,
    mes.value + 1,
    0
  ).getDate()

  return [
    ...Array(inicio).fill(null),
    ...Array.from(
      { length: total },
      (_, i) => i + 1
    )
  ]
})

function eventosDoDia(dia) {
  if (!dia) {
    return []
  }

  const data = `${ano.value}-${String(
    mes.value + 1
  ).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

  return appStore.eventos.filter(
    evento => evento.dataISO === data
  )
}

function abrir(dia) {
  selecionado.value = dia
}

function abrirEvento(evento) {
  router.push({
    path: '/eventos',
    query: {
      evento: evento.id
    }
  })
}

function anterior() {
  mes.value--

  if (mes.value < 0) {
    mes.value = 11
    ano.value--
  }
}

function proximo() {
  mes.value++

  if (mes.value > 11) {
    mes.value = 0
    ano.value++
  }
}

function hoje() {
  mes.value = hojeMes
  ano.value = hojeAno
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
  padding: 25px;
}

.calendar-container {
  max-width: 1080px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 15px;
  padding: 15px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.month-title span {
  color: #999;
  font-size: .65rem;
}

.month-title h2 {
  margin: 1px 0 0;
  color: #333;
  font-size: 1.25rem;
}

.calendar-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.calendar-actions button {
  height: 31px;
  min-width: 31px;
  padding: 0 9px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: .68rem;
}

.calendar-actions button:first-child {
  padding: 0 11px;
}

.calendar-actions button:not(:first-child) {
  color: #fff;
  background: #ff9500;
  border-color: #ff9500;
}

.calendar-actions span {
  font-size: 18px;
}

.weekdays-grid,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.weekdays-grid {
  margin-bottom: 5px;
  text-align: center;
}

.weekdays-grid span {
  color: #999;
  font-size: .57rem;
  font-weight: 700;
}

.day-cell {
  min-height: 70px;
  padding: 6px;
  box-sizing: border-box;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: .15s;
}

.day-cell:hover {
  background: #f5f7f9;
}

.day-cell.vazio {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.day-cell.today {
  border: 2px solid #ff9500;
  background: #fff9f1;
}

.day-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #444;
  border-radius: 50%;
  font-size: .67rem;
  font-weight: 600;
}

.today .day-number {
  background: #ff9500;
  color: #fff;
}

.mini-events {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 3px;
}

.event-line {
  height: 18px;
  border-radius: 4px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.event-line span {
  color: #555;
  font-size: .52rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  color: #999;
  font-size: .5rem;
}

.legend-box {
  margin-top: 13px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 9px;
}

.legend-box h4 {
  margin: 0 0 7px;
  color: #666;
  font-size: .68rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 15px;
}

.legend-items div {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: .62rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
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
  width: 420px;
  max-width: 100%;
  background: #fff;
  border-radius: 15px;
  padding: 21px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 29px;
  height: 29px;
  border: 0;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn span {
  font-size: 17px;
}

.modal-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 15px;
}

.modal-heading > span {
  color: #ff9500;
  font-size: 25px;
}

.modal-heading h3 {
  margin: 0;
  color: #333;
  font-size: .95rem;
}

.modal-heading p {
  margin: 2px 0 0;
  color: #ff9500;
  font-size: .65rem;
  font-weight: 600;
}

.modal-events {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px;
  background: #fafafa;
  border-radius: 9px;
  cursor: pointer;
}

.event-color {
  width: 6px;
  height: 38px;
  border-radius: 4px;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-info strong {
  color: #444;
  font-size: .7rem;
}

.event-info span {
  color: #777;
  font-size: .63rem;
}

.event-info small {
  color: #999;
  font-size: .58rem;
}

.arrow {
  color: #aaa;
  font-size: 18px;
}

.no-events {
  color: #999;
  text-align: center;
  font-size: .7rem;
  padding: 20px 0;
}

@media (max-width: 700px) {
  .page-body {
    padding: 15px;
  }

  .calendar-container {
    padding: 10px;
  }

  .day-cell {
    min-height: 58px;
    padding: 4px;
  }

  .event-line {
    height: 5px;
    padding: 0;
  }

  .event-line span {
    display: none;
  }

  .legend-items {
    gap: 7px 10px;
  }
}
</style>
