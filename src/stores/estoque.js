import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

async function allPages(path) {
  const items = []
  let page = 1
  while (true) {
    const { data } = await api.get(path, { params: { page } })
    items.push(...(Array.isArray(data) ? data : data.results || []))
    if (Array.isArray(data) || !data.total_pages || page >= data.total_pages) break
    page += 1
  }
  return items
}

export const useEstoqueStore = defineStore('estoque', () => {
  const itensEstoque = ref([])
  const categorias = ref([])
  const carregando = ref(false)
  const erro = ref('')

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      const [categoriasApi, ingredientes, estoques] = await Promise.all([
        allPages('/api/categoria-ingredientes/'), allPages('/api/ingredientes/'), allPages('/api/estoque/'),
      ])
      categorias.value = categoriasApi
      itensEstoque.value = ingredientes.map((item) => {
        const estoque = estoques.find((row) => row.id === item.estoque)
        const categoria = categoriasApi.find((row) => row.id === item.categoria_ingrediente)
        return {
          id: item.id, estoqueId: estoque?.id, nome: item.nome, valor: Number(item.valor || 0),
          quantidade: Number(estoque?.quantidade || 0), minimo: Number(estoque?.quantidade_minima || 0),
          unidade: item.und_med || estoque?.und_medida || 'un', categoriaId: item.categoria_ingrediente,
          categoria: categoria?.nome || 'Sem categoria', icone: icone(categoria?.nome),
        }
      })
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Não foi possível carregar o estoque.'
      throw error
    } finally { carregando.value = false }
  }

  async function salvar(dados) {
    const stockPayload = { quantidade: Number(dados.quantidade), quantidade_minima: Number(dados.minimo), und_medida: dados.unidade || 'un' }
    const atual = itensEstoque.value.find((item) => item.id === dados.id)
    let estoqueId = atual?.estoqueId
    if (estoqueId) await api.patch(`/api/estoque/${estoqueId}/`, stockPayload)
    else estoqueId = (await api.post('/api/estoque/', stockPayload)).data.id
    const ingredientPayload = {
      nome: dados.nome, valor: Number(dados.valor || 0), und_med: dados.unidade || 'un',
      categoria_ingrediente: dados.categoria ? Number(dados.categoria) : null, estoque: estoqueId,
    }
    if (dados.id) await api.patch(`/api/ingredientes/${dados.id}/`, ingredientPayload)
    else await api.post('/api/ingredientes/', ingredientPayload)
    await carregar()
  }

  async function excluir(id) {
    const item = itensEstoque.value.find((row) => row.id === id)
    await api.delete(`/api/ingredientes/${id}/`)
    if (item?.estoqueId) await api.delete(`/api/estoque/${item.estoqueId}/`)
    itensEstoque.value = itensEstoque.value.filter((row) => row.id !== id)
  }

  async function adicionarCategoria(nome) {
    const { data } = await api.post('/api/categoria-ingredientes/', { nome })
    categorias.value.push(data)
  }

  return { itensEstoque, categorias, carregando, erro, carregar, salvar, excluir, adicionarCategoria }
})

function icone(categoria = '') {
  const nome = categoria.toLocaleLowerCase('pt-BR')
  if (nome.includes('bebida')) return 'local_drink'
  if (nome.includes('alimento')) return 'restaurant'
  return 'inventory_2'
}
