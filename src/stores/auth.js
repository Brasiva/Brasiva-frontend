import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

function usuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem('usuario') || 'null')
  } catch {
    localStorage.removeItem('usuario')
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(usuarioSalvo())
  const loading = ref(false)
  const error = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  function logout() {
    usuario.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.removeItem('usuario')
  }

  async function me() {
    try {
      const { data } = await api.get('/api/usuarios/me/')
      usuario.value = data
      localStorage.setItem('usuario', JSON.stringify(data))
      return true
    } catch {
      usuario.value = null
      localStorage.removeItem('usuario')
      return false
    }
  }

  async function login(email, senha) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/api/token/', { email, password: senha })
      token.value = data.access
      localStorage.setItem('token', data.access)
      if (data.refresh) localStorage.setItem('refresh', data.refresh)

      if (!(await me()) || !usuario.value?.is_staff) {
        logout()
        error.value = 'Este acesso é restrito à equipe Brasiva.'
        return false
      }
      return true
    } catch (err) {
      logout()
      error.value = err.response?.data?.detail || err.response?.data?.message || 'Email ou senha incorretos.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(dados) {
    loading.value = true
    error.value = null
    try {
      await api.post('/api/registro/', { name: dados.nome, email: dados.email, password: dados.senha })
      return true
    } catch (err) {
      const data = err.response?.data
      error.value = data?.detail || data?.email?.[0] || data?.password?.[0] || 'Erro ao cadastrar.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(dados) {
    loading.value = true
    error.value = null
    try {
      const payload = { name: dados.nome, email: dados.email }
      if (dados.foto) {
        const imagem = new FormData()
        imagem.append('file', dados.foto)
        imagem.append('description', dados.nome || '')
        const { data } = await api.post('/api/media/images/', imagem, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        payload.foto_attachment_key = data.attachment_key
      }
      const { data } = await api.patch('/api/usuarios/me/', payload)
      usuario.value = data
      localStorage.setItem('usuario', JSON.stringify(data))
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || err.response?.data?.message || 'Erro ao atualizar o perfil.'
      return false
    } finally {
      loading.value = false
    }
  }

  return { usuario, loading, error, token, login, me, register, updateProfile, logout }
})
