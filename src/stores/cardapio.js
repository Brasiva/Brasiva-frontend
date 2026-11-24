import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'
import { fetchAllPages } from '@/api/pagination'

export const useCardapioStore = defineStore('cardapio', () => {
  const pratos = ref([])
  const categorias = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function buscarPratosDoServidor() {
    carregando.value = true
    erro.value = null
    try {
      const [categoriasApi, pratosApi] = await Promise.all([
        fetchAllPages('/api/categoria-pratos/'), fetchAllPages('/api/pratos/')
      ])
      categorias.value = categoriasApi
      pratos.value = pratosApi.map((prato) => ({
        ...prato,
        preco: prato.valor,
        modoFazer: prato.descricao,
        categoriaNome: categorias.value.find((categoria) => categoria.id === prato.categoria)?.nome || 'Categoria removida',
        ingredientes: prato.ingredientes || [],
      }))
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Não foi possível carregar o cardápio.'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function adicionarPrato(dados) {
    await api.post('/api/pratos/', {
      nome: dados.nome,
      categoria: Number(dados.categoria),
      descricao: dados.modoFazer,
      unidade: dados.unidade || 'unidade',
      disponivel: Boolean(dados.disponivel),
      sob_orcamento: Boolean(dados.sob_orcamento),
      valor: dados.sob_orcamento ? null : Number(dados.preco),
    })
    await buscarPratosDoServidor()
  }

  async function removerPrato(id) {
    await api.delete(`/api/pratos/${id}/`)
    pratos.value = pratos.value.filter((prato) => prato.id !== id)
  }

  async function atualizarPrato(prato) {
    await api.patch(`/api/pratos/${prato.id}/`, {
      nome: prato.nome, valor: prato.preco, categoria: Number(prato.categoria),
      descricao: prato.modoFazer, unidade: prato.unidade, disponivel: prato.disponivel,
      sob_orcamento: Boolean(prato.sob_orcamento), valor: prato.sob_orcamento ? null : Number(prato.preco),
    })
    await buscarPratosDoServidor()
  }

  async function adicionarCategoria(nome) {
    const { data } = await api.post('/api/categoria-pratos/', { nome })
    categorias.value.push(data)
    categorias.value.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }

  return { pratos, categorias, carregando, erro, buscarPratosDoServidor, adicionarPrato, atualizarPrato, removerPrato, adicionarCategoria }
})
