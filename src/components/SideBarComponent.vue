<script setup>
</script>

<template>
  <div class="sidebar-comp">
  <div class="title">
    <h1>BRASIVA</h1>
    <h2>Gerenciamento</h2>
  </div>
    <!-- Menu -->
    <nav>
      <ul>
        <li>
          <router-link to="/paginainicial">
            <span>Página Inicial</span>
          </router-link>
        </li>
        <li>
          <router-link to="/calendario">
            <span>Calendário</span>
          </router-link>
        </li>
        <li>
          <router-link to="/cardapio">
            <span>Cardápio</span>
          </router-link>
        </li>
        <li>
          <router-link to="/estoque">
            <span>Estoque</span>
          </router-link>
        </li>
        <li>
          <router-link to="/funcionarios">
            <span>Funcionários</span>
          </router-link>
        </li>
        <li>
          <router-link to="/departamentos">
            <span>Departamentos</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Imbue:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Viga&display=swap');

/* Sidebar container */
.sidebar-comp {
  width: 220px;
  height: 94vh;
  background: #670000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 800;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.3);
  font-family: 'Urbanist', sans-serif;
  padding: 1.5rem 1.5rem;
}
h1 {
  font-family: "Imbue", serif;
  font-size: 3.5rem;
  color: #FFBB00;
  font-weight: 400;
  text-align: center;
}
h2 {
  font-family: "Viga", sans-serif;
  font-size: 1.2rem;
  color: #e4e4e4;
}
/* Menu */
nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
nav li a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: 500;
  margin: 1.3vw 0;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: #ffffff;
}
nav li a span:first-child {
  font-size: 18px;
}
nav li a span:last-child {
  flex: 1;
  text-align: left;
}

nav li a:hover {
  background-color: #FFD69D;
  color: #000;
  box-shadow: 0 0 8px #FFD69D;
}

/* Ativo: link da página atual */
nav li a.router-link-exact-active {
  background-color: #FF9500;
  color: #fff;
  font-weight: 600;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  min-width: 300px;
}
.modal h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #FF9500;
}
.modal-botoes {
  display: flex;
  justify-content: space-around;
}

/* Botões do modal com hover + efeito de levantar */
.modal-botoes button {
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}
</style>