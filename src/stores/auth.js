import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

// Configuração base do Axios para evitar repetir a URL do Django em todo lugar
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Action de Cadastro integrada ao Django
   */
  async function register(dadosCadastro) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/registro/', {
        email: dadosCadastro.email,
        name: dadosCadastro.nome,
        password: dadosCadastro.senha,
      });
      return true;
    } catch (err) {
      const data = err.response?.data;
      if (data?.email) error.value = data.email[0];
      else if (data?.password) error.value = `Senha: ${data.password[0]}`;
      else error.value = data?.detail || 'Erro ao realizar o cadastro.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Action de Login
   */
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
      if (response.data.refresh) localStorage.setItem('refresh_token', response.data.refresh);

      return true;
    } catch (err) {
      error.value = err.response?.data?.detail || 'E-mail ou senha incorretos.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * NOVO: Solicita o envio do e-mail de recuperação para o Django
   */
  async function enviarEmailRecuperacao(emailValue) {
    loading.value = true;
    error.value = null;
    try {
      // Ajuste o endpoint '/recuperar-senha/' caso seja diferente no seu urls.py do Django
      await api.post('/recuperar-senha/', { email: emailValue });
      return true;
    } catch (err) {
      error.value = err.response?.data?.detail || 'E-mail não encontrado ou erro no servidor.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * NOVO: Envia a nova senha definitiva para o Django salvar
   */
  async function atualizarSenha(emailValue, novaSenha) {
    loading.value = true;
    error.value = null;
    try {
      // Ajuste o endpoint '/mudar-senha/' conforme definido no Django
      await api.post('/mudar-senha/', { 
        email: emailValue, 
        password: novaSenha 
      });
      return true;
    } catch (err) {
      error.value = err.response?.data?.detail || 'Erro ao redefinir a senha.';
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
  }

  return {
    usuario,
    token,
    loading,
    error,
    register,
    login,
    logout,
    enviarEmailRecuperacao,
    atualizarSenha
  };
});