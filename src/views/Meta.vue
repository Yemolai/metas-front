<template lang="pug">
  #meta-view.container.text-left
    b-row
      b-col
        h3 M
          small ETA
          small(v-if='!loading') &nbsp;
            span {{ meta.coordenadoria.setor.sigla}}/
            span {{ meta.coordenadoria.sigla}}/
            span {{ new Date(meta.createdAt).getFullYear()}}/
            span {{ meta.id }}
      b-col.text-right
        b-dd(variant='outline-secondary' size='sm' right no-caret)
          template(slot='button-content')
            span.fa.fa-angle-down
            span.sr-only Opções
          b-dropdown-item(href='#')
            span.fa.fa-edit &nbsp;
            span Editar
          b-dropdown-item(href='#')
            span.fa.fa-trash &nbsp;
            span Apagar
    h4(v-if='loading') Carregando...
    div(v-else)#meta-details
      b-card(
        :title='meta.titulo'
      ).mb-2
        p.card-text
          b-row
            b-col(md='4' sm='12').editable Responsável:&nbsp;
              span(v-if='meta.responsavel') {{ meta.responsavel.nome }}
              small(v-else).text-warning [indefinido]
              b-btn(variant='outline-primary' size='sm').edit-btn Atualizar
            b-col(md='4' sm='12').editable Última ação:&nbsp;
              span(v-if='meta.resumo') {{ meta.resumo }}
              span(v-else  style='color:rgba(0,0,0,0.5)') [indefinido]
              b-btn(variant='outline-primary' size='sm' @click="update('resumo')").edit-btn
                span Atualizar ação
            b-col(md='4' sm='12').text-right Última atualização:&nbsp;
              span(v-if='meta.atualizado') {{ date(meta.atualizado) }}
              span(v-else) {{ date(meta.createdAt) }} (criação)
          b-row.mb-2.mt-4
            b-col(cols='12').editable Situação da meta:&nbsp;
              span(v-if='meta.estado') {{ meta.estado }}
              small(v-else style='color:rgba(0,0,0,0.5)') [indefinido]
              b-btn(variant='outline-primary' size='sm' @click="update('estado')").edit-btn
                span Atualizar situação
          hr
          b-row.mb-2
            b-col(md='4' sm='12').editable Prazo:&nbsp;
              span(v-html='deadline(null, null, meta)')
              br
              span {{ date(meta.inicio_realizado) || '?' }} -&nbsp;
              span {{ date(meta.fim_realizado) || '?' }}
              br
              small (previsto: {{ date(meta.inicio_previsto) || '?' }} - &nbsp;
                span {{ date(meta.fim_previsto) || '?' }})
              b-dd(
                split
                size='sm'
                variant='outline-primary'
                :text="'Atualizar ' + prazo.title"
                @click="update(prazo.field)"
              ).edit-btn
                b-dd-item(href="#" @click="update('inicio_previsto')")
                  span início previsto
                b-dd-item(v-if='meta.inicio_previsto' href="#" @click="update('fim_previsto')")
                  span fim previsto
                b-dd-item(v-if='meta.inicio_previsto' href="#" @click="update('inicio_realizado')")
                  span início realizado
                b-dd-item(v-if='meta.inicio_realizado' href="#" @click="update('fim_realizado')")
                  span fim realizado
            b-col(md='4' sm='12').editable Escopo:&nbsp;
              br
              span(v-html='escopo(null, null, meta)')
              b-dd(size='sm' variant='outline-primary' text='Atualizar escopo').edit-btn
                b-dd-item(href="#" @click="update('escopo_previsto')") previsto
                b-dd-item(href="#" @click="update('escopo_realizado')") realizado
            b-col(md='4' sm='12').editable Custo:&nbsp;
              br
              span(v-html='cost(meta)')
              b-dd(variant='outline-primary' size='sm' text='Atualizar custo').edit-btn
                b-dd-item(href="#" @click="update('custo_previsto')") previsto
                b-dd-item(href="#" @click="update('custo_realizado')") realizado
      b-row
        b-col
          h4 Atualizações
      b-table(
        style='font-size="80%"'
        striped
        small
        :sort-desc='true'
        :items='meta.atualizacoes'
        :fields='fields'
        sort-by='id'
      )
        template(slot='apagar' slot-scope='row')
          b-btn(size='sm' variant='outline-secondary' @click.stop='delUpdate(row.item.id)').ml-2
            span.fa.fa-trash
    b-modal(
      size='lg'
      ref='updateModal'
      ok-title='Atualizar'
      cancel-title='Cancelar'
      @ok='handleModalOk'
      hide-header-close
      no-close-on-backdrop
    )
      template(slot='modal-header')
        span Atualizar&nbsp;
          span(style='font-weight: 800') {{ this.modal.title }}
      b-row.mb-2
        b-col.text-right "{{ this.modal.formatter(this.modal.oldValue) }}"
        b-col(
          cols='1'
          :class="'text-'+ (modal.oldValue === modal.newValue || !modal.newValue ? 'danger' : 'primary')"
        )
          span &rArr;
        b-col
          form(@submit.stop.prevent='handleModalSubmit')
            b-form-input(
              v-if="modal.type !== 'textarea'"
              :type="modal.type"
              placeholder='Não deixe este campo vazio'
              v-model='modal.newValue'
            )

