<template lang="pug">
  #add-meta.container.text-left
    h3 N
      small OVA META
    h4(v-if='loading').text-left Carregando...
    b-form(@submit='submit' @reset='reset' v-else).text-left
      b-row
        b-col(sm='12')
          b-form-group(
            label='Título'
            label-for='form-input-titulo'
            description='Breve descrição do objetivo'
          )#form-group-titulo
            b-form-input(
              type='text'
              v-model='form.titulo'
              required
              placeholder='Realizar um passo de uma caminhada'
            )#form-input-titulo
      b-row
        b-col(sm='12' md='3')
          b-form-group(
            label='Escopo previsto'
            label-for='form-input-escopo-previsto'
            description='Uma previsão de contador de progresso de execução'
          )#form-group-escopo-previsto
            b-form-input(
              type='number'
              v-model='form.escopo_previsto'
              required
              min='0'
              step='0.01'
              placeholder='99,9'
            )#form-input-escopo-previsto
        b-col(sm='12' md='6')
          b-form-group(
            label='Início previsto'
            label-for='form-input-inicio-previsto'
            description='Data prevista para o início da execução'
          )
            b-form-input(
              type='date'
              v-model='form.inicio_previsto'
              required
            )#form-input-inicio-previsto
        b-col(sm='12' md='3')
          b-form-group(
            label='Custo previsto'
            label-for='form-input-custo-previsto'
            description='Custo inicialmente previsto para a execução'
          )
            b-form-input(
              type='number'
              v-model='form.custo_previsto'
              required
              min='0'
              step='0.01'
              placeholder='10.00'
            )#form-input-custo-previsto
      b-row
        b-col(sm='12' md='6')
          b-form-group(
            label='Responsável'
            label-for='form-input-responsavel'
            description='Usuário responsável pela meta'
          )
            b-select(
              :options='listaUsuarios'
              v-model='form.responsavel'
            )#form-input-responsavel
      b-row
        b-col.text-right
          b-btn(
            variant='secondary'
            @click='cancelAndGoBack'
          ).ml-2.mb-2 Cancelar e voltar
          b-btn(
            variant='warning'
            type='reset'
          ).ml-2.mb-2 Redefinir formulário
          b-btn(
            variant='primary'
            type='submit'
          ).ml-2.mb-2 Salvar nova meta
</template>
<script>
import router from '@/router'
import INSERT_META from '@/constants/insert-meta'
import GET_USUARIOS from '@/constants/get-usuarios'
import GET_SETORES from '@/constants/get-setores'
const emptyMeta = {
  titulo: '',
  escopo_previsto: null,
  inicio_previsto: null,
  fim_previsto: null,
  custo_previsto: null,
  responsavel: null,
  autor: null
}
export default {
  name: 'AddMeta',
  data () {
    return {
      loading: 0,
      usuarios: [],
      form: emptyMeta
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
    },
    diretoria: function () {
      if (
        !('setor' in this.$route.params) ||
        !this.setores ||
        this.setores.length === 0
      ) {
        console.log('Have no setor', this.$route.params, this.setores)
        return {}
      }
      let sigla = this.$route.params.setor
      return this.setores
        .filter(setor => setor.sigla === sigla)
        .reduce((p, a) => a, {})
    },
    coordenadoria: function () {
      if (
        !('coordenadoria' in this.$route.params) ||
        !('coordenadorias' in this.diretoria)
      ) {
        console.log('Have no coordenadoria.', this.$route.params, this.diretoria)
        return {}
      }
      let sigla = this.$route.params.coordenadoria
      return this.diretoria.coordenadorias
        .filter(coordenadoria => coordenadoria.sigla === sigla)
        .reduce((p, a) => a, {})
    }
  },
  methods: {
    cancelAndGoBack: e => {
      e.preventDefault()
      router.go(-1)
    },
    reset: function (e) {
      this.form = emptyMeta
    },
    submit: function (e) {
      e.preventDefault()
      let variables = {
        titulo: this.form.titulo,
        escopo_previsto: this.form.escopo_previsto,
        inicio_previsto: this.form.inicio_previsto,
        fim_previsto: this.form.fim_previsto,
        custo_previsto: this.form.custo_previsto,
        coordenadoria: this.coordenadoria.id,
        responsavel: this.form.responsavel,
        autor: this.form.autor
      }
      console.log('variables', variables)
      let mutation = INSERT_META
      this.$apollo.mutate({
        variables,
        mutation
      })
        .then(response => {
          if (response.error) {
            let err = { error: response.error }
            throw err
          }
          console.log('response', response)
          router.replace({
            name: 'Meta',
            params: {
              setor: response.data.addMeta.coordenadoria.setor.sigla,
              coordenadoria: response.data.addMeta.coordenadoria.sigla,
              year: (new Date()).getFullYear(),
              meta: response.data.addMeta.id
            }
          })
        })
        .catch(err => console.error('Erro:', err, alert('Ocorreu um erro')))
    }
  },
  apollo: {
    usuarios: {
      query: GET_USUARIOS
    },
    setores: {
      query: GET_SETORES
    }
  }
}
</script>
