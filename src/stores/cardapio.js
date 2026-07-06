import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios'; // Mude para o seu arquivo de configuração caso use './src/services/api'

const STORAGE_KEY = 'brasiva-cardapio-items';

export const useCardapioStore = defineStore('cardapio', () => {
  
  // 1. FUNÇÃO AUXILIAR: Carrega os dados locais caso esteja offline
  function loadInitialData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Dados padrão caso o app seja aberto pela primeira vez sem internet
    return [
      { id: 1, nome: 'Prato A - Costela na Brasa', preco: 45.90, categoria: 'Prato Principal' },
      { id: 2, nome: 'Prato B - Hambúrguer Artesanal', preco: 32.00, categoria: 'Lanches' }
    ];
  }

  // 2. ESTADO (STATE)
  const pratos = ref(loadInitialData());
  const carregando = ref(false);
  const erro = ref(null);

  // 3. MONITORAMENTO (WATCHER): Salva no localStorage automaticamente a cada mudança
  watch(
    pratos,
    (newPratos) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPratos));
    },
    { deep: true }
  );

  // 4. FUNÇÕES DE SINCRO E AÇÕES (ACTIONS)
  
  // Busca a lista atualizada do backend
  async function buscarPratosDoServidor() {
    carregando.value = true;
    erro.value = null;
    try {
      const response = await axios.get('/api/cardapio'); // Ajuste a rota da sua API aqui
      pratos.value = response.data;
    } catch (err) {
      console.warn("Modo Offline: Não foi possível sincronizar com o servidor. Usando dados locais.");
      erro.value = "Você está visualizando a versão offline do cardápio.";
    } finally {
      carregando.value = false;
    }
  }

  // Adiciona um novo prato (Envia pro back e atualiza o local)
  async function adicionarPrato(novoPrato) {
    try {
      // 1. Envia para o backend salvar no banco de dados
      const response = await axios.post('/api/cardapio', novoPrato);
      // 2. Adiciona o retorno do backend (já com o ID oficial do banco) na nossa lista local
      pratos.value.push(response.data);
    } catch (err) {
      console.error("Erro ao salvar o prato no servidor:", err);
      // Fallback opcional: Se quiser permitir criar offline, descomente as linhas abaixo:
      /*
      pratos.value.push({
        id: Date.now(),
        ...novoPrato
      });
      */
      throw err; // Repassa o erro para o componente tratar (ex: mostrar um alerta na tela)
    }
  }

  // Remove um prato do sistema
  async function removerPrato(id) {
    try {
      await axios.delete(`/api/cardapio/${id}`);
      pratos.value = pratos.value.filter(p => p.id !== id);
    } catch (err) {
      console.error("Não foi possível deletar o prato no servidor:", err);
      throw err;
    }
  }

  // Retorna tudo para que os componentes Vue consigam acessar
  return {
    pratos,
    carregando,
    erro,
    buscarPratosDoServidor,
    adicionarPrato,
    removerPrato
  };
});