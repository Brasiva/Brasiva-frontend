import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const token = ref(localStorage.getItem('token') || '')

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

  async function updateProfile(dados) {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()

      formData.append('nome', dados.nome)
      formData.append('email', dados.email)

      if (dados.foto) {
        formData.append('foto', dados.foto)
      }

      const response = await api.patch('/api/usuarios/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      usuario.value = response.data

      return true
    } catch (err) {
      error.value =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Erro ao atualizar o perfil.'

      return false
    } finally {
      loading.value = false
    }
  }

async function register(dados) {
  loading.value = true
  error.value = null

  try {
    await api.post('/api/registro/', {
      nome: dados.nome,
      email: dados.email,
      password: dados.senha,
    })

    return true
  } catch (err) {
    console.log('Erro no cadastro:', err.response?.data)
    const data = err.response?.data
    error.value =
      data?.detail ||
      data?.email?.[0] ||
      data?.password?.[0] ||
      'Erro ao cadastrar.'

    return false
  } finally {
    loading.value = false
  }
}

async function login(email, senha) {
  loading.value = true
  error.value = null

  try {
    const response = await api.post('/api/token/', {
      email: email,
      password: senha,
    })

    token.value = response.data.access
    localStorage.setItem('token', response.data.access)
    localStorage.setItem('refresh', response.data.refresh)

    return true
  } catch (err) {
    error.value = err.response?.data?.detail || 'Email ou senha incorretos.'

    return false
  } finally {
    loading.value = false
  }
}

  function logout() {
    usuario.value = null
    token.value = ''

    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return {
    usuario,
    loading,
    error,
    token,
    me,
    updateProfile,
    register,
    login,
    logout,
  }
})
