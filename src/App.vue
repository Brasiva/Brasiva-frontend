<template>
  <router-view />
</template>

<script setup>
// Não é necessário importar componentes aqui, o Router cuida disso!
</script>

<style>
/* Estilos globais para resetar margens e ocupar a tela cheia */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html, #app {
  width: 100%;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  overflow: hidden;
}
</style>