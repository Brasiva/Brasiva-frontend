import { defineStore } from "pinia";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Função auxiliar para formatar o telefone no padrão aceito pela API
function formatarTelefone(telefone) {
  if (!telefone) return "";

  // Remove todos os caracteres não numéricos
  let apenasNumeros = String(telefone).replace(/\D/g, "");

  // Se já tiver + no início ou for padrão válido, ajusta para o formato internacional com +
  if (apenasNumeros.length === 10 || apenasNumeros.length === 11) {
    return `+55${apenasNumeros}`;
  }

  if (apenasNumeros.length === 12 || apenasNumeros.length === 13) {
    return `+${apenasNumeros}`;
  }

  return apenasNumeros;
}

export const useFuncionarioStore = defineStore("funcionarios", {
  state: () => ({
    funcionarios: [],
    carregando: false,
    erro: null,
  }),

  actions: {
    // ============================
    // BUSCAR FUNCIONÁRIOS
    // ============================
    async buscarFuncionarios() {
      this.carregando = true;
      this.erro = null;

      try {
        const resposta = await api.get("/funcionarios/");

        // Trata o retorno para garantir que this.funcionarios seja SEMPRE um Array
        if (Array.isArray(resposta.data)) {
          this.funcionarios = resposta.data;
        } else if (Array.isArray(resposta.data.results)) {
          this.funcionarios = resposta.data.results;
        } else if (Array.isArray(resposta.data.funcionarios)) {
          this.funcionarios = resposta.data.funcionarios;
        } else {
          this.funcionarios = [];
        }
      } catch (err) {
        console.error(err);
        this.erro = "Erro ao carregar funcionários.";
      } finally {
        this.carregando = false;
      }
    },

    // ============================
    // UPLOAD DA FOTO
    // ============================
    async uploadFoto(arquivo, descricao = "") {
      if (!(arquivo instanceof File)) return null;

      const formData = new FormData();
      formData.append("file", arquivo);
      formData.append("description", descricao);

      const resposta = await api.post("/media/images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return resposta.data.attachment_key;
    },

    // ============================
    // CADASTRAR FUNCIONÁRIO
    // ============================
    async adicionarFuncionario(dadosForm) {
      this.carregando = true;
      this.erro = null;

      try {
        let attachmentKey = null;

        if (dadosForm.foto instanceof File) {
          attachmentKey = await this.uploadFoto(
            dadosForm.foto,
            dadosForm.nome
          );
        }

        const payload = {
          nome: dadosForm.nome,
          cargo: dadosForm.cargo,
          telefone: formatarTelefone(dadosForm.telefone),
          pagamento: dadosForm.pagamento,
        };

        if (attachmentKey) {
          payload.foto_attachment_key = attachmentKey;
        }

        const resposta = await api.post("/funcionarios/", payload);

        // Garante que this.funcionarios é um array antes de fazer o push
        if (Array.isArray(this.funcionarios)) {
          this.funcionarios.push(resposta.data);
        } else {
          this.funcionarios = [resposta.data];
        }

        return resposta.data;
      } catch (err) {
        console.error(err.response?.data || err);

        this.erro =
          err.response?.data ||
          "Erro ao cadastrar funcionário.";

        throw err;
      } finally {
        this.carregando = false;
      }
    },

    // ============================
    // ATUALIZAR FUNCIONÁRIO
    // ============================
    async atualizarFuncionario(id, dadosForm) {
      this.carregando = true;
      this.erro = null;

      try {
        let attachmentKey = null;

        if (dadosForm.foto instanceof File) {
          attachmentKey = await this.uploadFoto(
            dadosForm.foto,
            dadosForm.nome
          );
        }

        const payload = {
          nome: dadosForm.nome,
          cargo: dadosForm.cargo,
          telefone: formatarTelefone(dadosForm.telefone),
          pagamento: dadosForm.pagamento,
        };

        if (attachmentKey) {
          payload.foto_attachment_key = attachmentKey;
        }

        const resposta = await api.put(
          `/funcionarios/${id}/`,
          payload
        );

        if (Array.isArray(this.funcionarios)) {
          const index = this.funcionarios.findIndex(
            (f) => f.id === id
          );

          if (index !== -1) {
            this.funcionarios[index] = resposta.data;
          }
        }

        return resposta.data;
      } catch (err) {
        console.error(err.response?.data || err);

        this.erro =
          err.response?.data ||
          "Erro ao atualizar funcionário.";

        throw err;
      } finally {
        this.carregando = false;
      }
    },

    // ============================
    // REMOVER
    // ============================
    async removerFuncionario(id) {
      this.erro = null;

      try {
        await api.delete(`/funcionarios/${id}/`);

        if (Array.isArray(this.funcionarios)) {
          this.funcionarios = this.funcionarios.filter(
            (f) => f.id !== id
          );
        }
      } catch (err) {
        console.error(err);

        this.erro = "Erro ao excluir funcionário.";

        throw err;
      }
    },
  },
});
