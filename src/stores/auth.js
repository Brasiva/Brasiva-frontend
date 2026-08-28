import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const usuario = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // Buscar dados do usuário logado
  async function me() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/api/usuarios/me/')
      usuario.value = response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Erro ao carregar dados do usuário.'
    } finally {
      loading.value = false
    }
  }

  // Atualizar perfil do usuário
  async function updateProfile(dados) {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('nome', dados.nome)
      formData.append('email', dados.email)

      // Anexa a imagem apenas se um arquivo foi selecionado
      if (dados.foto) {
        formData.append('foto', dados.foto)
      }

      const response = await api.patch('/api/usuarios/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Atualiza o estado com a resposta atualizada da API
      usuario.value = response.data
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || err.response?.data?.message || 'Erro ao atualizar o perfil.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    usuario,
    loading,
    error,
    token,
    me,
    updateProfile,
  }
})
