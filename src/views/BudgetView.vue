<template>
  <main class="budget-page">
    <header class="budget-header">
      <div><span class="eyebrow">FINANCEIRO</span><h1>Orçamentos</h1><p>Revise os pedidos aceitos e prepare a proposta final do evento.</p></div>
      <button class="refresh" :disabled="carregando" @click="carregar">Atualizar</button>
    </header>
    <p v-if="erro" class="alert">{{ erro }}</p>
    <p v-else-if="carregando" class="empty">Carregando orçamentos…</p>
    <section v-else-if="linhas.length" class="budget-grid">
      <article v-for="linha in linhas" :key="linha.id" class="budget-card">
        <header class="card-heading"><div><span>Pedido #{{ linha.pedido?.id || '—' }} · Evento #{{ linha.evento.id }}</span><h2>{{ linha.evento.tipo }} · {{ linha.evento.cliente }}</h2><p>{{ linha.evento.dataHora }}</p></div><span class="status-pill">{{ linha.pedido?.orcamento_enviado_em ? 'Enviado' : 'Em preparação' }}</span></header>
        <section v-if="linha.pedido" class="order-details">
          <h3>Solicitação do cliente</h3>
          <p><strong>Contato:</strong> {{ linha.pedido.nome }} · {{ linha.pedido.email }} · {{ linha.pedido.telefone }}</p>
          <p><strong>Convidados:</strong> {{ linha.pedido.convidados }} <span v-if="linha.pedido.horario_evento">· <strong>Horário:</strong> {{ linha.pedido.horario_evento.slice(0, 5) }}</span></p>
          <p v-if="linha.pedido.endereco_evento"><strong>Endereço:</strong> {{ formatarEndereco(linha.pedido.endereco_evento) }}</p>
          <p v-if="linha.pedido.observacoes"><strong>Observações:</strong> {{ linha.pedido.observacoes }}</p>
          <ul v-if="linha.pedido.itens?.length" class="order-items"><li v-for="item in linha.pedido.itens" :key="item.prato"><span>{{ item.quantidade }} × {{ item.nome }}</span><span>{{ item.subtotal ? moeda(item.subtotal) : 'Sob orçamento' }}</span></li></ul>
          <div class="estimate"><span>Estimativa enviada pelo site</span><strong>{{ moeda(linha.pedido.total_estimado) }}</strong></div>
        </section>
        <section v-else class="order-details"><h3>Custos do evento</h3><p>Cardápio: {{ moeda(linha.valor_total_pratos) }} · Equipe: {{ moeda(linha.valor_total_equipe) }}</p><p>Taxa de utensílios: {{ moeda(linha.evento.taxa_utensilio) }}</p></section>
        <form class="quote-form" @submit.prevent="salvarEEnviar(linha)">
          <label :for="`quote-${linha.id}`">Valor final do orçamento</label>
          <div class="quote-controls"><input :id="`quote-${linha.id}`" v-model="edicoes[linha.id]" type="number" min="0" step="0.01" required><button :disabled="salvando === linha.id">{{ salvando === linha.id ? 'Salvando…' : linha.pedido ? 'Salvar e enviar ao cliente' : 'Salvar orçamento' }}</button></div>
        </form>
        <p v-if="avisos[linha.id]" class="feedback">{{ avisos[linha.id] }}</p>
      </article>
    </section>
    <section v-else class="empty"><h2>Nenhum orçamento aguardando</h2><p>Os pedidos aceitos aparecerão aqui para análise.</p></section>
  </main>
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

