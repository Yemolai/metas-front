<template lang="pug">
  #add-setor.container.text-left
    h3 N
      small OVA DIRETORIA
    h4(v-if='loading').text-left Carregando...
    b-form(@submit='saveNew' @reset='clearForm' v-else).text-left
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
              placeholder='SEDOP'
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
              placeholder='Secretaria de Desenvolvimento urbano e Obras públicas do estado do Pará'
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
              placeholder='Tv. Chaco, 2158, Marco, Belém'
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
              v-model='form.responsavel'
              :options='listaUsuarios'
              value-field='id'
              required
            )
              //- option(:value="null") Selecione um usuário
      b-row
        b-col(md='12').text-right
          b-btn.ml-2.mb-2(@click='back' variant='secondary') Cancelar e voltar
          b-btn.ml-2.mb-2(type='reset' variant='danger') Redefinir formulário
          b-btn.ml-2.mb-2(type='submit' variant='primary') Salvar nova diretoria
</template>
<script>
import INSERT_SETOR from '@/constants/insert-setor'
import GET_USUARIOS from '@/constants/get-usuarios'
import router from '@/router'
const emptySetor = {
  sigla: null,
  nome: null,
  endereco: null,
  telefone: null,
  ramal: null,
  responsavel: null
}
export default {
  methods: {
    back: () => router.go(-1),
    clearForm: function () { this.form = emptySetor },
    saveNew: function (e) {
      e.preventDefault()
      const mutation = INSERT_SETOR
      const variables = this.form
      this.$apollo.mutate({ mutation, variables })
        .then(response => router.replace({
          name: 'Setor',
          params: { setorId: response.data.addSetor.id }
        }))
    }
  },
  computed: {
    listaUsuarios: function () {
      let lista = this.usuarios.map(_usr => {
        let { id, nome, setor } = _usr
        return { id, nome, setor, text: (setor ? setor.sigla : '') + '' + nome }
      })
      lista.unshift({ id: null, text: '-- Selecione um usuário --' })
      return lista
    }
  },
  data () {
    return {
      loading: 0,
      usuarios: [],
      form: emptySetor
    }
  },
  apollo: {
    usuarios: {
      query: GET_USUARIOS
    }
  }
}
</script>
