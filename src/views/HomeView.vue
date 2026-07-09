<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();

const dataHoje = computed(() => {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const irCalendario = () => router.push("/calendario");
const irEstoque = () => router.push("/estoque");
const irCardapio = () => router.push("/cardapio");
const irFuncionarios = () => router.push("/funcionarios");
const irOrcamento = () => router.push("/orcamento");
const irConfig = () => router.push("/config");
</script>

<template>
  <div class="pagina-home">

    <!-- Boas Vindas -->
    <section class="banner">
      <div>
        <h1>
          Bem-vindo!
        </h1>
        <p>{{ dataHoje }}</p>
      </div>

      <div class="icone-banner">
        🔥
      </div>
    </section>

    <!-- Estatísticas -->
    <section class="cards-estatisticas">

      <div class="card-estatistica">
        <span class="icone">📅</span>
        <h2>6</h2>
        <p>Eventos este mês</p>
      </div>

      <div class="card-estatistica">
        <span class="icone">📦</span>
        <h2>32</h2>
        <p>Itens em estoque</p>
      </div>

      <div class="card-estatistica">
        <span class="icone">👨‍🍳</span>
        <h2>12</h2>
        <p>Funcionários</p>
      </div>

      <div class="card-estatistica">
        <span class="icone">💰</span>
        <h2>R$ 8.450</h2>
        <p>Saldo do mês</p>
      </div>

    </section>

    <!-- Conteúdo -->
    <section class="grid-home">

      <div class="card">
        <div class="titulo">
          <h2>📅 Próximos Eventos</h2>
          <button @click="irCalendario">Ver todos</button>
        </div>

        <ul>
          <li>Reunião Geral — 12/07</li>
          <li>Treinamento — 15/07</li>
          <li>Festa Julina — 20/07</li>
        </ul>
      </div>

      <div class="card">
        <div class="titulo">
          <h2>📦 Estoque Baixo</h2>
          <button @click="irEstoque">Ver estoque</button>
        </div>

        <ul>
          <li>Arroz — 2 unidades</li>
          <li>Óleo — 1 unidade</li>
          <li>Feijão — 3 unidades</li>
        </ul>
      </div>

      <div class="card">
        <div class="titulo">
          <h2>🍽 Cardápio de Hoje</h2>
          <button @click="irCardapio">Abrir</button>
        </div>

        <ul>
          <li>Arroz Branco</li>
          <li>Feijão Preto</li>
          <li>Frango Grelhado</li>
          <li>Salada Verde</li>
        </ul>
      </div>

      <div class="card">
        <div class="titulo">
          <h2>💰 Financeiro</h2>
          <button @click="irOrcamento">Detalhes</button>
        </div>

        <ul>
          <li>Receitas: R$ 12.500</li>
          <li>Despesas: R$ 4.050</li>
          <li>Saldo: R$ 8.450</li>
        </ul>
      </div>

      <div class="card grande">
        <div class="titulo">
          <h2>👨‍🍳 Funcionários</h2>
          <button @click="irFuncionarios">Gerenciar</button>
        </div>

        <p>Total cadastrados: <strong>12</strong></p>
        <p>2 aniversários este mês.</p>
        <p>1 funcionário em férias.</p>
      </div>

      <div class="card grande">
        <div class="titulo">
          <h2>⚡ Ações Rápidas</h2>
        </div>

        <div class="acoes">

          <button @click="irCalendario">
            📅 Novo Evento
          </button>

          <button @click="irEstoque">
            📦 Novo Produto
          </button>

          <button @click="irFuncionarios">
            👨‍🍳 Novo Funcionário
          </button>

          <button @click="irConfig">
            ⚙ Configurações
          </button>

        </div>

      </div>

    </section>

  </div>
</template>
<style>
/* ===========================
   HOME - MOBILE FIRST
=========================== */

* {
  box-sizing: border-box;
}

.pagina-home {
  width: 100%;
  min-height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: "Poppins", sans-serif;
}

/* ===========================
   BANNER
=========================== */

.banner {
  width: 100%;
  border-radius: 22px;
  background: linear-gradient(135deg, #ff9800, #ff6d00);
  color: white;
  padding: 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 12px 30px rgba(255, 136, 0, .25);
}

.banner h1 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
}

.banner p {
  margin-top: .45rem;
  font-size: .8rem;
  opacity: .9;
}

.icone-banner {
  font-size: 3rem;
}

.cards-estatisticas {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .9rem;
}

.card-estatistica {

  background: white;

  border-radius: 18px;

  padding: 1rem;

  box-shadow: 0 4px 18px rgba(0, 0, 0, .06);

  transition: .25s;
}

.card-estatistica:active {
  transform: scale(.98);
}

.card-estatistica .icone {

  font-size: 1.6rem;

}

.card-estatistica h2 {

  margin: .7rem 0 .25rem;

  color: #ff7a00;

  font-size: 1.5rem;

}

.card-estatistica p {

  margin: 0;

  color: #777;

  font-size: .8rem;

}

.grid-home {

  display: flex;

  flex-direction: column;

  gap: 1rem;

}

.card {

  background: white;

  border-radius: 20px;

  padding: 1.2rem;

  box-shadow: 0 4px 18px rgba(0, 0, 0, .06);

  transition: .25s;

}

.card:active {

  transform: scale(.99);

}

.titulo {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: .5rem;

  margin-bottom: 1rem;

}

.titulo h2 {

  margin: 0;

  font-size: 1rem;

  color: #333;

}

.titulo button {

  background: #ff9800;

  color: white;

  border: none;

  border-radius: 10px;

  padding: .55rem .9rem;

  font-size: .75rem;

  font-weight: 600;

  cursor: pointer;

  transition: .25s;

}

.titulo button:active {

  transform: scale(.95);

}

.card ul {

  margin: 0;

  padding-left: 18px;

  display: flex;

  flex-direction: column;

  gap: .7rem;

}

.card li {

  font-size: .9rem;

  color: #666;

}

.card p {

  margin: .45rem 0;

  font-size: .9rem;

  color: #666;

  line-height: 1.5;

}

/* ===========================
   AÇÕES
=========================== */

.acoes {

  display: grid;

  grid-template-columns: 1fr;

  gap: .8rem;

  margin-top: .5rem;

}

.acoes button {

  background: #fff5e8;

  border: none;

  border-radius: 16px;

  padding: 1rem;

  font-size: .9rem;

  font-weight: 600;

  color: #ff7a00;

  cursor: pointer;

  transition: .25s;

}

.acoes button:active {

  transform: scale(.98);

  background: #ff9800;

  color: white;

}

/* ==========================================
   TABLET
========================================== */

@media (min-width: 768px) {

  .pagina-home {
    padding: 2rem;
    gap: 1.5rem;
  }

  .banner {
    padding: 2rem;
    min-height: 180px;
  }

  .banner h1 {
    font-size: 2rem;
  }

  .banner p {
    font-size: .95rem;
  }

  .icone-banner {
    font-size: 4.5rem;
  }

  /* Estatísticas */

  .cards-estatisticas {

    grid-template-columns: repeat(4, 1fr);

    gap: 1rem;

  }

  .card-estatistica {

    padding: 1.4rem;

  }

  .card-estatistica .icone {

    font-size: 2rem;

  }

  .card-estatistica h2 {

    font-size: 2rem;

  }

  .card-estatistica p {

    font-size: .9rem;

  }

  /* Conteúdo */

  .grid-home {

    display: grid;

    grid-template-columns: repeat(2, 1fr);

    gap: 1.3rem;

  }

  .card {

    padding: 1.5rem;

  }

  .card.grande {

    grid-column: span 2;

  }

  .titulo h2 {

    font-size: 1.15rem;

  }

  .titulo button {

    font-size: .85rem;

    padding: .65rem 1rem;

  }

  .card li {

    font-size: .95rem;

  }

  .card p {

    font-size: .95rem;

  }

  .acoes {

    grid-template-columns: repeat(2, 1fr);

    gap: 1rem;

  }

}

/* ==========================================
   DESKTOP
========================================== */

@media (min-width: 1200px) {

  .pagina-home {

    max-width: 1400px;

    margin: auto;

    padding: 2.5rem;

  }

  .banner {

    padding: 2.5rem 3rem;

    border-radius: 28px;

  }

  .banner h1 {

    font-size: 2.4rem;

  }

  .banner p {

    font-size: 1rem;

  }

  .icone-banner {

    font-size: 5.5rem;

  }

  .cards-estatisticas {

    gap: 1.5rem;

  }

  .card-estatistica {

    border-radius: 22px;

    padding: 2rem;

  }

  .card-estatistica:hover {

    transform: translateY(-6px);

    box-shadow: 0 12px 30px rgba(0, 0, 0, .08);

  }

  .grid-home {

    gap: 1.5rem;

  }

  .card {

    border-radius: 22px;

    padding: 2rem;

  }

  .card:hover {

    transform: translateY(-5px);

    box-shadow: 0 14px 35px rgba(0, 0, 0, .08);

  }

  .titulo {

    margin-bottom: 1.5rem;

  }

  .titulo h2 {

    font-size: 1.3rem;

  }

  .titulo button {

    padding: .75rem 1.2rem;

    font-size: .9rem;

  }

  .acoes button {

    padding: 1.2rem;

    font-size: 1rem;

  }

  .acoes button:hover {

    background: #ff9800;

    color: white;

    transform: translateY(-3px);

  }

}

/* ==========================================
   ANIMAÇÕES
========================================== */

.banner,
.card,
.card-estatistica {

  animation: fadeUp .45s ease;

}

@keyframes fadeUp {

  from {

    opacity: 0;

    transform: translateY(20px);

  }

  to {

    opacity: 1;

    transform: translateY(0);

  }

}
</style>