<script>
export default {
  props: {
    funcionario: {
      type: Object,
      required: true
    }
  },

  computed: {
    fotoFuncionario() {
      if (!this.funcionario.foto) return null;

      let url = this.funcionario.foto.url;

      if (!url) return null;

      // Corrige URLs que vêm como localhost
      return url.replace(
        "http://127.0.0.1:8000",
        import.meta.env.VITE_API_URL
      );
    }
  }
}
</script>

<template>
  <div class="card">

    <div class="imagem">

      <img
        v-if="fotoFuncionario"
        :src="fotoFuncionario"
        :alt="funcionario.nome"
      />

      <div
        v-else
        class="sem-foto"
      >
        <font-awesome-icon icon="fa-solid fa-user" />
      </div>

    </div>

    <div class="conteudo">

      <h3>{{ funcionario.nome }}</h3>

      <p>
        <strong>Cargo</strong><br>
        {{ funcionario.cargo }}
      </p>

      <p>
        <strong>Telefone</strong><br>
        {{ funcionario.telefone }}
      </p>

      <p>
        <strong>Pagamento</strong><br>
        R$ {{ Number(funcionario.pagamento).toFixed(2) }}
      </p>

      <div class="acoes">

        <button
          class="editar"
          @click="$emit('editar', funcionario)"
        >
          <font-awesome-icon icon="fa-solid fa-pen" />
        </button>

        <button
          class="excluir"
          @click="$emit('excluir', funcionario.id)"
        >
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>

.card{
    background:#fff;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 8px 22px rgba(0,0,0,.12);
    transition:.25s;
    display:flex;
    flex-direction:column;
}

.card:hover{
    transform:translateY(-5px);
    box-shadow:0 12px 30px rgba(0,0,0,.18);
}

.imagem{
    width:100%;
    height:220px;
    background:#f4f4f4;
}

.imagem img{
    width:100%;
    height:100%;
    object-fit:cover;
}

.sem-foto{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:70px;
    color:#c8c8c8;
}

.conteudo{
    padding:20px;
    display:flex;
    flex-direction:column;
    gap:12px;
}

.conteudo h3{
    margin:0;
    color:#FF9500;
    font-family:'Unbounded';
    font-size:1.25rem;
}

.conteudo p{
    margin:0;
    color:#555;
    font-family:'Urbanist';
    line-height:1.5;
}

.acoes{
    margin-top:18px;
    display:flex;
    justify-content:flex-end;
    gap:12px;
}

.acoes button{
    width:42px;
    height:42px;
    border:none;
    border-radius:10px;
    cursor:pointer;
    transition:.2s;
    color:white;
    font-size:16px;
}

.editar{
    background:#FF9500;
}

.editar:hover{
    background:#e98900;
}

.excluir{
    background:#e74c3c;
}

.excluir:hover{
    background:#c0392b;
}

@media(max-width:700px){

.card{
    width:100%;
}

.imagem{
    height:190px;
}

}

</style>