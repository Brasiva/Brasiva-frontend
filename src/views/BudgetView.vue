<template>
  <div class="page-layout">
    <div class="main-content">
      <main class="page-body budget-page">
        <header class="header-area">
          <div>
            <span class="section-label">Financeiro</span>
            <h2 class="title">Orçamentos</h2>
            <p class="subtitle">Prepare e envie propostas dos pedidos aceitos pelo Brasiva Site.</p>
          </div>
          <button class="refresh" type="button" :disabled="carregando" @click="carregar">{{ carregando ? 'Atualizando…' : 'Atualizar' }}</button>
        </header>
        <p v-if="erro" class="alert" role="alert">{{ erro }}</p>
        <p v-else-if="carregando" class="empty" role="status">Carregando orçamentos…</p>
        <section v-else-if="linhas.length" class="budget-grid">
          <article v-for="linha in linhas" :key="linha.pedido.id" class="budget-card">
            <header class="card-heading">
              <div>
                <span>Pedido #{{ linha.pedido.id }} · Evento #{{ linha.evento.id }}</span>
                <h3>{{ linha.pedido.tipo_evento }} · {{ linha.pedido.nome }}</h3>
                <p>{{ formatarData(linha.pedido.data_evento) }}<span v-if="linha.pedido.horario_evento"> às {{ linha.pedido.horario_evento.slice(0, 5) }}</span></p>
              </div>
              <span class="status-pill" :class="{ sent: linha.pedido.orcamento_enviado_em }">{{ linha.pedido.orcamento_enviado_em ? 'Enviado' : linha.pedido.orcamento_final != null ? 'Salvo · aguardando envio' : 'Em preparação' }}</span>
            </header>
            <section class="order-details">
              <h3>Dados do cliente e do evento</h3>
              <p><strong>Cliente:</strong> {{ linha.pedido.nome }}</p>
              <p><strong>E-mail:</strong> {{ linha.pedido.email }}</p>
              <p><strong>Telefone:</strong> {{ linha.pedido.telefone }}</p>
              <p><strong>Convidados:</strong> {{ linha.pedido.convidados }}</p>
              <p v-if="linha.pedido.endereco_evento"><strong>Endereço:</strong> {{ formatarEndereco(linha.pedido.endereco_evento) }}</p>
              <p v-if="linha.pedido.observacoes"><strong>Observações:</strong> {{ linha.pedido.observacoes }}</p>
              <ul v-if="linha.pedido.itens?.length" class="order-items">
                <li v-for="item in linha.pedido.itens" :key="item.prato"><span>{{ item.quantidade }} × {{ item.nome }}</span><span>{{ item.subtotal ? moeda(item.subtotal) : 'Sob orçamento' }}</span></li>
              </ul>
              <div class="estimate"><span>Estimativa dos itens</span><strong>{{ moeda(linha.pedido.total_estimado) }}</strong></div>
            </section>
            <div class="quote-form">
              <label :for="`quote-${linha.pedido.id}`">Valor final do orçamento</label>
              <div class="quote-controls">
                <input :id="`quote-${linha.pedido.id}`" v-model="edicoes[linha.pedido.id]" type="number" min="0" step="0.01" :disabled="Boolean(linha.pedido.orcamento_enviado_em)" placeholder="Informe o valor final" required>
                <button type="button" :disabled="salvando === linha.pedido.id || Boolean(linha.pedido.orcamento_enviado_em) || !valorValido(linha)" @click="salvarOrcamento(linha)">{{ salvando === linha.pedido.id ? 'Salvando…' : 'Salvar orçamento' }}</button>
                <button type="button" class="send-button" :disabled="salvando === linha.pedido.id || !podeEnviar(linha)" @click="enviarOrcamento(linha)">{{ salvando === linha.pedido.id ? 'Enviando…' : linha.pedido.orcamento_enviado_em ? 'E-mail enviado' : 'Enviar por e-mail' }}</button>
              </div>
              <p v-if="linha.pedido.orcamento_final != null && !linha.pedido.orcamento_enviado_em" class="saved-hint">Valor salvo. Clique em “Enviar por e-mail” para encaminhar a proposta ao cliente.</p>
            </div>
            <p v-if="avisos[linha.pedido.id]" class="feedback" :class="{ error: errosEnvio[linha.pedido.id] }" role="status">{{ avisos[linha.pedido.id] }}</p>
          </article>
        </section>
        <section v-else class="empty"><h2>Nenhum orçamento disponível no momento.</h2></section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@/api/config'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
