<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <h2>BRASIVA</h2>
      </div>
      
      <nav class="sidebar-menu">
        <router-link to="/home" class="menu-item">Página Inicial</router-link>
        <router-link to="/calendario" class="menu-item">Calendário</router-link>
        <router-link to="/cardapio" class="menu-item">Cardápio</router-link>
        <router-link to="/estoque" class="menu-item">Estoque</router-link>
        <router-link to="/funcionarios" class="menu-item">Funcionários</router-link>
        <router-link to="/orcamento" class="menu-item">Orçamento</router-link>
      </nav>
    </aside>

    <main class="dashboard-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.sidebar {
  width: 260px; /* Largura fixa do menu */
  background-color: #d97706; /* Laranja do protótipo */
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.dashboard-content {
  flex: 1; /* Ocupa todo o resto da tela */
  background-color: #fffaf0; /* Cor de fundo clara do protótipo */
  overflow-y: auto; /* Se o conteúdo for grande, gera scroll só aqui */
  padding: 30px;
}

/* Dica para o CSS do menu */
.menu-item {
  display: block;
  padding: 12px;
  color: white;
  text-decoration: none;
  margin-bottom: 8px;
  border-radius: 6px;
}

/* Quando a rota estiver ativa, o Vue muda o estilo automaticamente */
.router-link-active {
  background-color: white;
  color: #d97706;
  font-weight: bold;
}
</style>