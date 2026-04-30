<script setup>
import SideBarComponent from './components/SideBarComponent.vue';
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <SideBarComponent />
    </aside>
  
  <!-- Wrapper do conteúdo -->
    <div class="content-wrapper">
      <!-- Header com busca e perfil -->

      <!-- Conteúdo central -->
      <main class="main-content">
        <Router-View />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Sidebar fixa */
.sidebar {
  width: 220px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 800;
}
.content-wrapper {
  flex: 1;
  margin-left: 270px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Conteúdo */
.main-content {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}
</style>