const linhas = ref([])
const carregando = ref(false)
const salvando = ref(null)
const erro = ref('')
const edicoes = reactive({})
const avisos = reactive({})
const errosEnvio = reactive({})
const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0))

async function todas(url) {
  const rows = []
  let page = 1
  while (true) {
    const { data } = await api.get(url, { params: { page } })
    rows.push(...(Array.isArray(data) ? data : data.results || []))
    if (Array.isArray(data) || (!data.next && (!data.total_pages || page >= data.total_pages))) break
    page += 1
  }
  return rows
}

function formatarEndereco(endereco) {
  return [endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.estado, endereco.cep].filter(Boolean).join(', ')
}

function formatarData(data) {
  if (!data) return 'Data não informada'
  return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR')
}

async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    await appStore.carregarEventos()
    const [pedidos, orcamentos] = await Promise.all([todas('/api/pedidos-site/'), todas('/api/orcamento-eventos/')])
    linhas.value = pedidos
      .filter((pedido) => pedido.status === 'aprovado' && pedido.evento)
      .map((pedido) => {
        const evento = appStore.eventos.find((item) => item.id === pedido.evento)
        const orcamento = orcamentos.find((item) => item.evento === pedido.evento)
        edicoes[pedido.id] = pedido.orcamento_final == null ? '' : Number(pedido.orcamento_final)
        return { pedido, evento: evento || { id: pedido.evento }, orcamento }
      })
  } catch {
    erro.value = 'Não foi possível carregar os orçamentos. Verifique a conexão e tente novamente.'
  } finally {
    carregando.value = false
  }
}

function valorValido(linha) {
  const valor = edicoes[linha.pedido.id]
  return valor !== '' && valor != null && Number.isFinite(Number(valor)) && Number(valor) >= 0
}

function podeEnviar(linha) {
  return !linha.pedido.orcamento_enviado_em
    && linha.pedido.orcamento_final != null
    && valorValido(linha)
    && Number(edicoes[linha.pedido.id]) === Number(linha.pedido.orcamento_final)
}

async function salvarOrcamento(linha) {
  const id = linha.pedido.id
  if (!valorValido(linha)) return
  salvando.value = id
  avisos[id] = ''
  errosEnvio[id] = false
  try {
    const { data } = await api.post(`/api/pedidos-site/${id}/salvar-orcamento/`, { valor_final: Number(edicoes[id]) })
    linha.pedido.orcamento_final = data.valor_final
    avisos[id] = 'Orçamento salvo. Revise os dados e envie por e-mail quando estiver pronto.'
  } catch (error) {
    avisos[id] = error.response?.data?.detail || 'Não foi possível salvar o orçamento.'
    errosEnvio[id] = true
  } finally {
    salvando.value = null
  }
}

async function enviarOrcamento(linha) {
  const id = linha.pedido.id
  if (!podeEnviar(linha)) return
  salvando.value = id
  avisos[id] = ''
  errosEnvio[id] = false
  try {
    await api.post(`/api/pedidos-site/${id}/enviar-orcamento/`)
    linha.pedido.orcamento_enviado_em = new Date().toISOString()
    avisos[id] = `Orçamento enviado para ${linha.pedido.email}.`
  } catch (error) {
    avisos[id] = error.response?.data?.detail || 'Não foi possível enviar o orçamento. Tente novamente.'
    errosEnvio[id] = true
  } finally {
    salvando.value = null
  }
}

onMounted(carregar)
</script>