</template>
<script>
import gql from 'graphql-tag'
import GET_META from '@/constants/get-meta'
import DELETE_META from '@/constants/delete-meta'
import Helpers from '@/components/Helpers'
import Formatters from '@/components/Formatters'
const { numero, data, dinheiro } = Helpers
const { escopo, cost, deadline } = Formatters
const tableFields = [
  {key: 'createdAt', label: 'Em', formatter: data()},
  {key: 'autor', label: 'Por', formatter: v => v ? v.nome : ''},
  {key: 'titulo', label: 'Objetivo'},
  'resumo',
  'estado',
  {key: 'escopo_previsto', label: 'Escopo previsto', formatter: numero()},
  {key: 'escopo_realizado', label: 'Escopo realizado', formatter: numero()},
  {key: 'inicio_previsto', label: 'Início previsto', formatter: data()},
  {key: 'fim_previsto', label: 'Fim previsto', formatter: data()},
  {key: 'inicio_realizado', label: 'Início', formatter: data()},
  {key: 'fim_realizado', label: 'Fim', formatter: data()},
  {key: 'custo_previsto', label: 'Custo previsto', formatter: dinheiro()},
  {key: 'custo_realizado', label: 'Custo efetivo', formatter: dinheiro()},
  'apagar'
]
export default {
  name: 'Meta',
  data () {
    return {
      loading: 0,
      fields: tableFields,
      meta: {},
      modal: { title: '', field: null, oldValue: null, newValue: null, type: null, formatter: v => v }
    }
  },
  computed: {
    prazo: function () {
      let empty = { field: '', title: '', disabled: true }
      if (!this.meta.id) { // in case of possible failure prevent error
        return empty
      }
      let { inicio_previsto, inicio_realizado, fim_previsto } = this.meta
      inicio_previsto = inicio_previsto !== null
      inicio_realizado = inicio_realizado !== null
      fim_previsto = fim_previsto !== null
      switch (true) {
        case !inicio_previsto: // estado ilegal (inicio_previsto é requerido)
          console.warn('illegal state: inicio_previsto is required')
          return { field: 'inicio_previsto', title: 'previsão de início' }
        case inicio_previsto && !fim_previsto: // estado ilegal (fim_previsto é requerido)
          console.warn('illegal state: fim_previsto is required')
          return { field: 'fim_previsto', title: 'previsão de fim' }
        case inicio_previsto && fim_previsto && !inicio_realizado:
          return { field: 'inicio_realizado', title: 'início da meta' }
        case inicio_previsto && fim_previsto && inicio_realizado:
          return { field: 'fim_realizado', title: 'fim da meta' }
        default:
          return empty
      }
    }
  },
  methods: {
    delUpdate: function (itemId) {
      if (!itemId || itemId < 1) {
        return null
      }
      let vm = this
      let variables = { itemId }
      let mutation = DELETE_META
      this.$apollo.mutate({ mutation, variables })
        .then(response => {
          if (response.error) throw response
          vm.$apollo.queries.meta.refetch({ metaId: this.$route.params.meta })
          if (response.data.deleteAtualizacao === 0) {
            alert('Não foi possível apagar este registro')
          } else {
            alert('Registro apagado')
          }
        })
        .catch(response => {
          console.error('Error:', response)
          alert('Houve um erro, informe o suporte.')
        })
    },
    update: function (field) {
      let fields = {
        'resumo': {title: 'Última ação'},
        'estado': {title: 'Situação'},
        'escopo_realizado': {title: 'Escopo realizado', type: 'number', formatter: numero()},
        'escopo_previsto': {title: 'Escopo previsto', type: 'number', formatter: numero()},
        'inicio_previsto': {title: 'Início previsto', type: 'date', formatter: data()},
        'inicio_realizado': {title: 'Início realizado', type: 'date', formatter: data()},
        'fim_previsto': {title: 'Fim previsto', type: 'date', formatter: data()},
        'fim_realizado': {title: 'Fim realizado', type: 'date', formatter: data()},
        'custo_previsto': {title: 'Custo previsto', type: 'number', formatter: dinheiro()},
        'custo_realizado': {title: 'Custo realizado', type: 'number', formatter: dinheiro()}
      }
      if (!fields[field]) {
        alert('Campo desconhecido')
      } else {
        let f = fields[field]
        this.modal = {
          field,
          type: f.type || 'text',
          title: f.title,
          formatter: f.formatter || (v => v),
          newValue: this.meta[field],
          oldValue: this.meta[field]
        }
        this.$refs.updateModal.show()
      }
    },
    handleModalOk: function (e) {
      e.preventDefault()
      if (!this.modal.newValue || this.modal.newValue === this.modal.oldValue) {
        alert('Atualização indiferente ou vazia')
      } else {
        this.handleModalSubmit()
      }
    },
    handleModalSubmit: function () {
      let { field, newValue, type } = this.modal
      let metaId = this.meta.id
      let value = type === 'text' ? '"' + newValue + '"' : newValue
      let vm = this
      this.$apollo.mutate({
        mutation: gql`
          mutation INSERT_ATUALIZACAO {
            addAtualizacao(meta: ${metaId}, ${field}: ${value}) {
              id
            }
          }
        `
      })
        .then(response => {
          if (response.error) {
            throw response
          }
          vm.$apollo.queries.meta.refetch({ metaId: this.$route.params.meta })
          vm.modal = { title: '', field: null, oldValue: null, newValue: null, type: null, formatter: v => v }
          vm.$refs.updateModal.hide()
        })
        .catch(response => {
          alert('Não foi possível realizar a operação. Por favor informe o suporte.')
          console.error('Response error:', response)
        })
    },
    date: data(),
    money: dinheiro(),
    escopo,
    cost,
    deadline
  },
  apollo: {
    meta: {
      query: GET_META,
      fetchPolicy: 'network-only',
      variables () {
        return { metaId: this.$route.params.meta }
      }
    }
  }
}
</script>
<style scoped>
  .edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.2rem 0.3rem;
  }
  .editable .edit-btn {
    visibility: hidden;
    opacity: 0;
  }
  .editable:hover .edit-btn {
    visibility: visible;
    opacity: 1;
    transition: visibility 0s, opacity 0.2s linear;
    -webkit-transition: visibility 0s, opacity 0.2s linear;
    -moz-transition: visibility 0s, opacity 0.2s linear;
  }
</style>
