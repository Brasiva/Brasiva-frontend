import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  async function login(email, senha) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/token/', {
        email,
        password: senha,
      })

      token.value = response.data.access

      localStorage.setItem('token', response.data.access)

      if (response.data.refresh) {
        localStorage.setItem('refresh', response.data.refresh)
      }

      await me()

      if (!usuario.value?.is_staff) {
        logout()
        error.value = 'Este acesso é restrito à equipe Brasiva.'
        return false
      }

      localStorage.setItem('usuario', JSON.stringify(usuario.value))

      return true
    } catch (err) {
      error.value =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Email ou senha incorretos.'

      return false
    } finally {
      loading.value = false
    }
  }

  async function me() {
    try {
      const response = await api.get('/api/usuarios/me/')
      usuario.value = response.data

      localStorage.setItem('usuario', JSON.stringify(response.data))

      return true
    } catch (err) {
      usuario.value = null
      return false
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
        imagem.append('description', dados.nome)
        const upload = await api.post('/api/media/images/', imagem, { headers: { 'Content-Type': 'multipart/form-data' } })
        payload.foto_attachment_key = upload.data.attachment_key
      }
      const response = await api.patch('/api/usuarios/me/', payload)

      usuario.value = response.data

      localStorage.setItem('usuario', JSON.stringify(response.data))

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
      name: dados.nome,
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

    const perfil = await api.get('/api/usuarios/me/', {
      headers: { Authorization: `Bearer ${response.data.access}` },
    })

    usuario.value = perfil.data
    localStorage.setItem('usuario', JSON.stringify(perfil.data))

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
    localStorage.removeItem('refresh')
    localStorage.removeItem('usuario')
  }

  return {
    usuario,
    loading,
    error,
    token,
    login,
    me,
    updateProfile,
    register,
    login,
    logout,
  }
})
