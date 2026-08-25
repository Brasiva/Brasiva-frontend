<script>
export default {
  props: {
    funcionario: Object,
    modoEdicao: Boolean
  },

  data() {
    return {
      dados: {
        id: null,
        nome: '',
        cargo: '',
        telefone: '',
        pagamento: '',
        foto: null
      },

      preview: '',
      arquivoFoto: null
    }
  },

  watch: {
    funcionario: {
      immediate: true,

      handler(novo) {
        if (!novo) {
          this.resetFormulario()
          return
        }

        this.dados = {
          id: novo.id,
          nome: novo.nome || '',
          cargo: novo.cargo || '',
          telefone: novo.telefone || '',
          pagamento: novo.pagamento || '',
          foto: null
        }

        this.arquivoFoto = null

        if (novo.foto?.url) {
          this.preview = novo.foto.url.replace(
            'http://127.0.0.1:8000',
            import.meta.env.VITE_API_URL
          )
        } else {
          this.preview = ''
        }
      }
    }
  },

  methods: {
    resetFormulario() {
      this.dados = {
        id: null,
        nome: '',
        cargo: '',
        telefone: '',
        pagamento: '',
        foto: null
      }

      this.preview = ''
      this.arquivoFoto = null
    },

    carregarImagem(event) {
      const file = event.target.files[0]

      if (!file) return

      this.arquivoFoto = file
      this.dados.foto = file

      const reader = new FileReader()

      reader.onload = (e) => {
        this.preview = e.target.result
      }

      reader.readAsDataURL(file)
    },

    salvar() {
      const dadosParaSalvar = { ...this.dados }

      if (dadosParaSalvar.telefone) {
        let telefone =
          dadosParaSalvar.telefone.replace(/\D/g, '')

        if (
          telefone.length === 10 ||
          telefone.length === 11
        ) {
          telefone = '55' + telefone
        }

        dadosParaSalvar.telefone = '+' + telefone
      }

      if (this.arquivoFoto) {
        dadosParaSalvar.foto = this.arquivoFoto
      }

      this.$emit('salvar', dadosParaSalvar)
    },

    cancelar() {
      this.$emit('cancelar')
    }
  }
}
</script>

<template>
  <div class="form-card">

    <div class="form-header">
      <div>
        <h2>
          {{
            modoEdicao
              ? 'Editar Funcionário'
              : 'Novo Funcionário'
          }}
        </h2>

        <p>
          {{
            modoEdicao
              ? 'Atualize os dados do funcionário'
              : 'Preencha os dados para cadastrar um funcionário'
          }}
        </p>
      </div>

      <button
        type="button"
        class="close-button"
        @click="cancelar"
      >
        <span class="material-symbols-outlined">
          close
        </span>
      </button>
    </div>

    <div class="form-content">

      <div class="image-area">

        <div class="preview">

          <img
            v-if="preview"
            :src="preview"
            alt="Foto do funcionário"
          />

          <span
            v-else
            class="material-symbols-outlined"
          >
            person
          </span>

        </div>

        <label class="btn-upload">
          <span class="material-symbols-outlined">
            upload
          </span>

          Escolher foto

          <input
            type="file"
            accept="image/*"
            @change="carregarImagem"
          />
        </label>

      </div>

      <div class="fields">

        <div class="input-group">
          <label>Nome</label>

          <input
            v-model="dados.nome"
            type="text"
            placeholder="Nome completo"
            required
          />
        </div>

        <div class="input-group">
          <label>Cargo</label>

          <input
            v-model="dados.cargo"
            type="text"
            placeholder="Ex.: Cozinheira"
            required
          />
        </div>

        <div class="input-group">
          <label>Telefone</label>

          <input
            v-model="dados.telefone"
            type="text"
            placeholder="Ex.: (47) 99999-9999"
          />
        </div>

        <div class="input-group">
          <label>Pagamento</label>

          <input
            v-model="dados.pagamento"
            type="number"
            step="0.01"
            placeholder="Ex.: 4000.00"
          />
        </div>

      </div>

    </div>

    <div class="buttons">

      <button
        type="button"
        class="btn-cancel"
        @click="cancelar"
      >
        Cancelar
      </button>

      <button
        type="button"
        class="btn-save"
        @click="salvar"
      >
        <span class="material-symbols-outlined">
          save
        </span>

        {{ modoEdicao ? 'Atualizar' : 'Cadastrar' }}
      </button>

    </div>

  </div>
</template>

<style scoped>
.form-card {
  width: 760px;
  max-width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 22px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
  font-family: 'Poppins', sans-serif;
}

.form-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 25px;
}

.form-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
}

.form-header p {
  margin: 5px 0 0;
  color: #888;
  font-size: 0.75rem;
}

.close-button {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-button:hover {
  background-color: #eeeeee;
}

.close-button .material-symbols-outlined {
  font-size: 20px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.image-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #90caf9;
  background-color: #f4f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview .material-symbols-outlined {
  font-size: 55px;
  color: #bdbdbd;
}

.btn-upload {
  margin-top: 12px;
  min-height: 40px;
  padding: 8px 14px;
  border-radius: 8px;
  background-color: #e3f2fd;
  color: #1976d2;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;
}

.btn-upload:hover {
  background-color: #bbdefb;
}

.btn-upload input {
  display: none;
}

.btn-upload .material-symbols-outlined {
  font-size: 18px;
}

.fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  color: #444;
  font-size: 0.75rem;
  font-weight: 600;
}

.input-group input {
  width: 100%;
  height: 44px;
  border: 1px solid #d8d8d8;
  border-radius: 9px;
  padding: 0 12px;
  color: #333;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  outline: none;
  transition: 0.2s;
}

.input-group input::placeholder {
  color: #aaa;
}

.input-group input:focus {
  border-color: #90caf9;
  box-shadow: 0 0 0 3px rgba(144, 202, 249, 0.18);
}

.buttons {
  display: flex;
  flex-direction: column-reverse;
  gap: 9px;
  margin-top: 25px;
}

.buttons button {
  min-height: 44px;
  border: none;
  border-radius: 9px;
  padding: 9px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;
}

.btn-save {
  background-color: #90caf9;
  color: #333;
}

.btn-save:hover {
  background-color: #64b5f6;
}

.btn-cancel {
  background-color: #f1f1f1;
  color: #555;
}

.btn-cancel:hover {
  background-color: #e5e5e5;
}

.btn-save .material-symbols-outlined {
  font-size: 18px;
}

@media (min-width: 600px) {
  .form-card {
    padding: 28px;
  }

  .buttons {
    flex-direction: row;
    justify-content: flex-end;
  }

  .buttons button {
    width: auto;
    min-width: 120px;
  }
}

@media (min-width: 768px) {
  .form-card {
    padding: 30px;
  }

  .form-content {
    flex-direction: row;
    align-items: flex-start;
    gap: 30px;
  }

  .image-area {
    width: 190px;
    min-width: 190px;
  }

  .preview {
    width: 170px;
    height: 170px;
  }
}
</style>
