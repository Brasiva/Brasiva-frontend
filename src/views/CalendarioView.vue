<template>
  <div class="page-layout">
    <div class="main-content">
      <div class="page-body">
        <div class="calendar-container">
          <div class="calendar-header">
            <div><span class="year-label">{{ ano }}</span><h2>{{ meses[mes] }}</h2></div>
            <div class="calendar-actions">
              <button @click="hoje">Hoje</button>
              <button @click="anterior">‹</button>
              <button @click="proximo">›</button>
            </div>
          </div>

          <div class="weekdays-grid">
            <span v-for="dia in semana" :key="dia">{{ dia }}</span>
          </div>

          <div class="days-grid">
            <div v-for="(dia, i) in dias" :key="i" class="day-cell" :class="{ today: dia === hojeNumero && mes === hojeMes && ano === hojeAno, vazio: !dia }" @click="dia && abrir(dia)">
              <span v-if="dia" class="day-number">{{ dia }}</span>
              <div v-if="dia" class="mini-events">
                <div v-for="ev in eventos(dia)" :key="ev.id" class="event-line" :style="{ backgroundColor: appStore.getCorEvento(ev.tipo) }"></div>
              </div>
            </div>
          </div>

          <div class="legend-box">
            <h4>Legenda</h4>
            <div class="legend-items">
              <div><span class="dot" style="background:#90caf9"></span>Aniversário</div>
              <div><span class="dot" style="background:#f8bbd0"></span>Casamento</div>
              <div><span class="dot" style="background:#c8e6c9"></span>Corporativo</div>
              <div><span class="dot" style="background:#e0e0e0"></span>Formatura</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selecionado" class="modal-overlay" @click.self="selecionado = null">
        <div class="modal-content">
          <button class="close-btn" @click="selecionado = null">✕</button>
          <h3>Eventos do dia</h3>
          <p class="modal-date">{{ selecionado }}/{{ String(mes + 1).padStart(2, '0') }}/{{ ano }}</p>

          <div v-if="eventos(selecionado).length" class="modal-events">
            <div v-for="ev in eventos(selecionado)" :key="ev.id" class="event-item" :style="{ backgroundColor: appStore.getCorEvento(ev.tipo) }" @click="$router.push('/eventos')">
              <strong>{{ ev.tipo }}</strong>
              <span>{{ ev.hora }}</span>
            </div>
          </div>

          <p v-else class="no-events">Nenhum evento neste dia.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/appStore.js'

const appStore = useAppStore()
const hojeData = new Date()
const mes = ref(hojeData.getMonth())
const ano = ref(hojeData.getFullYear())
const selecionado = ref(null)

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const semana = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']
const hojeNumero = hojeData.getDate()
const hojeMes = hojeData.getMonth()
const hojeAno = hojeData.getFullYear()

const dias = computed(() => {
  const inicio = new Date(ano.value, mes.value, 1).getDay()
  const total = new Date(ano.value, mes.value + 1, 0).getDate()
  return [...Array(inicio).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]
})

function eventos(dia) {
  const data = `${ano.value}-${String(mes.value + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
  return appStore.eventos.filter(e => e.dataISO === data)
}

function abrir(dia) {
  selecionado.value = dia
}

function anterior() {
  mes.value--
  if (mes.value < 0) { mes.value = 11; ano.value-- }
}

function proximo() {
  mes.value++
  if (mes.value > 11) { mes.value = 0; ano.value++ }
}

function hoje() {
  mes.value = hojeMes
  ano.value = hojeAno
}
</script>

<style scoped>
.page-layout{min-height:100vh;background:#eef0f2;font-family:'Poppins',sans-serif}.main-content{min-height:100vh}.page-body{padding:16px}.calendar-container{max-width:1400px;margin:auto;background:#fff;border-radius:18px;padding:16px;box-sizing:border-box}.calendar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.year-label{color:#999;font-size:.75rem}.calendar-header h2{margin:2px 0 0;font-size:1.45rem}.calendar-actions{display:flex;gap:6px}.calendar-actions button{height:34px;border:1px solid #eee;border-radius:9px;background:#fff;color:#555;padding:0 11px;cursor:pointer}.calendar-actions button:not(:first-child){width:34px;padding:0;background:#ff9500;color:#fff;border:0;font-size:1.4rem}.weekdays-grid,.days-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.weekdays-grid{margin-bottom:7px;text-align:center}.weekdays-grid span{font-size:.6rem;color:#888;font-weight:700}.day-cell{min-height:65px;padding:7px;background:#fafafa;border:1px solid #eee;border-radius:9px;box-sizing:border-box;cursor:pointer}.day-cell:hover{background:#f2f5f8}.day-cell.vazio{cursor:default;background:transparent;border:0}.day-cell.today{border:2px solid #ff9500;background:#fff8ef}.day-number{display:flex;width:25px;height:25px;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#333;border-radius:50%}.today .day-number{background:#ff9500;color:#fff}.mini-events{display:flex;flex-direction:column;gap:3px;margin-top:4px}.event-line{height:5px;border-radius:4px;width:100%}.legend-box{margin-top:20px;padding:13px;background:#f9f9f9;border-radius:11px}.legend-box h4{margin:0 0 9px;font-size:.75rem;color:#666}.legend-items{display:flex;flex-wrap:wrap;gap:9px 15px;font-size:.7rem;color:#555}.legend-items div{display:flex;align-items:center;gap:5px}.dot{width:10px;height:10px;border-radius:50%}.modal-overlay{position:fixed;inset:0;background:#0007;display:flex;align-items:center;justify-content:center;padding:16px;z-index:2000}.modal-content{position:relative;width:100%;max-width:400px;background:#fff;border-radius:17px;padding:22px;box-sizing:border-box;text-align:center}.close-btn{position:absolute;right:12px;top:12px;border:0;background:#f5f5f5;border-radius:50%;width:32px;height:32px;cursor:pointer}.modal-content h3{margin:0;color:#333}.modal-date{color:#ff8a00;font-size:.75rem;font-weight:700}.modal-events{display:flex;flex-direction:column;gap:8px}.event-item{display:flex;justify-content:space-between;padding:12px;border-radius:10px;color:#333;cursor:pointer;font-size:.8rem}.no-events{color:#888}@media(min-width:600px){.page-body{padding:25px}.calendar-container{padding:22px}.day-cell{min-height:85px}}@media(min-width:768px){.page-body{padding:30px}.day-cell{min-height:95px}}@media(min-width:1024px){.page-body{padding:30px 40px}.day-cell{min-height:110px}}
</style>
