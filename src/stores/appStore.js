import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // Foto de perfil padrão para os pedidos
  const fotoPerfilPadrao = 'https://i.imgur.com/6VBx3io.png'; // Substitua pelo caminho local se tiver

  // Lista de Pedidos Disponíveis (Não aceitos ainda)
  const pedidos = ref([
    {
      id: '0001',
      cliente: 'Giovana Rosa',
      fotoCliente: fotoPerfilPadrao,
      dataPedido: '16/07/2026 19:00',
      orcamento: 'R$ 22.023,10',
      tipo: 'Aniversário',
      dataHora: '28/07/2026 19:00',
      dataISO: '2026-07-28',
      pessoas: 50,
      endereco: 'Rua XXX'
    },
    {
      id: '0002',
      cliente: 'Giovana Rosa',
      fotoCliente: fotoPerfilPadrao,
      dataPedido: '16/07/2026',
      orcamento: 'R$ 22.023,10',
      tipo: 'Aniversário',
      dataHora: '28/07/2026 19:00',
      dataISO: '2026-07-28',
      pessoas: 50,
      endereco: 'Rua XXX'
    },
    {
      id: '0003',
      cliente: 'Giovana Rosa',
      fotoCliente: fotoPerfilPadrao,
      dataPedido: '16/07/2026',
      orcamento: 'R$ 22.023,10',
      tipo: 'Aniversário',
      dataHora: '28/07/2026 19:00',
      dataISO: '2026-07-28',
      pessoas: 50,
      endereco: 'Rua XXX'
    }
  ]);

  // Lista de Eventos CONFIRMADOS (Aparecem na tela de Eventos e no Calendário)
  const eventos = ref([
    {
      id: '0101',
      tipo: 'Aniversário',
      orcamento: 'R$ 12.000,00',
      cliente: 'Giovana Rosa',
      contato: '(47) 9999-9999',
      pessoas: 40,
      dataHora: '17/07/2026 19:00',
      dataISO: '2026-07-17',
      hora: '19:00',
      endereco: 'Rua Central, 120 - Joinville, SC',
      cardapio: ['0.5kg Salmão Grelhado', '2kg Picanha'],
      funcionarios: ['Thayná - Cozinheira']
    },
    {
      id: '0102',
      tipo: 'Casamento',
      orcamento: 'R$ 25.500,00',
      cliente: 'Mariana Lima',
      contato: '(47) 9888-8888',
      pessoas: 100,
      dataHora: '17/07/2026 17:00',
      dataISO: '2026-07-17',
      hora: '17:00',
      endereco: 'Estrada Das Flores, 50 - Joinville, SC',
      cardapio: ['Buffet Completo', 'Mesa de Doces'],
      funcionarios: ['Luiza - Cozinheira', 'Thayná - Cozinheira']
    },
    {
      id: '0103',
      tipo: 'Corporativo',
      orcamento: 'R$ 8.200,00',
      cliente: 'Empresa Tech',
      contato: '(47) 3434-0000',
      pessoas: 30,
      dataHora: '17/07/2026 21:00',
      dataISO: '2026-07-17',
      hora: '21:00',
      endereco: 'Rua Blumenau, 300 - Joinville, SC',
      cardapio: ['Finger Foods', 'Drinks'],
      funcionarios: ['Carlos - Garçom']
    },
    {
      id: '0104',
      tipo: 'Formatura',
      orcamento: 'R$ 18.000,00',
      cliente: 'Comissão Formatura',
      contato: '(47) 9777-7777',
      pessoas: 80,
      dataHora: '17/07/2026 22:00',
      dataISO: '2026-07-17',
      hora: '22:00',
      endereco: 'Rua XV de Novembro, 1000 - Joinville, SC',
      cardapio: ['Jantar Completo'],
      funcionarios: ['Equipe Completa']
    }
  ]);

  // Função para saber a cor pastel do evento APENAS DEPOIS DE ACEITO/CONFIRMADO
  function getCorEvento(tipo) {
    const tp = tipo?.toLowerCase() || '';
    if (tp.includes('aniversário') || tp.includes('aniversario')) return '#90caf9';
    if (tp.includes('casamento')) return '#f8bbd0';
    if (tp.includes('corporativo')) return '#c8e6c9';
    return '#e0e0e0';
  }

  // Ao aceitar um pedido, ele vira um Evento e passa a ter cor no calendário!
  function aceitarPedido(pedido) {
    pedidos.value = pedidos.value.filter(p => p.id !== pedido.id);
    eventos.value.push({
      ...pedido,
      contato: '(47) 99999-9999',
      cardapio: ['A definir'],
      funcionarios: ['A alocar'],
      hora: pedido.dataHora.split(' ')[1] || '19:00'
    });
  }

  function recusarPedido(id) {
    pedidos.value = pedidos.value.filter(p => p.id !== id);
  }

  return {
    pedidos,
    eventos,
    getCorEvento,
    aceitarPedido,
    recusarPedido
  };
});
