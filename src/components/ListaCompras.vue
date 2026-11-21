<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal">
      <button class="close" @click="$emit('fechar')">×</button>

      <div class="header">
        <div class="icon">
          <span class="material-symbols-outlined">shopping_cart</span>
        </div>
        <div>
          <h2>Lista de compras</h2>
          <p>Produtos que precisam ser repostos</p>
        </div>
      </div>

      <div v-if="itens.length" class="lista">
        <div v-for="item in itens" :key="item.id" class="item">
          <div>
            <strong>{{ item.nome }}</strong>
            <small>{{ item.categoria }}</small>
          </div>

          <div class="quantidade">
            <span>Comprar</span>
            <strong>{{ item.comprar }} {{ item.unidade }}</strong>
          </div>
        </div>
      </div>

      <div v-else class="vazio">
        <span class="material-symbols-outlined">check_circle</span>
        <h3>Estoque em dia!</h3>
        <p>Nenhum produto precisa ser comprado.</p>
      </div>

      <div class="footer">
        <span v-if="itens.length">
          {{ itens.length }} {{ itens.length === 1 ? 'item' : 'itens' }}
        </span>

        <div>
          <button class="cancelar" @click="$emit('fechar')">
            Fechar
          </button>

          <button
            v-if="itens.length"
            class="pdf"
            @click="gerarPDF"
          >
            <span class="material-symbols-outlined">picture_as_pdf</span>
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { jsPDF } from 'jspdf'

const props = defineProps({
  produtos: {
    type: Array,
    default: () => []
  },
  mostrar: {
    type: Boolean,
    default: false
  }
})

defineEmits(['fechar'])

const itens = computed(() =>
  props.produtos
    .filter(p => p.quantidade <= p.minimo)
    .map(p => ({
      ...p,
      comprar: Math.max(p.minimo - p.quantidade, 0)
    }))
    .filter(p => p.comprar > 0)
)

function gerarPDF() {
  const pdf = new jsPDF()

  pdf.setFontSize(20)
  pdf.text('BRASIVA', 20, 20)

  pdf.setFontSize(15)
  pdf.text('Lista de Compras', 20, 31)

  pdf.setFontSize(9)
  pdf.text(
    `Data: ${new Date().toLocaleDateString('pt-BR')}`,
    20,
    39
  )

  let y = 55

  pdf.setFontSize(10)
  pdf.setFont(undefined, 'bold')
  pdf.text('Produto', 20, y)
  pdf.text('Categoria', 90, y)
  pdf.text('Comprar', 150, y)

  pdf.setFont(undefined, 'normal')
  y += 8

  itens.value.forEach(item => {
    pdf.text(item.nome, 20, y)
    pdf.text(item.categoria, 90, y)
    pdf.text(`${item.comprar} ${item.unidade}`, 150, y)
    y += 8

    if (y > 275) {
      pdf.addPage()
      y = 20
    }
  })

  y += 8

  pdf.setFont(undefined, 'bold')
  pdf.text(`Total de itens: ${itens.value.length}`, 20, y)

  pdf.save('lista-de-compras.pdf')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, .55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.modal {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  position: relative;
  box-sizing: border-box;
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f3f3f3;
  color: #666;
  font-size: 22px;
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-right: 35px;
}

.icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: #fff3e0;
  color: #ef8c00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header h2 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.header p {
  margin: 3px 0 0;
  color: #999;
  font-size: .7rem;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 10px;
}

.item strong {
  display: block;
  color: #333;
  font-size: .82rem;
}

.item small {
  color: #999;
  font-size: .65rem;
}

.quantidade {
  text-align: right;
}

.quantidade span {
  display: block;
  color: #999;
  font-size: .6rem;
}

.quantidade strong {
  color: #ef8c00;
  font-size: .8rem;
}

.vazio {
  text-align: center;
  padding: 30px 10px;
}

.vazio .material-symbols-outlined {
  color: #43a047;
  font-size: 42px;
}

.vazio h3 {
  margin: 8px 0 4px;
  color: #333;
  font-size: .95rem;
}

.vazio p {
  margin: 0;
  color: #999;
  font-size: .7rem;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.footer > span {
  color: #999;
  font-size: .7rem;
}

.footer div {
  display: flex;
  gap: 8px;
}

.cancelar,
.pdf {
  height: 40px;
  padding: 0 14px;
  border: none;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
}

.cancelar {
  background: #f0f0f0;
  color: #555;
}

.pdf {
  background: #90caf9;
  color: #18344a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pdf .material-symbols-outlined {
  font-size: 18px;
}

@media (max-width: 500px) {
  .modal {
    padding: 18px;
  }

  .footer {
    align-items: stretch;
    flex-direction: column;
  }

  .footer div {
    width: 100%;
  }

  .cancelar,
  .pdf {
    flex: 1;
  }
}
</style>
