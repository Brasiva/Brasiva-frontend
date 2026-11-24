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
        const estoque = estoques.find((row) => row.ingrediente === item.id)
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
    const ingredientPayload = {
      nome: dados.nome, valor: Number(dados.valor || 0), und_med: dados.unidade || 'un',
      categoria_ingrediente: dados.categoria ? Number(dados.categoria) : null,
    }
    let ingredientId = dados.id
    if (ingredientId) await api.patch(`/api/ingredientes/${ingredientId}/`, ingredientPayload)
    else ingredientId = (await api.post('/api/ingredientes/', ingredientPayload)).data.id
    const estoque = itensEstoque.value.find((item) => item.id === ingredientId)
    const payload = { ...stockPayload, ingrediente: ingredientId }
    if (estoque?.estoqueId) await api.patch(`/api/estoque/${estoque.estoqueId}/`, payload)
    else await api.post('/api/estoque/', payload)
    await carregar()
  }

  async function excluir(id) {
    await api.delete(`/api/ingredientes/${id}/`)
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
