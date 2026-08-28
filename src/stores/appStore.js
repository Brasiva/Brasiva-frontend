import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const pedidos = ref([
    {
      id: '0001',
      tipo: 'Casamento',
      orcamento: 'R$ 22.023,10',
      cliente: 'Giovana Rosa',
      contato: '(47) 9999-9999',
      pessoas: 50,
      dataHora: '28/07/2026 19:00 - 20:00',
      dataISO: '2026-07-28',
      hora: '19:00',
      endereco: 'Rua das Bobs, 0 - Centro - Joinville, SC',
      cardapio: ['Buffet completo', 'Mesa de doces'],
      funcionarios: ['Thayná - Cozinheira']
    },
    {
      id: '0002',
      tipo: 'Aniversário',
      orcamento: 'R$ 5.400,00',
      cliente: 'Carlos Eduardo',
      contato: '(47) 9888-8888',
      pessoas: 30,
      dataHora: '17/07/2026 18:00',
      dataISO: '2026-07-17',
      hora: '18:00',
      endereco: 'Av. Brasil, 1500 - Joinville, SC',
      cardapio: ['Jantar completo', 'Bebidas'],
      funcionarios: ['Luiza - Cozinheira']
    },
    {
      id: '0003',
      tipo: 'Corporativo',
      orcamento: 'R$ 8.200,00',
      cliente: 'Empresa Tech',
      contato: '(47) 3434-0000',
      pessoas: 30,
      dataHora: '05/08/2026 21:00',
      dataISO: '2026-08-05',
      hora: '21:00',
      endereco: 'Rua Blumenau, 300 - Joinville, SC',
      cardapio: ['Finger foods', 'Bebidas'],
      funcionarios: ['Carlos - Garçom']
    },
    {
      id: '0005',
      tipo: 'Aniversário',
      orcamento: 'R$ 6.750,00',
      cliente: 'Mariana Souza',
      contato: '(47) 9666-6666',
      pessoas: 45,
      dataHora: '12/08/2026 19:30',
      dataISO: '2026-08-12',
      hora: '19:30',
      endereco: 'Rua das Palmeiras, 250 - Joinville, SC',
      cardapio: ['Jantar', 'Bebidas', 'Mesa de doces'],
      funcionarios: ['Luiza - Cozinheira']
    },
    {
      id: '0006',
      tipo: 'Casamento',
      orcamento: 'R$ 25.800,00',
      cliente: 'Ana e Pedro',
      contato: '(47) 9555-5555',
      pessoas: 100,
      dataHora: '22/08/2026 20:00 - 23:00',
      dataISO: '2026-08-22',
      hora: '20:00',
      endereco: 'Espaço Jardim, 500 - Joinville, SC',
      cardapio: ['Buffet completo', 'Mesa de doces', 'Bebidas'],
      funcionarios: ['Equipe Completa']
    },
    {
      id: '0007',
      tipo: 'Corporativo',
      orcamento: 'R$ 11.200,00',
      cliente: 'Empresa NovaTech',
      contato: '(47) 9444-4444',
      pessoas: 60,
      dataHora: '28/08/2026 18:30',
      dataISO: '2026-08-28',
      hora: '18:30',
      endereco: 'Centro Empresarial, 800 - Joinville, SC',
      cardapio: ['Finger foods', 'Bebidas'],
      funcionarios: ['Carlos - Garçom']
    },
    {
      id: '0008',
      tipo: 'Formatura',
      orcamento: 'R$ 19.500,00',
      cliente: 'Turma 2026',
      contato: '(47) 9333-3333',
      pessoas: 90,
      dataHora: '05/09/2026 21:00',
      dataISO: '2026-09-05',
      hora: '21:00',
      endereco: 'Salão Imperial - Joinville, SC',
      cardapio: ['Jantar completo', 'Bebidas', 'Sobremesa'],
      funcionarios: ['Equipe Completa']
    },
    {
      id: '0009',
      tipo: 'Aniversário',
      orcamento: 'R$ 4.850,00',
      cliente: 'Lucas Martins',
      contato: '(47) 9222-2222',
      pessoas: 25,
      dataHora: '14/09/2026 18:00',
      dataISO: '2026-09-14',
      hora: '18:00',
      endereco: 'Rua Joinville, 120 - Joinville, SC',
      cardapio: ['Jantar', 'Bebidas'],
      funcionarios: ['Thayná - Cozinheira']
    },
    {
      id: '0010',
      tipo: 'Corporativo',
      orcamento: 'R$ 9.900,00',
      cliente: 'Grupo Sul',
      contato: '(47) 9111-1111',
      pessoas: 40,
      dataHora: '20/09/2026 19:00',
      dataISO: '2026-09-20',
      hora: '19:00',
      endereco: 'Rua das Flores, 700 - Joinville, SC',
      cardapio: ['Finger foods', 'Bebidas', 'Café'],
      funcionarios: ['Carlos - Garçom']
    }
  ])

  const eventos = ref([
    {
      id: '0004',
      tipo: 'Formatura',
      orcamento: 'R$ 18.000,00',
      cliente: 'Comissão Formatura',
      contato: '(47) 9777-7777',
      pessoas: 80,
      dataHora: '17/07/2026 22:00',
      dataISO: '2026-07-17',
      hora: '22:00',
      endereco: 'Rua XV de Novembro, 1000 - Joinville, SC',
      cardapio: ['Jantar completo'],
      funcionarios: ['Equipe Completa']
    }
  ])

  const produtos = ref([
    {
      id: 1,
      nome: 'Arroz',
      categoria: 'Alimentos',
      unidade: 'kg',
      quantidade: 35,
      minimo: 10,
      valor: 6.50,
      icone: 'rice_bowl'
    },
    {
      id: 2,
      nome: 'Feijão',
      categoria: 'Alimentos',
      unidade: 'kg',
      quantidade: 8,
      minimo: 10,
      valor: 7.90,
      icone: 'nutrition'
    },
    {
      id: 3,
      nome: 'Refrigerante',
      categoria: 'Bebidas',
      unidade: 'L',
      quantidade: 24,
      minimo: 10,
      valor: 8.50,
      icone: 'local_drink'
    },
    {
      id: 4,
      nome: 'Guardanapos',
      categoria: 'Descartáveis',
      unidade: 'pct',
      quantidade: 0,
      minimo: 5,
      valor: 12.00,
      icone: 'layers'
    },
    {
      id: 5,
      nome: 'Copos descartáveis',
      categoria: 'Descartáveis',
      unidade: 'pct',
      quantidade: 18,
      minimo: 10,
      valor: 9.50,
      icone: 'local_cafe'
    },
    {
      id: 6,
      nome: 'Detergente',
      categoria: 'Materiais',
      unidade: 'un',
      quantidade: 15,
      minimo: 5,
      valor: 3.90,
      icone: 'cleaning_services'
    }
  ])

  const pedidosPendentes = computed(() => pedidos.value.length)

  const eventosAgendados = computed(() => eventos.value.length)

  const totalProdutos = computed(() => produtos.value.length)

  const itensEstoqueBaixo = computed(() => {
    return produtos.value.filter(
      item => Number(item.quantidade) <= Number(item.minimo)
    ).length
  })

  function aceitarPedido(pedido) {
    const index = pedidos.value.findIndex(
      item => item.id === pedido.id
    )

    if (index === -1) {
      return
    }

    const evento = {
      ...pedido
    }

    eventos.value.push(evento)
    pedidos.value.splice(index, 1)
  }

  function recusarPedido(id) {
    pedidos.value = pedidos.value.filter(
      pedido => pedido.id !== id
    )
  }

  function adicionarProduto(produto) {
    produtos.value.push({
      ...produto,
      id: Date.now(),
      icone: produto.icone || getIcone(produto.categoria)
    })
  }

  function atualizarProduto(produto) {
    const index = produtos.value.findIndex(
      item => item.id === produto.id
    )

    if (index !== -1) {
      produtos.value[index] = {
        ...produto
      }
    }
  }

  function excluirProduto(id) {
    produtos.value = produtos.value.filter(
      produto => produto.id !== id
    )
  }

  function getCorEvento(tipo) {
    const tp = tipo?.toLowerCase() || ''

    if (
      tp.includes('aniversário') ||
      tp.includes('aniversario')
    ) {
      return '#90caf9'
    }

    if (tp.includes('casamento')) {
      return '#f8bbd0'
    }

    if (tp.includes('corporativo')) {
      return '#c8e6c9'
    }

    if (tp.includes('formatura')) {
      return '#d1c4e9'
    }

    return '#e0e0e0'
  }

  function getIcone(categoria) {
    if (categoria === 'Alimentos') return 'restaurant'
    if (categoria === 'Bebidas') return 'local_drink'
    if (categoria === 'Descartáveis') return 'layers'

    return 'inventory_2'
  }

  function formatarDataISO(data) {
    if (!data) {
      return ''
    }

    const partes = data.split('-')

    if (partes.length !== 3) {
      return ''
    }

    return `${partes[0]}-${partes[1]}-${partes[2]}`
  }

  return {
    pedidos,
    eventos,
    produtos,
    pedidosPendentes,
    eventosAgendados,
    totalProdutos,
    itensEstoqueBaixo,
    aceitarPedido,
    recusarPedido,
    adicionarProduto,
    atualizarProduto,
    excluirProduto,
    getCorEvento,
    getIcone,
    formatarDataISO
  }
})
