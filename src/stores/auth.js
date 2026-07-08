import { defineStore } from 'pinia';
import { ref } from 'vue';

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
      // Usando a rota exata definida no seu urls.py do Django (com barra no final!)
      const response = await fetch('http://localhost:8000/api/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // O seu Django espera 'email', 'name' e 'password' baseado no UserRegistrationSerializer
        body: JSON.stringify({
          email: dadosCadastro.email,
          name: dadosCadastro.nome,
          password: dadosCadastro.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Trata os erros de validação comuns do Django (ex: se o email já existe)
        if (data.email) throw new Error(data.email[0]);
        if (data.password) throw new Error(`Senha: ${data.password[0]}`);
        throw new Error(data.detail || 'Erro ao realizar o cadastro.');
      }

      return true;
    } catch (err) {
      error.value = err.message || 'Falha na conexão com o servidor.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Action de Login integrada ao TokenObtainPairView do Django
   */
  async function login(email, senha) {
    loading.value = true;
    error.value = null;

    try {
      // Usando a rota de token JWT do seu urls.py
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'E-mail ou senha incorretos.');
      }

      // Guarda o token de acesso (e atualiza o estado)
      token.value = data.access;
      localStorage.setItem('token', data.access);

      // Opcional: Se seu backend usa refresh token, pode guardar também
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

      return true;
    } catch (err) {
      error.value = err.message || 'Erro ao realizar login.';
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
    logout
  };
});
