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
        b-col(sm='12' md='3')
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
            label='Fim previsto'
            label-for='form-input-fim-previsto'
            description='Data prevista para o fim da execução'
          )
            b-form-input(
              type='date'
              v-model='form.fim_previsto'
              required
            )#form-input-fim-previsto
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
              value-field='id'
            )#form-input-responsavel
        b-col(sm='12' md='6')
          b-form-group(
            label='Meta pai'
            label-for='form-input-pai'
            description='Meta pai da qual esta meta é submeta'
          )
            b-select(
              :options='listaMetas'
              v-model='form.pai'
              value-field='id'
            )
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
import gql from 'graphql-tag'
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
  pai: null,
  responsavel: null,
  autor: null
}
export default {
  name: 'AddMeta',
  data () {
    return {
      loading: 0,
      usuarios: [],
      metas: [],
      form: emptyMeta
    }
  },
  computed: {
    listaMetas: function () {
      if (!this.metas) {
        return []
      }
      let lista = this.metas.map(m => ({
        id: m.id,
        text: m.id + ' - ' + m.titulo
      }))
      lista.unshift({id: null, text: '-- Selecione uma meta pai --'})
      return lista
    },
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
      // ISSO AQUI DEVE SER ALTERADO AO IMPLEMENTAR AUTENTICAÇÃO
      this.form.autor = 1
      let variables = {
        titulo: this.form.titulo,
        escopo_previsto: Number(this.form.escopo_previsto),
        inicio_previsto: new Date(this.form.inicio_previsto + ' 00:00'),
        fim_previsto: new Date(this.form.fim_previsto + ' 00:00'),
        custo_previsto: Number(this.form.custo_previsto),
        coordenadoria: Number(this.coordenadoria.id),
        responsavel: Number(this.form.responsavel) || null,
        pai: Number(this.form.pai) || null,
        autor: Number(this.form.autor) || null
      }
      console.log('variables', variables)
      let mutation = INSERT_META
      let vm = this
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
          vm.$apollo.queries.metas.refetch()
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
    },
    metas () {
      let query = gql`
        query GET_METAS {
          setores {
            id
            sigla
            coordenadorias {
              id
              sigla
              metas(submetas: true) {
                id
                titulo
              }
            }
          }
        }
      `
      let siglaSetor = this.$route.params.setor
      let siglaCoordenadoria = this.$route.params.coordenadoria
      let update = data => data.setores === null ? [] : data.setores
        .filter(s => s.sigla === siglaSetor)
        .reduce((p, a) => a.coordenadorias, [])
        .filter(c => c.sigla === siglaCoordenadoria)
        .reduce((p, a) => a.metas, [])
      return { query, update }
    }
  }
}
</script>