<style scoped>
.page-layout{min-height:100vh;background:#f4f5f7;font-family:'Poppins',sans-serif}.main-content{min-height:100vh}.page-body{max-width:1450px;margin:0 auto;padding:28px 35px}.header-area{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}.section-label{color:#ff9500;font-size:.68rem;font-weight:700;text-transform:uppercase}.title{margin:2px 0 0;color:#333;font-size:1.25rem}.subtitle{margin:7px 0 0;color:#777;font-size:.88rem}.refresh,.quote-controls button{min-height:40px;border:1px solid #e2e1de;border-radius:9px;background:#fff;color:#4d5155;padding:9px 14px;font:inherit;font-size:.84rem;font-weight:650;cursor:pointer}.refresh:hover,.quote-controls button:hover{background:#f7f5f2;border-color:#d7c8bb}.quote-controls button:focus-visible,.refresh:focus-visible,.quote-controls input:focus-visible{outline:3px solid #d7b79c;outline-offset:2px}.refresh:disabled,.quote-controls button:disabled{opacity:.55;cursor:not-allowed}.budget-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:18px}.budget-card,.empty,.alert{background:#fff;border:1px solid #e9e6e2;border-radius:15px;box-shadow:0 5px 16px #302d2a0a}.budget-card{padding:22px}.card-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.card-heading>div>span{color:#8b695b;font-size:.75rem;font-weight:700}.card-heading h3{margin:6px 0;font-size:1.08rem}.card-heading p{margin:5px 0;color:#777;font-size:.88rem}.status-pill{padding:6px 9px;border-radius:20px;background:#f5eee8;color:#754b39;font-size:.74rem;white-space:nowrap}.status-pill.sent{background:#e9f2e9;color:#466b49}.order-details{margin-top:18px}.order-details h3{margin:0 0 10px;font-size:.95rem}.order-details p{margin:6px 0;color:#655f5a;font-size:.84rem;line-height:1.55}.order-items{margin:14px 0;padding:0;list-style:none;border-top:1px solid #eee}.order-items li,.estimate{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #eee;font-size:.84rem}.estimate{font-weight:700;color:#563c32}.quote-form{margin-top:18px;padding-top:16px;border-top:1px solid #eee}.quote-form>label{display:block;margin-bottom:8px;font-size:.85rem;font-weight:700}.quote-controls{display:flex;flex-wrap:wrap;gap:9px}.quote-controls input{min-width:150px;flex:1;border:1px solid #d8d1cb;border-radius:9px;padding:10px;font:inherit}.quote-controls .send-button{border-color:#d9c8b6;background:#f6f0e9;color:#624737}.quote-controls .send-button:hover{background:#eee3d8}.saved-hint{margin:8px 0 0;color:#72685f;font-size:.8rem}.feedback{color:#4c725a;font-size:.83rem}.feedback.error{color:#9e2929}.empty,.alert{padding:28px}.alert{color:#9e2929}.empty h2{margin:0;font-size:1rem;font-weight:600;color:#68635e}@media(max-width:650px){.page-body{padding:20px 14px}.header-area{align-items:flex-start}.budget-card{padding:17px}.card-heading{flex-direction:column}.quote-controls{flex-direction:column}.quote-controls>*{min-height:44px}}
:global(html.dark-mode) .budget-page,:global(html.dark-mode) .page-layout{background:#1d2022;color:#eceae7}:global(html.dark-mode) .budget-card,:global(html.dark-mode) .empty,:global(html.dark-mode) .alert{background:#262a2c;border-color:#393d3f;color:#eceae7;box-shadow:0 5px 16px #0003}:global(html.dark-mode) .title,:global(html.dark-mode) .empty h2,:global(html.dark-mode) .order-details h3,:global(html.dark-mode) .quote-form>label{color:#f0ece7}:global(html.dark-mode) .subtitle,:global(html.dark-mode) .order-details p,:global(html.dark-mode) .saved-hint{color:#b9b5b0}:global(html.dark-mode) .card-heading p{color:#aaa5a0}:global(html.dark-mode) .card-heading>div>span{color:#d0b6a4}:global(html.dark-mode) .refresh,:global(html.dark-mode) .quote-controls button,:global(html.dark-mode) .quote-controls input{background:#303537;border-color:#494e50;color:#f1efec}:global(html.dark-mode) .quote-controls .send-button,:global(html.dark-mode) .status-pill{background:#393330;color:#e6cbb6}:global(html.dark-mode) .status-pill.sent{background:#2d3d32;color:#b9d6bc}:global(html.dark-mode) .order-items li,:global(html.dark-mode) .estimate,:global(html.dark-mode) .quote-form{border-color:#414648}:global(html.dark-mode) .estimate{color:#e4d4c6}
</style>