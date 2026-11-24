<template>
  <main class="budget-page">
    <header><div><span>FINANCEIRO</span><h1>Orçamentos</h1><p>Custos calculados a partir do cardápio, equipe e taxas dos eventos.</p></div><button @click="carregar" :disabled="carregando">Atualizar</button></header>
    <p v-if="erro" class="alert">{{ erro }}</p><p v-else-if="carregando" class="empty">Carregando orçamentos…</p>
    <section v-else-if="linhas.length" class="grid">
      <article v-for="linha in linhas" :key="linha.id" class="card"><div class="card-title"><div><small>EVENTO #{{ linha.evento.id }}</small><h2>{{ linha.evento.tipo }} · {{ linha.evento.cliente }}</h2><p>{{ linha.evento.dataHora }}</p></div><strong>{{ moeda(linha.valor_total_orcamento) }}</strong></div>
        <dl><div><dt>Cardápio</dt><dd>{{ moeda(linha.valor_total_pratos) }}</dd></div><div><dt>Equipe</dt><dd>{{ moeda(linha.valor_total_equipe) }}</dd></div><div><dt>Taxas + mão de obra</dt><dd>{{ moeda(Number(linha.mao_de_obra) + Number(linha.evento.taxa_utensilio || 0)) }}</dd></div></dl>
        <label>Mão de obra <span><input v-model.number="edicoes[linha.id]" type="number" min="0" step="0.01"><button @click="salvar(linha)">Salvar</button></span></label>
      </article>
    </section>
    <section v-else class="empty"><p>Ainda não há orçamentos vinculados a eventos.</p><div v-for="evento in eventosSemOrcamento" :key="evento.id" class="new-budget"><span>#{{ evento.id }} · {{ evento.tipo }} · {{ evento.cliente }}</span><button @click="criar(evento)">Criar orçamento</button></div></section>
    <section v-if="!carregando && linhas.length && eventosSemOrcamento.length" class="missing"><h2>Eventos sem orçamento</h2><div v-for="evento in eventosSemOrcamento" :key="evento.id" class="new-budget"><span>#{{ evento.id }} · {{ evento.tipo }} · {{ evento.cliente }}</span><button @click="criar(evento)">Criar orçamento</button></div></section>
  </main>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import api from '@/api/config'
import { useAppStore } from '@/stores/appStore'
const appStore = useAppStore(); const linhas = ref([]); const carregando = ref(false); const erro = ref(''); const edicoes = reactive({})
const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0))
const eventosSemOrcamento = computed(() => appStore.eventos.filter((evento) => !linhas.value.some((linha) => linha.evento.id === evento.id)))
async function todas(url) { const rows=[]; let page=1; while(true){const {data}=await api.get(url,{params:{page}});rows.push(...(Array.isArray(data)?data:data.results||[]));if(Array.isArray(data))break;if(data.total_pages&&page<data.total_pages){page++;continue}if(data.next){page++;continue}break}return rows }
async function carregar() { carregando.value=true; erro.value=''; try { await appStore.carregarEventos(); const [orcamentos, eventos]=await Promise.all([todas('/api/orcamento-eventos/'), Promise.resolve(appStore.eventos)]); linhas.value=orcamentos.map((item)=>{const evento=eventos.find((e)=>e.id===item.evento);edicoes[item.id]=Number(item.mao_de_obra);return {...item,evento:evento||{id:item.evento,tipo:'Evento',cliente:'Cliente',dataHora:''}}}) } catch { erro.value='Não foi possível carregar os orçamentos. Verifique as permissões e a conexão com a API.' } finally { carregando.value=false } }
async function salvar(linha){try{await api.patch(`/api/orcamento-eventos/${linha.id}/`,{mao_de_obra:Number(edicoes[linha.id]||0)});await carregar()}catch{erro.value='Não foi possível salvar a mão de obra.'}}
async function criar(evento){try{await api.post('/api/orcamento-eventos/',{evento:evento.id,mao_de_obra:0});await carregar()}catch{erro.value='Não foi possível criar o orçamento.'}}
onMounted(carregar)
</script>
<style scoped>
.budget-page{padding:28px 35px;max-width:1450px;margin:auto;min-height:100vh;background:#f4f5f7;font-family:system-ui,sans-serif;color:#333}.budget-page header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.budget-page header span{font-size:.7rem;letter-spacing:.14em;color:#ef8c00;font-weight:800}.budget-page h1{margin:4px 0}.budget-page header p,.card p{color:#888;font-size:.85rem}.budget-page header button,.card label button{border:0;background:#333;color:white;padding:10px 15px;border-radius:8px;cursor:pointer}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:16px}.card{background:white;border:1px solid #eee;border-radius:14px;padding:20px}.card-title{display:flex;justify-content:space-between;gap:12px}.card-title small{color:#888}.card h2{font-size:1.05rem;margin:6px 0}.card-title>strong{color:#8c3428;white-space:nowrap}.card dl{border-block:1px solid #eee;padding:12px 0}.card dl div{display:flex;justify-content:space-between;padding:5px 0}.card dt{color:#777}.card dd{margin:0;font-weight:700}.card label,.card label span{display:flex;justify-content:space-between;align-items:center;gap:8px}.card input{width:115px;padding:9px;border:1px solid #ddd;border-radius:8px}.empty,.alert{background:white;padding:30px;border-radius:12px}.alert{color:#a32121}@media(max-width:600px){.budget-page{padding:20px 14px}.budget-page header{align-items:flex-start;gap:12px}.grid{grid-template-columns:1fr}}
.missing{margin-top:24px;background:#fff;padding:20px;border-radius:12px}.new-budget{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #eee}.new-budget button{border:0;border-radius:8px;background:#8c3428;color:#fff;padding:9px 12px;cursor:pointer}
</style>
