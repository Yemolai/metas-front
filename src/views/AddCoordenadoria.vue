<template lang="pug">
  #add-coordenadoria.container
    h3.text-left N
      small OVA COORDENADORIA
    h4(v-if='loading') Carregando...
    b-form(@submit='submit' @reset='reset' v-else).text-left
      //- linha 1
      b-row
        b-col(md='3' sm='12')
          b-form-group(
            label='Sigla*'
            label-for='form-input-sigla'
            description='Sigla única (requerido)'
          )#form-group-sigla
            b-form-input(
              required
              type='text'
              v-model='form.sigla'
              placeholder='CLPP'
            )#form-input-sigla
        b-col(md='9' sm='12')
          b-form-group(
            label='Nome*'
            label-for='form-input-nome'
            description='Nome do setor (requerido)'
          )#form-group-nome
            b-form-input(
              required
              type='text'
              v-model='form.nome'
              placeholder='Coordenadoria de limpeza e polimento de panelas'
            )#form-input-nome
      //- linha 2
      b-row
        b-col(md='6' sm='12')
          b-form-group(
            label='Endereço'
            label-for='form-input-endereco'
            description='Localização do setor'
          )#form-group-endereco
            b-form-input(
              type='text'
              v-model='form.endereco'
              placeholder='Tv. Chaco, 2158, Altos, sala 15, Marco, Belém'
            )#form-input-endereco
        b-col(md='4' sm='12')
          b-form-group(
            label='Telefone'
            label-for='form-input-telefone'
            description='Número de telefone do setor'
          )#form-group-telefone
            b-form-input(
              type='text'
              v-model='form.telefone'
              placeholder='(91) 3183-0020'
            )#form-input-telefone
        b-col(md='2' sm='12')
          b-form-group(
            label='Ramal'
            label-for='form-input-ramal'
            description='Interno do setor'
          )#form-group-ramal
            b-form-input(
              type='text'
              v-model='form.ramal'
              placeholder='0020'
            )#form-input-ramal
      b-row
        b-col(md='6' sm='12')
          b-form-group(
            label='Responsável'
            label-for='form-input-responsavel'
            description='Usuário responsável pelo setor'
          )
            //- TODO: Trocar esse select por uma pesquisa de texto com autocomplete
            b-form-select(
              v-model='form.responsavelId'
              :options='listaUsuarios'
              value-field='id'
              required
            )
      b-row
        b-col(md='12').text-right
          b-btn.ml-2.mb-2(@click='back' variant='secondary') Cancelar e voltar
          b-btn.ml-2.mb-2(type='reset' variant='danger') Redefinir formulário
          b-btn.ml-2.mb-2(type='submit' variant='primary') Criar nova coordenadoria
</template>
<script>
import INSERT_COORDENADORIA from '@/constants/insert-coordenadoria'
import GET_USUARIOS from '@/constants/get-usuarios'
import router from '@/router'
const emptyForm = {
  sigla: null,
  nome: null,
  endereco: null,
  telefone: null,
  ramal: null,
  setorId: null,
  responsavelId: null
}
export default {
  name: 'AddCoordenadoria',
  data () {
    return {
      loading: 0,
      usuarios: [],
      form: emptyForm,
      setorId: this.$route.params.setorId
    }
  },
  computed: {
    listaUsuarios: function () {
      let lista = this.usuarios.map(usr => ({
        id: usr.id,
        text: (usr.setor ? usr.setor.sigla : '') + '\\' + usr.nome
      }))
      lista.unshift({id: null, text: '-- Selecione um usuário --'})
      return lista
    }
  },
  methods: {
    back: e => router.go(-1),
    reset: function () { this.form = emptyForm },
    submit: function (e) {
      e.preventDefault()
      let variables = this.form
      variables.setorId = this.setorId
      let mutation = INSERT_COORDENADORIA
      return this.$apollo.mutate({ mutation, variables })
        .then(response => router.replace({
          name: 'Coordenadoria',
          params: {
            setorId: variables.setorId,
            coordId: response.data.addCoordenadoria.id
          }
        }))
    }
  },
  apollo: { usuarios: { query: GET_USUARIOS } }
}
</script>
