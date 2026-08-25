<template>
  <div class="pedido-card">
    <div class="card-header">
      <div class="user-avatar"></div>
      <div>
        <h4>{{ pedido.cliente }}</h4>
        <small>{{ pedido.dataCriacao }}</small>
      </div>
    </div>

    <div class="info-block main-val">
      <small>Valor do orçamento</small>
      <strong>{{ pedido.orcamento }}</strong>
    </div>

    <div class="info-row">
      <div class="info-block"><small>Tipo</small><span>{{ pedido.tipo }}</span></div>
      <div class="info-block"><small>Data e hora</small><span>{{ pedido.dataHora }}</span></div>
    </div>

    <div class="info-row">
      <div class="info-block"><small>Número de pessoas</small><span>{{ pedido.pessoas }}</span></div>
      <div class="info-block"><small>Endereço</small><span>{{ pedido.endereco }}</span></div>
    </div>

    <button class="btn-acessar" @click="$emit('selecionar', pedido)">
      Acessar Pedido →
    </button>
  </div>
</template>

<script setup>
defineProps({
  pedido: Object
});
</script>

<style scoped>
.pedido-card { background: #fff; border-radius: 15px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-header { display: flex; gap: 10px; margin-bottom: 12px; }
.user-avatar { width: 35px; height: 35px; background: #c4c4c4; border-radius: 50%; }
.info-block { background: #f9f9f9; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; flex: 1; }
.info-block small { display: block; color: #888; font-size: 10px; }
.info-row { display: flex; gap: 10px; }
.btn-acessar { width: 100%; background: #ff8a00; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; }
</style>
