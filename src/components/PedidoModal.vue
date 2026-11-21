<template>
  <div class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('fechar')">✕</button>

      <h2>#{{ pedido.id }} - {{ pedido.tipo }}</h2>

      <div class="grid-details">
        <div class="info-block"><small>Valor do orçamento</small><strong>{{ pedido.orcamento }}</strong></div>
        <div class="info-block"><small>Contato</small><span>{{ pedido.contato }}</span></div>
        <div class="info-block"><small>Número de pessoas</small><span>{{ pedido.pessoas }}</span></div>
        <div class="info-block"><small>Data e hora</small><span>{{ pedido.dataHora }}</span></div>
        <div class="info-block full-width"><small>Endereço</small><span>{{ pedido.endereco }}</span></div>
      </div>

      <div class="lists-container">
        <div class="list-box">
          <h4>Cardápio</h4>
          <ul><li v-for="(item, i) in pedido.cardapio" :key="i">✓ {{ item }}</li></ul>
        </div>
        <div class="list-box">
          <h4>Funcionários disponíveis</h4>
          <ul><li v-for="(func, i) in pedido.funcionarios" :key="i">✓ {{ func }}</li></ul>
        </div>
      </div>

      <div class="info-block full-width">
        <small>Observações</small>
        <span>{{ pedido.observacoes }}</span>
      </div>

      <div class="modal-actions">
        <button class="btn-recusar" @click="recusar">Recusar Pedido</button>
        <button class="btn-aceitar" @click="aceitar">Aceitar Pedido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore.js';

const props = defineProps({ pedido: Object });
const emit = defineEmits(['fechar']);
const appStore = useAppStore();

function aceitar() {
  appStore.aceitarPedido(props.pedido.id);
  emit('fechar');
}

function recusar() {
  appStore.recusarPedido(props.pedido.id);
  emit('fechar');
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #fff; padding: 30px; border-radius: 20px; width: 650px; position: relative; }
.close-btn { position: absolute; right: 20px; top: 20px; border: none; background: transparent; cursor: pointer; font-size: 18px; }
.grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
.full-width { grid-column: span 2; }
.lists-container { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.list-box { background: #f9f9f9; padding: 15px; border-radius: 10px; }
.list-box ul { list-style: none; padding: 0; margin: 5px 0 0 0; font-size: 13px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.btn-recusar { background: #a92929; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn-aceitar { background: #27ae60; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
</style>
