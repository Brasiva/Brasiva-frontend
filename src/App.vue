<template>
  <OfflineBanner />
  <router-view />
</template>

<script setup>
import OfflineBanner from './components/OfflineBanner.vue';
</script>

<style>
/* Seus estilos globais permanecem iguais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* ... */
</style>