import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);

  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  async function me() {
    if (!token.value) return;

    try {
      const response = await api.get('/me/');
      usuario.value = response.data;
      localStorage.setItem('usuario', JSON.stringify(response.data));
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
    }
  }

  async function updateProfile(dados) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch('/me/', {
        name: dados.nome,
        email: dados.email,
      });

      usuario.value = response.data;
      localStorage.setItem('usuario', JSON.stringify(response.data));

      return true;
    } catch (err) {
      const data = err.response?.data;

      if (data?.email) {
        error.value = data.email[0];
      } else if (data?.name) {
        error.value = data.name[0];
      } else if (data?.detail) {
        error.value = data.detail;
      } else {
        error.value = 'Não foi possível atualizar os dados.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  async function login(emailValue, senha) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/token/', {
        email: emailValue,
        password: senha,
      });

      token.value = response.data.access;
      localStorage.setItem('token', response.data.access);

      api.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access}`;

      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      if (response.data.user) {
        usuario.value = response.data.user;
        localStorage.setItem(
          'usuario',
          JSON.stringify(response.data.user)
        );
      } else {
        await me();
      }

      return true;
    } catch (err) {
      error.value =
        err.response?.data?.detail ||
        'E-mail ou senha incorretos.';

      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(dadosCadastro) {
    loading.value = true;
    error.value = null;

    try {
      await api.post('/registro/', {
        email: dadosCadastro.email,
        name: dadosCadastro.nome,
        password: dadosCadastro.senha,
      });

      return true;
    } catch (err) {
      const data = err.response?.data;

      if (data?.email) {
        error.value = data.email[0];
      } else if (data?.password) {
        error.value = `Senha: ${data.password[0]}`;
      } else {
        error.value =
          data?.detail || 'Erro ao realizar o cadastro.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    usuario.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');

    delete api.defaults.headers.common['Authorization'];
  }

  return {
    usuario,
    token,
    loading,
    error,
    register,
    login,
    me,
    updateProfile,
    logout
  };
});

