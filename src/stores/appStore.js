import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/config'

async function buscarTodas(url) {
  const resultado = []
  let pagina = 1
  while (true) {
    const { data } = await api.get(url, { params: { page: pagina } })
    resultado.push(...(Array.isArray(data) ? data : data.results || []))
    if (Array.isArray(data)) break
    if (data.total_pages && pagina < data.total_pages) { pagina += 1; continue }
    if (data.next) { pagina += 1; continue }
    break
  }
  return resultado
}

const dinheiro = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0))
const dataHora = (value) => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : ''

export const useAppStore = defineStore('app', () => {
  const pedidos = ref([])
  const eventos = ref([])
  const produtos = ref([])
  const carregando = ref(false)
  const erros = ref({})
  const pedidosPendentes = computed(() => pedidos.value.filter((pedido) => !['aprovado', 'recusado'].includes(pedido.status)).length)
  const eventosAgendados = computed(() => eventos.value.length)
  const totalProdutos = computed(() => produtos.value.length)
  const itensEstoqueBaixo = computed(() => produtos.value.filter((item) => Number(item.quantidade) <= Number(item.minimo)).length)

  async function carregarPedidos() {
    try {
      pedidos.value = (await buscarTodas('/api/pedidos-site/')).map((item) => ({
        ...item, tipo: item.tipo_evento, orcamento: dinheiro(item.total_estimado), cliente: item.nome,
        contato: item.telefone, pessoas: item.convidados, dataHora: dataHora(`${item.data_evento}T12:00:00`),
        dataISO: item.data_evento, hora: '', endereco: '', cardapio: item.itens.map((linha) => `${linha.quantidade} × ${linha.nome}`), funcionarios: [],
      }))
      delete erros.value.pedidos
    } catch (error) { erros.value.pedidos = 'Não foi possível carregar as solicitações.'; throw error }
  }

  async function carregarEventos() {
    try {
      const [eventosApi, clientes, vinculosCliente, enderecos, tipos, orcamentos, cardapios, equipe, pratos, listaFuncionarios] = await Promise.all([
        buscarTodas('/api/eventos/'), buscarTodas('/api/clientes/'), buscarTodas('/api/cliente-eventos/'),
        buscarTodas('/api/enderecos/'), buscarTodas('/api/tipo-eventos/'), buscarTodas('/api/orcamento-eventos/'), buscarTodas('/api/cardapio-eventos/'),
        buscarTodas('/api/equipe-eventos/'), buscarTodas('/api/pratos/'), buscarTodas('/api/funcionarios/'),
      ])
      eventos.value = eventosApi.map((evento) => {
        const vinculoCliente = vinculosCliente.find((item) => item.evento === evento.id)
        const cliente = clientes.find((item) => item.id === vinculoCliente?.cliente)
        const endereco = enderecos.find((item) => item.id === evento.endereco)
        const tipo = tipos.find((item) => item.id === evento.tipo_evento)
        const orcamento = orcamentos.find((item) => item.evento === evento.id)
        const menus = cardapios.filter((item) => item.evento === evento.id)
        const pratoIds = menus.map((item) => item.prato)
        const equipeEvento = equipe.filter((item) => item.evento === evento.id)
        const data = new Date(evento.data_hora)
        return {
          ...evento, tipo: tipo?.nome || 'Evento', cliente: cliente?.nome || 'Cliente', contato: cliente?.telefone || '',
          pessoas: evento.quantidade_pessoas, dataHora: dataHora(evento.data_hora), dataISO: evento.data_hora.slice(0, 10),
          hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          endereco: endereco ? `${endereco.logradouro}, ${endereco.numero || 's/n'} — ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}` : '',
          orcamento: dinheiro(orcamento?.valor_total_orcamento ?? evento.taxa_utensilio),
          cardapio: pratos.filter((prato) => pratoIds.includes(prato.id)).map((prato) => prato.nome),
          funcionarios: equipeEvento.map((linha) => listaFuncionarios.find((item) => item.id === linha.funcionario)?.nome || `Funcionário #${linha.funcionario}`),
        }
      })
      delete erros.value.eventos
    } catch (error) { erros.value.eventos = 'Não foi possível carregar os eventos.'; throw error }
  }

  async function carregarEstoque() {
    try {
      const [categorias, itens, estoques] = await Promise.all([buscarTodas('/api/categoria-ingredientes/'), buscarTodas('/api/ingredientes/'), buscarTodas('/api/estoque/')])
      produtos.value = itens.map((item) => ({
        id: item.id, nome: item.nome, quantidade: Number(estoques.find((estoque) => estoque.id === item.estoque)?.quantidade || 0), minimo: Number(estoques.find((estoque) => estoque.id === item.estoque)?.quantidade_minima || 0),
        valor: Number(item.valor || 0), unidade: item.und_med,
        categoria: categorias.find((categoria) => categoria.id === item.categoria_ingrediente)?.nome || 'Sem categoria',
      }))
      delete erros.value.estoque
    } catch (error) { erros.value.estoque = 'Não foi possível carregar o estoque.'; throw error }
  }

  async function carregarDashboard() {
    carregando.value = true
    const resultados = await Promise.allSettled([carregarPedidos(), carregarEventos(), carregarEstoque()])
    carregando.value = false
    return resultados
  }

  async function atualizarStatusPedido(id, status) {
    const { data } = await api.patch(`/api/pedidos-site/${id}/`, { status })
    const indice = pedidos.value.findIndex((pedido) => pedido.id === id)
    if (indice >= 0) pedidos.value[indice] = { ...pedidos.value[indice], ...data, tipo: data.tipo_evento, cliente: data.nome, pessoas: data.convidados, orcamento: dinheiro(data.total_estimado) }
    return data
  }

  async function aceitarPedido(pedido) { return atualizarStatusPedido(typeof pedido === 'object' ? pedido.id : pedido, 'aprovado') }
  async function recusarPedido(id) { return atualizarStatusPedido(typeof id === 'object' ? id.id : id, 'recusado') }

  function getCorEvento(tipo) {
    const nome = tipo?.toLocaleLowerCase('pt-BR') || ''
    if (nome.includes('anivers')) return '#90caf9'
    if (nome.includes('casamento')) return '#f8bbd0'
    if (nome.includes('corporativo')) return '#c8e6c9'
    if (nome.includes('formatura')) return '#d1c4e9'
    return '#e0e0e0'
  }

  return { pedidos, eventos, produtos, carregando, erros, pedidosPendentes, eventosAgendados, totalProdutos, itensEstoqueBaixo, carregarPedidos, carregarEventos, carregarEstoque, carregarDashboard, aceitarPedido, recusarPedido, atualizarStatusPedido, getCorEvento }
})
