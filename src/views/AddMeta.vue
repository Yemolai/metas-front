<template lang="pug">
  #add-meta.container.text-left
    h4(v-if='loading').text-left Carregando...
    b-form(@submit='submit' @reset='reset' v-if='!loading').text-left
      h3(v-if='this.pai')
        span N
          small OVA SUBMETA de&nbsp;
        small
          span {{ this.metaPai.coordenadoria.setor.sigla }}/
          span {{ this.metaPai.coordenadoria.sigla }}/
          span {{ (new Date()).getFullYear() }}/
          span {{ this.metaPai.id }}&nbsp;
          span - {{ this.metaPai.titulo }}
      span(v-if='!this.pai')
        span N
          small OVA META
      b-row
        b-col(sm='12')
          b-form-group(
            label='Título'
            label-for='form-input-titulo'
            description='Breve descrição do objetivo'
          )#form-group-titulo
            b-form-input(
              type='text'
              v-model='titulo'
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
              v-model='escopo_previsto'
              required
              :min='0'
              :step='0.01'
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
              v-model='inicio_previsto'
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
              v-model='fim_previsto'
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
              v-model='custo_previsto'
              required
              :min='0'
              :step='0.01'
              placeholder='10,00'
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
              v-model='responsavel'
              value-field='id'
            )#form-input-responsavel
        //- b-col(sm='12' md='6')
        //-   b-form-group(
        //-     label='Meta pai'
        //-     label-for='form-input-pai'
        //-     description='Meta pai da qual esta meta é submeta'
        //-   )
        //-     b-select(
        //-       :options='listaMetas'
        //-       v-model='pai'
        //-       value-field='id'
        //-     )
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
// parser to create graphql queries
import gql from 'graphql-tag'

// graphql pre-baked queries:
import INSERT_META from '@/constants/insert-meta'
import GET_USUARIOS from '@/constants/get-usuarios'
import GET_SETORES from '@/constants/get-setores'

// This method capitalizes a word
const upperFirst = (str) => (typeof str === 'string')
  ? str.charAt(0).toUpperCase() + str.slice(1)
  : str

// Vue object definition
export default {
  name: 'AddMeta', // VIEW NAME
  data () { // ENCAPSULATED PROPERTIES
    return {
      loading: 0,
      usuarios: [],
      titulo: '',
      escopo_previsto: null,
      inicio_previsto: null,
      fim_previsto: null,
      custo_previsto: null,
      responsavel: null,
      metaPai: null,
      dis: this
    }
  },
  computed: { // COMPUTED FIELDS
    pai: function () {
      return this.$route.params && this.$route.params.pai ? this.$route.params.pai : null
    },
    autor: function () {
      let usuario = this.$root.$children[0].usuario
      return usuario || null
    },
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
        text: usr.nome.toLowerCase().split(' ')
          .map(v => upperFirst(v))
          .reduce((p, a) => p + ' ' + a, '')
      }))
      lista.unshift({id: null, text: '-- Selecione um usuário --'})
      return lista
    },
    diretoria: function () {
      let haveParam = 'setor' in this.$route.params
      let haveLista = this.setores.length > 0
      return (!haveParam || !this.setores || !haveLista)
        ? {}
        : this.setores
          .filter(setor => setor.sigla === this.$route.params.setor)
          .reduce((p, a) => a, {})
    },
    coordenadoria: function () {
      if (
        !('coordenadoria' in this.$route.params) ||
        !('coordenadorias' in this.diretoria)
      ) {
        return {}
      }
      let sigla = this.$route.params.coordenadoria
      return this.diretoria.coordenadorias
        .filter(coordenadoria => coordenadoria.sigla === sigla)
        .reduce((p, a) => a, {})
    }
  },
  methods: { // METHODS AND FUNCTIONS
    cancelAndGoBack: e => {
      e.preventDefault()
      this.$router.go(-1)
    },
    reset: function () {
      this.titulo = ''
      this.escopo_previsto = null
      this.inicio_previsto = null
      this.fim_previsto = null
      this.custo_previsto = null
      this.responsavel = null
    },
    submit: function (e) {
      e.preventDefault()
      let variables = {
        titulo: this.titulo,
        escopo_previsto: Number(this.escopo_previsto),
        inicio_previsto: new Date(this.inicio_previsto + ' 00:00'),
        fim_previsto: new Date(this.fim_previsto + ' 00:00'),
        custo_previsto: Number(this.custo_previsto),
        coordenadoria: Number(this.coordenadoria.id),
        responsavel: Number(this.responsavel) || null,
        pai: Number(this.pai) || null,
        autor: Number(this.autor) || null
      }
      let mutation = INSERT_META
      let vm = this
      this.$apollo.mutate({
        variables,
        mutation
      })
        .then(function (response) {
          if (response.error) {
            let err = { error: response.error }
            throw err
          }
          vm.$router.replace({
            name: 'Meta',
            params: {
              setor: response.data.addMeta.coordenadoria.setor.sigla,
              coordenadoria: response.data.addMeta.coordenadoria.sigla,
              year: (new Date()).getFullYear(),
              meta: response.data.addMeta.id
            }
          }, vm.$router.go(1))
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
    meta () {
      const metaQuery = `
        query GET_META {
          meta(id: ${this.pai}) {
            id
            titulo
            coordenadoria {
              id
              sigla
              setor {
                id
                sigla
              }
            }
          }
        }
      `
      const emptyMetaQuery = `
        query GET_META {
          meta(id: 0) {
            id
          }
        }
      `
      const query = this.pai ? gql`${metaQuery}` : gql`${emptyMetaQuery}`
      const update = v => { this.metaPai = v.meta || null }
      return { query, update }
    }
  }
}
</script>
