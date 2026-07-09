<template>
  <div class="calendar-page">
    <div class="calendar-navigation">
      <button @click="mudarMes(-1)" class="btn-nav">&lt;</button>
      <h2>{{ nomeMesAtual }} {{ anoAtual }}</h2>
      <button @click="mudarMes(1)" class="btn-nav">&gt;</button>
      
      <button @click="abrirModalNovoEvento" class="btn-novo-evento">
        + Evento
      </button>
    </div>

    <div class="calendar-grid">
      <div class="weekday-header" v-for="dia in diasDaSemana" :key="dia">
        {{ dia }}
      </div>

      <div 
        v-for="(celula, index) in matrizDias" 
        :key="index" 
        class="calendar-day"
        :class="{ 
          'mes-atual': celula.mesAtual,
          'outro-mes': !celula.mesAtual, 
          'hoje': celula.ehHoje,
          'selecionado': diaSelecionado === celula.dataString
        }"
        @click="selecionarDia(celula.dataString)"
      >
        <span class="day-number">{{ celula.numero }}</span>
        
        <div class="events-dots-mobile">
          <span 
            v-for="evento in buscarEventosDoDia(celula.dataString)" 
            :key="evento.id" 
            class="dot" 
            :style="{ backgroundColor: evento.cor }"
          ></span>
        </div>

        <div class="events-container-desktop">
          <div 
            v-for="evento in buscarEventosDoDia(celula.dataString)" 
            :key="evento.id"
            class="event-tag"
            :style="{ backgroundColor: evento.cor }"
          >
            <div class="event-title">{{ evento.titulo }}</div>
            <div class="event-time">{{ evento.hora }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="detalhes-dia-container" v-if="diaSelecionado">
      <div class="detalhes-header">
        <h3>Eventos do dia {{ formatarDataBR(diaSelecionado) }}</h3>
        <p class="sub-link">Confira todos os eventos deste dia</p>
      </div>

      <div class="cards-eventos-lista" v-if="buscarEventosDoDia(diaSelecionado).length > 0">
        <div 
          v-for="evento in buscarEventosDoDia(diaSelecionado)" 
          :key="evento.id" 
          class="card-evento-detalhe"
        >
          <span class="indicador-cor" :style="{ backgroundColor: evento.cor }"></span>
          
          <div class="card-topo">
            <span class="id-evento">#{{ String(evento.id).slice(-3) }} - {{ evento.titulo }}</span>
            <span class="qtd-pessoas">{{ evento.numPessoas }} pessoas</span>
          </div>

          <p class="local-texto"><strong>Local:</strong> {{ evento.endereco || 'Não informado' }}</p>

          <div class="pills-tempo">
            <span class="pill-data">{{ formatarDataBR(evento.dataString) }}</span>
            <span class="pill-hora">{{ evento.hora }}</span>
          </div>

          <div class="secao-card">
            <h4>Cardápio</h4>
            <p class="legenda-itens">Itens:</p>
            <ul>
              <li v-for="prato in evento.cardapio" :key="prato.id">
                • {{ prato.nome }}
              </li>
            </ul>
          </div>

          <div class="secao-card">
            <h4>Funcionários</h4>
            <ul>
              <li v-for="func in evento.funcionarios" :key="func.id">
                • {{ func.nome }} - {{ func.cargo || 'Equipe' }}
              </li>
            </ul>
          </div>

          <div class="orcamento-bloco">
            Orçamento: R$ {{ Number(evento.orcamento).toFixed(2) }}
          </div>
          <button @click.stop="removerEvento(evento.id)" class="btn-deletar-evento">Excluir Registro</button>
        </div>
      </div>
      <p v-else class="sem-eventos">Nenhum evento agendado para este dia.</p>
    </div>

    <div v-if="exibirModal" class="modal-overlay" @click.self="exibirModal = false">
      <div class="modal-card">
        <h3>- NOVO EVENTO -</h3>
        
        <form @submit.prevent="salvarEvento" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Tipo:</label>
              <select v-model="formEvento.titulo" required>
                <option value="Aniversário">Aniversário</option>
                <option value="Casamento">Casamento</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Geral">Outros</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nº de pessoas:</label>
              <input type="number" v-model="formEvento.numPessoas" placeholder="Ex: 50" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Endereço:</label>
              <input type="text" v-model="formEvento.endereco" placeholder="Rua..." required />
            </div>
            <div class="form-group">
              <label>Horário:</label>
              <input type="time" v-model="formEvento.horaRaw" required />
            </div>
          </div>

          <div class="form-group select-custom-box">
            <label>Cardápio (Selecione os pratos):</label>
            <div class="checkbox-scroll-area">
              <label v-for="prato in listaMockCardapio" :key="prato.id" class="check-item">
                <input type="checkbox" :value="prato" v-model="formEvento.cardapioSelecionado" />
                {{ prato.nome }}
              </label>
            </div>
          </div>

          <div class="form-group select-custom-box">
            <label>Funcionários escalados:</label>
            <div class="checkbox-scroll-area">
              <label v-for="func in listaMockFuncionarios" :key="func.id" class="check-item">
                <input type="checkbox" :value="func" v-model="formEvento.funcionariosSelecionados" />
                {{ func.nome }} ({{ func.cargo }})
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Orçamento total (R$):</label>
              <input type="number" v-model="formEvento.orcamento" required />
            </div>
            <div class="form-group">
              <label>Tipo / Cor do Bloco</label>
              <select v-model="formEvento.cor">
                <option value="#ff85c0">Rosa (Aniversário / Festa)</option>
                <option value="#79fafb">Azul (Estoque / Fornecedor)</option>
                <option value="#b7eb8f">Verde (Financeiro / Reunião)</option>
                <option value="#ffbb96">Laranja (Geral)</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="exibirModal = false" class="btn-cancelar">Voltar</button>
            <button type="submit" class="btn-salvar">CADASTRAR EVENTO</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const listaMockCardapio = ref([
  { id: 101, nome: '0.5kg Salmão Grelhado' },
  { id: 102, nome: '2kg Feijoada' },
  { id: 103, nome: '2kg Picanha' },
  { id: 104, nome: '1kg Salada Temperada' }
]);

const listaMockFuncionarios = ref([
  { id: 201, nome: 'Luiza', cargo: 'Cozinheira' },
  { id: 202, nome: 'Giovana', cargo: 'Garçonete' },
  { id: 203, nome: 'Mayara', cargo: 'Limpeza' }
]);

const dataCore = ref(new Date());
const hojeObj = new Date();
const diaSelecionado = ref(`${hojeObj.getFullYear()}-${String(hojeObj.getMonth() + 1).padStart(2, "0")}-${String(hojeObj.getDate()).padStart(2, "0")}`);

const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const mesesDoAno = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const eventos = ref([
  { 
    id: 1, 
    dataString: '2026-07-01', 
    titulo: 'Aniversário', 
    hora: '14h00min', 
    cor: '#ff007f',
    numPessoas: 10,
    endereco: 'Rua dos Bobos, 0 - Centro - Joinville, SC',
    orcamento: 1000.00,
    cardapio: [ { id: 101, nome: '0.5kg Salmão Grelhado' }, { id: 102, nome: '2kg Feijoada' } ],
    funcionarios: [ { id: 201, nome: 'Luiza', cargo: 'Cozinheira' } ]
  }
]);

const exibirModal = ref(false);
const formEvento = ref({
  titulo: 'Aniversário', numPessoas: '', endereco: '', horaRaw: '14:00',
  cor: '#ff007f', orcamento: '', cardapioSelecionado: [], funcionariosSelecionados: []
});

const anoAtual = computed(() => dataCore.value.getFullYear());
const nomeMesAtual = computed(() => mesesDoAno[dataCore.value.getMonth()]);

const mudarMes = (direcao) => {
  const novoMes = dataCore.value.getMonth() + direcao;
  dataCore.value = new Date(dataCore.value.getFullYear(), novoMes, 1);
};

const selecionarDia = (dataString) => {
  diaSelecionado.value = dataString;
};

const formatarDataBR = (str) => {
  if (!str) return '';
  const partes = str.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return `${partes[1]}/${partes[0]}`;
};

const matrizDias = computed(() => {
  const ano = dataCore.value.getFullYear();
  const mes = dataCore.value.getMonth();

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
  const totalDiasMesAnterior = new Date(ano, mes, 0).getDate();

  const listaCelulas = [];
  const hoje = new Date();

  // 1. Dias do mês anterior (cinzas)
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const d = totalDiasMesAnterior - i;
    const mesAnterior = mes === 0 ? 11 : mes - 1;
    const anoAnterior = mes === 0 ? ano - 1 : ano;
    listaCelulas.push({
      numero: d,
      mesAtual: false,
      dataString: `${anoAnterior}-${String(mesAnterior + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      ehHoje: false
    });
  }

  // 2. Dias do mês atual
  for (let i = 1; i <= totalDiasMes; i++) {
    const dataStringAtual = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const verificarHoje = hoje.getDate() === i && hoje.getMonth() === mes && hoje.getFullYear() === ano;

    listaCelulas.push({
      numero: i,
      mesAtual: true,
      dataString: dataStringAtual,
      ehHoje: verificarHoje
    });
  }

  // 3. Dias do próximo mês (cinzas)
  const restanteCelas = 42 - listaCelulas.length;
  for (let i = 1; i <= restanteCelas; i++) {
    const proximoMes = mes === 11 ? 0 : mes + 1;
    const proximoAno = mes === 11 ? ano + 1 : ano;
    listaCelulas.push({
      numero: i,
      mesAtual: false,
      dataString: `${proximoAno}-${String(proximoMes + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      ehHoje: false
    });
  }

  return listaCelulas;
});

const buscarEventosDoDia = (dataString) => {
  return eventos.value.filter(e => e.dataString === dataString);
};

const abrirModalNovoEvento = () => {
  formEvento.value = {
    titulo: 'Aniversário', numPessoas: '', endereco: '', horaRaw: '14:00',
    cor: '#ff007f', orcamento: '', cardapioSelecionado: [], funcionariosSelecionados: []
  };
  exibirModal.value = true;
};

const salvarEvento = () => {
  const [h, m] = formEvento.value.horaRaw.split(':');
  const strHoraFormatada = `${h}h${m}min`;

  eventos.value.push({
    id: Date.now(),
    dataString: diaSelecionado.value,
    titulo: formEvento.value.titulo,
    hora: strHoraFormatada,
    cor: formEvento.value.cor,
    numPessoas: formEvento.value.numPessoas,
    endereco: formEvento.value.endereco,
    orcamento: formEvento.value.orcamento,
    cardapio: [...formEvento.value.cardapioSelecionado],
    funcionarios: [...formEvento.value.funcionariosSelecionados]
  });

  exibirModal.value = false;
};

const removerEvento = (id) => {
  if (confirm("Deseja deletar este evento?")) {
    eventos.value = eventos.value.filter(e => e.id !== id);
  }
};
</script>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.calendar-navigation h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--cor-texto-principal, #000);
}

.btn-nav {
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: var(--cor-card, #fff);
  color: var(--cor-texto-principal, #000);
  cursor: pointer;
}

.btn-novo-evento {
  margin-left: auto;
  background-color: #FF9500;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: var(--cor-card, #fff);
  border: 1px solid #bfbfbf;
  border-radius: 8px;
  overflow: hidden;
}

.weekday-header {
  text-align: center;
  font-weight: bold;
  padding: 0.4rem 0;
  font-size: 0.75rem;
  background-color: #f7dca3;
  color: #000;
  border-bottom: 1px solid #bfbfbf;
}

/* Reduzido o tamanho fixo de cada bloco do dia no Mobile */
.calendar-day {
  height: 52px; 
  padding: 0.2rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #bfbfbf;
  border-right: 1px solid #bfbfbf;
  cursor: pointer;
  background-color: #ffffff;
  box-sizing: border-box;
}

/* COR CINZA: Aplica o fundo cinza e esmaece o número dos dias de outros meses */
.calendar-day.outro-mes {
  background-color: #f2f2f2 !important;
}
.calendar-day.outro-mes .day-number {
  color: #a0a0a0 !important;
}

.calendar-day.selecionado {
  background-color: rgba(255, 149, 0, 0.15) !important;
}

.calendar-day.hoje {
  background-color: rgba(0, 68, 204, 0.05);
  box-shadow: inset 0 0 0 2px #0044cc;
}

.day-number {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cor-texto-principal, #000);
}

.events-dots-mobile {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  margin-top: auto;
}
.events-dots-mobile .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.events-container-desktop {
  display: none; 
}

.detalhes-dia-container {
  margin-top: 1.5rem;
}
.detalhes-header h3 {
  color: #FF4800;
  font-size: 1.3rem;
  margin: 0;
}
.sub-link {
  font-size: 0.85rem;
  color: #0044cc;
  text-decoration: underline;
  margin: 0 0 1rem 0;
}

.cards-eventos-lista {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-evento-detalhe {
  position: relative;
  background-color: #fbdca4;
  color: #000;
  border-radius: 14px;
  padding: 1.2rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.indicador-cor {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.card-topo {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}
.id-evento {
  font-weight: bold;
  font-size: 1rem;
}
.qtd-pessoas {
  font-size: 0.85rem;
}

.pills-tempo {
  display: flex;
  gap: 0.5rem;
  margin: 0.6rem 0;
}
.pill-data, .pill-hora {
  background-color: #e69500;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.secao-card h4 {
  margin: 0.6rem 0 0.2rem 0;
  font-size: 0.9rem;
  text-decoration: underline;
}
.secao-card ul {
  list-style: none;
  padding: 0; margin: 0;
  font-size: 0.85rem;
}

.orcamento-bloco {
  margin-top: 1rem;
  background-color: #e69500;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 0.4rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.btn-deletar-evento {
  background: none; border: none; color: #cc0000;
  font-size: 0.75rem; width: 100%; text-align: center;
  margin-top: 0.6rem; cursor: pointer; text-decoration: underline;
}

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-card {
  background: #FF9500; color: white; padding: 1.5rem; border-radius: 16px;
  width: 92%; max-width: 500px; max-height: 90vh; overflow-y: auto;
}
.modal-form { display: flex; flex-direction: column; gap: 0.8rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-size: 0.8rem; font-weight: bold; margin-bottom: 0.2rem; }
.form-group input, .form-group select {
  height: 36px; border-radius: 6px; border: none; padding: 0 0.5rem;
}

.checkbox-scroll-area {
  background: white; color: #000; border-radius: 6px;
  max-height: 80px; overflow-y: auto; padding: 0.4rem;
}
.check-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; margin-bottom: 0.2rem;}

.modal-actions { display: flex; justify-content: space-between; margin-top: 0.5rem; }
.btn-cancelar { background: none; border: none; color: white; font-weight: bold; cursor: pointer;}
.btn-salvar { background: white; color: #FF9500; border: none; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; cursor: pointer;}

@media (min-width: 768px) {
  /* Reduzido no Desktop de 110px para 80px para caber em telas menores de notebook */
  .calendar-day { height: 80px; } 
  .events-dots-mobile { display: none; }
  .events-container-desktop { display: flex; flex-direction: column; gap: 3px; width: 100%; margin-top: 0.2rem; overflow-y: auto; }
  
  .event-tag {
    color: #000; padding: 2px 4px; border-radius: 4px; font-size: 0.65rem; font-weight: bold;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cards-eventos-lista {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .card-evento-detalhe {
    width: calc(33.333% - 1rem);
  }
}
</style>