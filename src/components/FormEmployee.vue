<script>
export default {
  props: {
    funcionario: Object,
    modoEdicao: Boolean,
  },

  data() {
    return {
      dados: {
        id: null,
        nome: "",
        cargo: "",
        telefone: "",
        pagamento: "",
        foto: null,
      },

      preview: "",
      arquivoFoto: null,
    };
  },

  watch: {
    funcionario: {
      immediate: true,
      handler(novo) {
        if (!novo) {
          this.resetFormulario();
          return;
        }

        this.dados = {
          id: novo.id,
          nome: novo.nome || "",
          cargo: novo.cargo || "",
          telefone: novo.telefone || "",
          pagamento: novo.pagamento || "",
          foto: null,
        };

        this.arquivoFoto = null;

        if (novo.foto?.url) {
          this.preview = novo.foto.url.replace(
            "http://127.0.0.1:8000",
            import.meta.env.VITE_API_URL
          );
        } else {
          this.preview = "";
        }
      },
    },
  },

  methods: {
  resetFormulario() {
    this.dados = {
      id: null,
      nome: "",
      cargo: "",
      telefone: "",
      pagamento: "",
      foto: null,
    };

    this.preview = "";
    this.arquivoFoto = null;
  },

  carregarImagem(event) {
    const file = event.target.files[0];

    if (!file) return;

    this.arquivoFoto = file;
    this.dados.foto = file;

    const reader = new FileReader();

    reader.onload = (e) => {
      this.preview = e.target.result;
    };

    reader.readAsDataURL(file);
  },

  salvar() {
    const dadosParaSalvar = { ...this.dados };

   if (dadosParaSalvar.telefone) {
  let telefone = dadosParaSalvar.telefone.replace(/\D/g, "");

  // se digitou só DDD + número
  if (telefone.length === 10 || telefone.length === 11) {
    telefone = "55" + telefone;
  }

  dadosParaSalvar.telefone = "+" + telefone;
}

    if (this.arquivoFoto) {
      dadosParaSalvar.foto = this.arquivoFoto;
    }

    this.$emit('salvar', dadosParaSalvar);
  },

  cancelar() {
    this.$emit("cancelar");
  }
}
}
</script>

<template>
  <div class="form-card">

    <h2>
      {{ modoEdicao ? "Editar Funcionário" : "Novo Funcionário" }}
    </h2>

    <div class="form-content">

      <div class="image-area">

        <div class="preview">

          <img v-if="preview" :src="preview" />

          <div v-else class="placeholder">
            <font-awesome-icon icon="fa-solid fa-user" />
          </div>

        </div>

        <label class="btn-upload">
          Escolher Foto

          <input type="file" accept="image/*" @change="carregarImagem" />
        </label>

      </div>

      <div class="fields">

        <div class="input-group">
          <label>Nome</label>

          <input v-model="dados.nome" type="text" required />
        </div>

        <div class="input-group">
          <label>Cargo</label>

          <input v-model="dados.cargo" type="text" required />
        </div>

        <input 
  v-model="dados.telefone" 
  placeholder="Ex.: (47) 99999-9999"
/>

        <div class="input-group">
          <label>Pagamento</label>
          <input v-model="dados.pagamento" type="number" step="0.01" placeholder="Ex.: 4000.00" />
        </div>

      </div>

    </div>

    <div class="buttons">

      <button 
      type="button" class="btn-save" @click="salvar">
        {{ modoEdicao ? "Atualizar" : "Cadastrar" }}
      </button>

      <button 
  type="button"
  class="btn-cancel"
  @click="cancelar"
>
  Cancelar
</button>

    </div>

  </div>
</template>
<style scoped>
.form-card {
  width: 760px;
  max-width: 95%;
  background: #ffffff;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
  font-family: "Urbanist", sans-serif;
}

.form-card h2 {
  margin: 0 0 28px;
  text-align: center;
  color: #ff9500;
  font-family: "Unbounded", sans-serif;
  font-size: 1.5rem;
}

.form-content {
  display: flex;
  gap: 35px;
  align-items: flex-start;
}

/* ================= FOTO ================= */

.image-area {
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview {
  width: 190px;
  height: 190px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #ff9500;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 4rem;
  color: #cfcfcf;
}

.btn-upload {
  margin-top: 18px;
  background: #ff9500;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
  text-align: center;
}

.btn-upload:hover {
  background: #e78700;
}

.btn-upload input {
  display: none;
}

/* ================= CAMPOS ================= */

.fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 8px;
  font-weight: 700;
  color: #444;
  font-size: 0.95rem;
}

.input-group input {
  height: 46px;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 1rem;
  transition: 0.25s;
  outline: none;
}

.input-group input:focus {
  border-color: #ff9500;
  box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.18);
}

/* ================= BOTÕES ================= */

.buttons {
  margin-top: 35px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.buttons button {
  border: none;
  border-radius: 10px;
  padding: 12px 26px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.btn-save {
  background: #ff9500;
  color: white;
}

.btn-save:hover {
  background: #e78700;
}

.btn-cancel {
  background: #ececec;
  color: #444;
}

.btn-cancel:hover {
  background: #d9d9d9;
}

/* ================= RESPONSIVO ================= */

@media (max-width: 760px) {
  .form-card {
    padding: 24px;
  }

  .form-content {
    flex-direction: column;
    align-items: center;
  }

  .image-area {
    width: 100%;
  }

  .fields {
    width: 100%;
  }

  .buttons {
    flex-direction: column;
  }

  .buttons button {
    width: 100%;
  }
}
</style>