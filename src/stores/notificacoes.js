import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/config'
import { fetchAllPages } from '@/api/pagination'

export const useNotificacoesStore = defineStore('notificacoes', () => {
  const notificacoes = ref([])
  const loading = ref(false)
  const error = ref('')
  const naoLidasCount = computed(() => notificacoes.value.filter((item) => !item.lida).length)

  async function buscarNotificacoes() {
    loading.value = true
    error.value = ''
    try {
      notificacoes.value = await fetchAllPages('/api/notificacoes/')
    } catch (err) {
      notificacoes.value = []
      error.value = err.response?.data?.detail || 'Não foi possível carregar as notificações.'
    } finally { loading.value = false }
  }

  async function marcarComoLida(id) {
    try {
      const { data } = await api.patch(`/api/notificacoes/${id}/`, { lida: true })
      const item = notificacoes.value.find((notificacao) => notificacao.id === id)
      if (item) Object.assign(item, data)
    } catch (err) { error.value = 'Não foi possível atualizar a notificação.' }
  }

  async function marcarTodasComoLidas() {
    try {
      await api.post('/api/notificacoes/marcar-todas-lidas/')
      notificacoes.value.forEach((item) => { item.lida = true })
    } catch (err) { error.value = 'Não foi possível marcar as notificações.' }
  }

  async function removerNotificacao(id) {
    try {
      await api.delete(`/api/notificacoes/${id}/`)
      notificacoes.value = notificacoes.value.filter((item) => item.id !== id)
    } catch (err) { error.value = 'Não foi possível excluir a notificação.' }
  }

  return { notificacoes, loading, error, naoLidasCount, buscarNotificacoes, marcarComoLida, marcarTodasComoLidas, removerNotificacao }
})