async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    await appStore.carregarEventos()
    const [orcamentos, pedidos] = await Promise.all([todas('/api/orcamento-eventos/'), todas('/api/pedidos-site/')])
    linhas.value = orcamentos.map((item) => {
      const evento = appStore.eventos.find((linha) => linha.id === item.evento) || { id: item.evento, tipo: 'Evento', cliente: 'Cliente', dataHora: '', taxa_utensilio: 0 }
      const pedido = pedidos.find((linha) => linha.evento === item.evento)
      const total = pedido?.orcamento_final ?? item.valor_total ?? item.valor_total_orcamento ?? 0
      edicoes[item.id] = Number(total)
      return { ...item, evento, pedido }
    })
  } catch { erro.value = 'Não foi possível carregar os orçamentos. Verifique a conexão e as permissões.' }
  finally { carregando.value = false }
}

async function salvarEEnviar(linha) {
  salvando.value = linha.id
  avisos[linha.id] = ''
  try {
    const valor = Number(edicoes[linha.id])
    if (!Number.isFinite(valor) || valor < 0) throw new Error('Informe um valor válido.')
    if (linha.pedido) {
      const { data } = await api.post(`/api/pedidos-site/${linha.pedido.id}/enviar-orcamento/`, { valor_final: valor })
      avisos[linha.id] = data.email_enviado ? 'Orçamento enviado ao cliente.' : data.detail || 'Orçamento salvo; o cliente pode consultá-lo pelo código recebido.'
    } else {
      await api.patch(`/api/orcamento-eventos/${linha.id}/`, { valor_total: valor })
      avisos[linha.id] = 'Orçamento salvo.'
    }
    await carregar()
  } catch (error) {
    avisos[linha.id] = error.response?.data?.detail || error.message || 'Não foi possível salvar o orçamento.'
  } finally { salvando.value = null }
}

onMounted(carregar)
</script>

<style scoped>
.budget-page{max-width:1450px;min-height:100vh;margin:auto;padding:30px 35px;background:#f5f6f8;color:#302d2a;font-family:system-ui,sans-serif}.budget-header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}.eyebrow{color:#b66a42;font-size:.72rem;font-weight:800;letter-spacing:.14em}.budget-header h1{margin:5px 0;font:500 2rem Georgia,serif}.budget-header p,.card-heading p{margin:5px 0;color:#777;font-size:.9rem}.refresh,.quote-controls button{border:0;border-radius:9px;background:#773d2e;color:white;padding:11px 16px;font-weight:700;cursor:pointer}.refresh:disabled,.quote-controls button:disabled{opacity:.65;cursor:wait}.budget-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:18px}.budget-card,.empty,.alert{background:#fff;border:1px solid #e9e6e2;border-radius:15px;box-shadow:0 5px 16px #302d2a0a}.budget-card{padding:22px}.card-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.card-heading>div>span{color:#8b695b;font-size:.75rem;font-weight:700}.card-heading h2{margin:6px 0;font-size:1.12rem}.status-pill{padding:6px 9px;border-radius:20px;background:#f5eee8;color:#754b39;font-size:.74rem;white-space:nowrap}.order-details{margin-top:18px}.order-details h3{margin:0 0 10px;font-size:.95rem}.order-details p{margin:6px 0;color:#655f5a;font-size:.84rem;line-height:1.55}.order-items{margin:14px 0;padding:0;list-style:none;border-top:1px solid #eee}.order-items li,.estimate{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #eee;font-size:.84rem}.estimate{font-weight:700;color:#563c32}.quote-form{margin-top:18px;padding-top:16px;border-top:1px solid #eee}.quote-form label{display:block;margin-bottom:8px;font-size:.85rem;font-weight:700}.quote-controls{display:flex;gap:9px}.quote-controls input{min-width:0;flex:1;border:1px solid #d8d1cb;border-radius:9px;padding:10px;font:inherit}.feedback{color:#4c725a;font-size:.83rem}.empty,.alert{padding:28px}.alert{color:#9e2929}.empty p{color:#777}@media(max-width:600px){.budget-page{padding:20px 14px}.budget-header{align-items:flex-start}.budget-header h1{font-size:1.7rem}.budget-card{padding:17px}.quote-controls{flex-direction:column}.quote-controls button{min-height:44px}}
</style>
