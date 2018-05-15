<template lang="pug">
  b-container(fluid)#add-user-view
    h3 Novo usuário
    b-container
      b-form(@submit="submitForm" @reset="resetForm")
        b-row
          b-col
            b-form-group(label="Matrícula" label-for="input-matricula")
              b-form-input(
                type="text"
                v-model="matricula"
                placeholder="316804951")#input-matricula
          b-col
            b-form-group(label="Nome" label-for="input-nome")
              b-form-input(type="text"
                v-model="nome"
                placeholder="José Andrade Silva"
                autocomplete='given-name'
                required)#input-nome
        b-row
          b-col
            b-form-group(label="Usuario" label-for="input-usuario" description='Apenas letras minúsculas sem acentos e ponto (.)')
              b-form-input(
                type="text"
                v-model="usuario"
                placeholder="jose.silva"
                @input='checkUsername'
                :state='validUsername'
                :formatter='usuarioFormatter'
                required)#input-usuario
          b-col
            b-form-group(label="Permissões" label-for="input-permissoes")
              b-select(:options="listaPermissoes" value-field="id" text-field="nome" v-model="permissao")#input-permissoes
                template(slot="first")
                  option(:value="null" disabled) -- Escolha o nível de permissões --
        b-row
          b-col.text-right
            b-btn(variant='outline-secondary' @click="cancel").mx-1 Cancelar
            b-btn(variant='outline-warning' type="reset").mx-1 Redefinir
            b-btn(variant='outline-success' type="submit").ml-1 Salvar
</template>
<script>
import gql from 'graphql-tag'
import router from '@/router'
function removerAcentos (s) {
  return s.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z.\s]/g, '')
    .replace(/\s/g, '.')
    .toLowerCase()
}
export default {
  methods: {
    checkUsername: function () {
      let username = this.usuario
      if (!username || username === '') {
        this.validUsername = false
      }
      let same = this.usernames.filter(usr => usr.usuario === username)
      this.validUsername = same.length < 1
    },
    usuarioFormatter: function (value) {
      let removed = removerAcentos(value)
      return removed
    },
    submitForm: function () {
      this.checkUsername()
      if (this.validUsername) {
        alert('Nome de usuário inválido, escolha outro, por favor')
        this.usuario = this.usuarioFormatter(this.usuario)
        return false
      }
      let emptyNome = this.nome === null
      let emptyUsuario = this.usuario === null
      let emptyPermissao = this.permissao === null
      if (emptyNome || emptyUsuario || emptyPermissao) {
        alert('Ainda há campos em branco')
        return false
      }
      let { usuario, nome, permissao, matricula } = this
      this.$apollo
        .mutate({
          variables: { usuario, nome, permissao, matricula },
          mutation: gql`
            mutation INSERT_USUARIO($usuario: String!, $nome: String!, $permissao: Int!, $matricula: String) {
              addUsuario(usuario: $usuario, nome: $nome, permissoes: $permissao, matricula: $matricula) {
                id
              }
            }
          `
        })
        .then(function (response) {
          // refetch usuarios in Apollo GQL Store
          alert('Usuario ' + nome + ' registrado.')
          return router.replace({name: 'Home'})
        })
    },
    resetForm: function () {
      this.validUsername = false
      this.nome = null
      this.usuario = null
      this.matricula = null
      this.permissao = null
    },
    cancel: function () {
      this.resetForm()
      router.go(-1)
    }
  },
  computed: {
    listaPermissoes: function () {
      if (this.loading || this.permissoes.length < 1) {
        return []
      }
      return this.permissoes
        .map(p => (p.id < 2) ? false : {id: p.id, nome: p.nome})
        .filter(p => p)
    }
  },
  data () {
    return {
      usernames: [],
      validUsername: false,
      loading: 0,
      nome: null,
      usuario: null,
      matricula: null,
      permissao: null,
      permissoes: []
    }
  },
  apollo: {
    usernames: {
      query: gql`query GET_USUARIOS_USERNAMES{
        usuarios {
          id
          usuario
        }
      }`,
      update: v => { return v.usuarios }
    },
    permissoes: {
      query: gql`
        {
          permissoes {
            id
            nome
            setor_create
            setor_read
            setor_update
            setor_delete
            coord_create
            coord_read
            coord_update
            coord_delete
            meta_create
            meta_read
            meta_update
            meta_delete
            atual_create
            atual_read
            atual_update
            atual_delete
            own_setor_update
            own_setor_delete
            own_coord_update
            own_coord_delete
            own_meta_update
            own_meta_delete
            own_atual_update
            own_atual_delete
          }
        }
      `
    }
  }
}
</script>
<style scoped>
  /* Custom local CSS */
</style>
