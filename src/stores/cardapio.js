import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'brasiva-cardapio-items';

export const useCardapioStore = defineStore('cardapio', () => {

  function loadInitialData() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    return [];
  }

  const pratos = ref(loadInitialData());
  const carregando = ref(false);
  const erro = ref(null);

  watch(
    pratos,
    (novoValor) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novoValor));
    },
    { deep: true }
  );

  // Mantido apenas para não quebrar o componente
  async function buscarPratosDoServidor() {
    carregando.value = false;
    erro.value = null;
  }

  async function adicionarPrato(novoPrato) {
    pratos.value.push({
      id: Date.now(),
      ...novoPrato
    });
  }

  async function removerPrato(id) {
    pratos.value = pratos.value.filter(prato => prato.id !== id);
  }

  return {
    pratos,
    carregando,
    erro,
    buscarPratosDoServidor,
    adicionarPrato,
    removerPrato
  };
});