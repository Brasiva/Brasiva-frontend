import { defineStore } from 'pinia'
import axios from 'axios'

// URL exata baseada no teu arquivo urls.py do Django
const API_URL = `${import.meta.env.VITE_API_URL}/api/funcionarios/`; 

export const useFuncionarioStore = defineStore('funcionarios', {
  state: () => ({
    funcionarios: [],
    carregando: false,
    erro: null
  }),

  actions: {
    // 1. BUSCAR TODOS OS FUNCIONÁRIOS
    async buscarFuncionarios() {
      this.carregando = true
      this.erro = null
      try {
        const resposta = await axios.get(API_URL)
        this.funcionarios = resposta.data
      } catch (err) {
        this.erro = 'Erro ao carregar a lista de funcionários.'
        console.error('Erro no GET:', err)
      } finally {
        this.carregando = false
      }
    },

    // 2. ADICIONAR NOVO FUNCIONÁRIO (COM FOTO)
    async adicionarFuncionario(dadosForm) {
      this.carregando = true
      this.erro = null
      try {
        // Criação do FormData obrigatória para envio de ficheiros/media
        const formData = new FormData()
        formData.append('nome', dadosForm.nome)
        formData.append('cargo', dadosForm.cargo)
        formData.append('salario', dadosForm.salario)
        
        // Verifica se existe um ficheiro binário real de imagem
        if (dadosForm.foto instanceof File) {
          formData.append('foto', dadosForm.foto)
        }

        const resposta = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        // Adiciona o novo funcionário retornado pelo Django à lista local do Pinia
        this.funcionarios.push(resposta.data)
        return resposta.data
      } catch (err) {
        this.erro = 'Erro ao cadastrar o funcionário no servidor.'
        console.error('Erro no POST:', err)
        throw err
      } finally {
        this.carregando = false
      }
    },

    // 3. ATUALIZAR FUNCIONÁRIO EXISTENTE (PUT)
    async atualizarFuncionario(id, dadosForm) {
      this.carregando = true
      this.erro = null
      try {
        const formData = new FormData()
        formData.append('nome', dadosForm.nome)
        formData.append('cargo', dadosForm.cargo)
        formData.append('salario', dadosForm.salario)
        
        // Apenas envia o campo foto se o utilizador tiver escolhido um novo ficheiro
        if (dadosForm.foto instanceof File) {
          formData.append('foto', dadosForm.foto)
        }

        const resposta = await axios.put(`${API_URL}${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Atualiza o objeto modificado dentro do Array do estado local do Pinia
        const index = this.funcionarios.findIndex(f => f.id === id)
        if (index !== -1) {
          this.funcionarios[index] = resposta.data
        }
        return resposta.data
      } catch (err) {
        this.erro = 'Erro ao atualizar os dados do funcionário.'
        console.error('Erro no PUT:', err)
        throw err
      } finally {
        this.carregando = false
      }
    },

    // 4. REMOVER FUNCIONÁRIO (DELETE)
    async removerFuncionario(id) {
      this.erro = null
      try {
        await axios.delete(`${API_URL}${id}/`)
        // Filtra a lista local para remover instantaneamente da tela
        this.funcionarios = this.funcionarios.filter(f => f.id !== id)
      } catch (err) {
        this.erro = 'Erro ao remover o funcionário.'
        console.error('Erro no DELETE:', err)
        throw err
      }
    }
  }
})