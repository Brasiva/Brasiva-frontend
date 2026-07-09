import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEstoqueStore = defineStore('estoque', () => {
  // Mock inicial simulando itens cadastrados no estoque do backend
  const itensEstoque = ref([
    { id: 10, nome: 'Salmão Fresco', unidade: 'kg' },
    { id: 11, nome: 'Feijão Preto', unidade: 'kg' },
    { id: 12, nome: 'Picanha Maturada', unidade: 'kg' },
    { id: 13, nome: 'Arroz Integral', unidade: 'kg' },
    { id: 14, nome: 'Tempero Completo', unidade: 'un' }
  ]);

  return { itensEstoque };
});