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

        const lista = Array.isArray(resposta.data)
          ? resposta.data
          : (resposta.data.results || []);

        this.funcionarios = lista;
      } catch (err) {
        console.error("Erro ao buscar funcionários:", err.response?.data || err);
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

      try {
        const resposta = await api.post("/media/images/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return resposta.data.attachment_key;
      } catch (err) {
        console.error("ERRO UPLOAD FOTO:", err.response?.data || err);
        throw err;
      }
    },

    // ============================
    // HELPER: PREPARAR PAYLOAD
    // ============================
    prepararPayload(dadosForm, attachmentKey = null) {
      // 1. Mantém apenas os dígitos numéricos (remove +, parênteses, traços e espaços)
      const apenasNumeros = dadosForm.telefone
        ? String(dadosForm.telefone).replace(/\D/g, "")
        : "";

      // 2. Se a string começar com 55 e tiver 13 dígitos, remove o 55 para deixar só o DDD + Número (11 dígitos)
      let telefoneLimpo = apenasNumeros;
      if (apenasNumeros.length === 13 && apenasNumeros.startsWith("55")) {
        telefoneLimpo = apenasNumeros.slice(2);
      }

      // 3. Garante que pagamento seja enviado como número float/decimal
      const pagamentoNumero = dadosForm.pagamento
        ? parseFloat(String(dadosForm.pagamento).replace(",", "."))
        : 0;

      const payload = {
        nome: dadosForm.nome,
        cargo: dadosForm.cargo,
        telefone: dadosForm.telefone || "", // Envia exatamente "(47) 99999-9999"
        pagamento: pagamentoNumero,
      };

      // Inclui a foto apenas se houve upload bem-sucedido
      if (attachmentKey) {
        payload.foto_attachment_key = attachmentKey;
      }

      return payload;
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

        const payload = this.prepararPayload(dadosForm, attachmentKey);

        const resposta = await api.post("/funcionarios/", payload);

        if (Array.isArray(this.funcionarios)) {
          this.funcionarios.push(resposta.data);
        } else {
          await this.buscarFuncionarios();
        }

        return resposta.data;
      } catch (err) {
        console.error("DETALHES DO ERRO DA API (400):", err.response?.data);

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

        const payload = this.prepararPayload(dadosForm, attachmentKey);

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
        } else {
          await this.buscarFuncionarios();
        }

        return resposta.data;
      } catch (err) {
        console.error("DETALHES DO ERRO DA API (400):", err.response?.data);

        this.erro =
          err.response?.data ||
          "Erro ao atualizar funcionário.";

        throw err;
      } finally {
        this.carregando = false;
      }
    },

    // ============================
    // REMOVER FUNCIONÁRIO
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
        console.error("Erro ao remover funcionário:", err.response?.data || err);

        this.erro = "Erro ao excluir funcionário.";

        throw err;
      }
    },
  },
});
