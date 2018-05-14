<template lang="pug">
  #meta-view.container.text-left
    b-row
      b-col
        h3 M
          small ETA
          small(v-if='!loading && meta && meta.coordenadoria && meta.coordenadoria.setor && setorId') &nbsp;
            router-link(:to="{name: 'Setor', params: {setorId}}")
              span {{ meta.coordenadoria.setor.sigla }}/
            router-link(:to="{name: 'Coordenadoria', params: {setorId, coordId}}")
              span {{ meta.coordenadoria.sigla }}/
            span {{ new Date(meta.createdAt).getFullYear() }}/
            span {{ meta.id }}
        small(v-if='!loading && meta && !isParent && isChild' href="#")
          router-link(:to="{path: this.meta.pai.id}") Submeta de {{ paiUrl }}
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
      b-card.mb-5
        b-row.mb-2
          b-col(cols='12').editable
            h4.card-title(style="margin-bottom: 0") {{ meta.titulo }}
            b-btn(
              v-if="canUpdate"
              size='sm'
              variant='outline-primary'
              @click="update('titulo')"
            ).edit-btn
              span Atualizar título
        p.card-text
          b-row
            b-col(md='4' sm='12').editable Responsável:&nbsp;
              span(v-if='meta.responsavel') {{ meta.responsavel.nome }}
              small(v-else).text-warning [indefinido]
              //- b-btn(variant='outline-primary' size='sm' @click="update('responsavel')").edit-btn
                span Atualizar
            b-col(md='4' sm='12').editable Última ação:&nbsp;
              span(v-if='meta.resumo') {{ meta.resumo }}
              span(v-else  style='color:rgba(0,0,0,0.5)') [indefinido]
              b-btn(
                v-if="canUpdate"
                size='sm'
                variant='outline-primary'
                @click="update('resumo')"
              ).edit-btn
                span Atualizar ação
            b-col(md='4' sm='12').text-right
              span(v-if='meta.atualizado') Atualizado: {{ date(meta.atualizado) }}
                br
              span Criado: {{ date(meta.createdAt) }}
          b-row.mb-2.mt-4
            b-col(cols='12').editable Situação da meta:&nbsp;
              span(v-if='meta.estado') {{ meta.estado }}
              small(v-else style='color:rgba(0,0,0,0.5)') [indefinido]
              b-btn(
                v-if="canUpdate"
                size='sm'
                variant='outline-primary'
                @click="update('estado')"
              ).edit-btn
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
                v-if="canUpdate"
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
              b-dd(
                v-if='!isParent && canUpdate'
                size='sm'
                variant='outline-primary'
                text='Atualizar escopo'
              ).edit-btn
                b-dd-item(href="#" @click="update('escopo_previsto')") previsto
                b-dd-item(href="#" @click="update('escopo_realizado')") realizado
            b-col(md='4' sm='12').editable Custo:&nbsp;
              br
              span(v-html='cost(meta)')
              b-dd(
                v-if='!isParent && canUpdate'
                variant='outline-primary'
                size='sm'
                text='Atualizar custo'
              ).edit-btn
                b-dd-item(href="#" @click="update('custo_previsto')") previsto
                b-dd-item(href="#" @click="update('custo_realizado')") realizado
      div.text-right(v-if='!loading && !isChild')
        b-btn(variant='primary' @click='addSubmeta') Nova submeta
      div(v-if='!loading && isParent')
        b-row
          b-col
            h4 Submetas
        b-row.mb-5
          b-col
            b-collapse(v-model="collapse.submetas")#collapse-submetas
              b-table(
                striped
                small
                sort-by='id'
                :items='meta.submetas'
                :fields='fields.submetas'
                @row-clicked='navigateToSubmeta'
              )
                //- Estes span com slot são necessários pra renderizar html nas colunas especificadas
                span(slot="escopo" slot-scope="data" v-html="data.value")
                span(slot="prazo" slot-scope="data" v-html="data.value")
                span(slot="custo" slot-scope="data" v-html="data.value")
            b-btn(
              block
              size="sm"
              variant="outline-secondary"
              aria-controls="collapse-submetas"
              :title="collapse.submetas ? 'Ocultar tabela' : 'Exibir tabela'"
              :class="collapse.submetas ? 'collapsed' : null"
              :aria-expanded="collapse.submetas ? 'true' : 'false'"
              @click="collapse.submetas = !collapse.submetas"
            )
              span(v-if="collapse.submetas").fa.fa-chevron-up
              span(v-else).fa.fa-chevron-down
      //- TABELA ATUALIZAÇÕES ################################################################################
      b-row
        b-col
          h4 Atualizações
      b-row.mb-5
        b-col
          b-collapse(v-model="collapse.atualizacoes")#collapse-atualizacoes
            b-table(
              striped
              small
              stacked='md'
              :sort-desc='true'
              :items='atualizacoes'
              :fields='fields.atualizacoes'
              sort-by='id'
            )
              template(slot='apagar' v-if="canUpdate" slot-scope='row')
                b-btn(size='sm' variant='outline-secondary' @click.stop='delUpdate(row.item.id)').ml-2
                  span.fa.fa-trash
          b-btn(
            block
            size="sm"
            variant="outline-secondary"
            aria-controls="collapse-atualizacoes"
            :title="collapse.atualizacoes ? 'Ocultar tabela' : 'Exibir tabela'"
            :class="collapse.atualizacoes ? 'collapsed' : null"
            :aria-expanded="collapse.atualizacoes ? 'true' : 'false'"
            @click="collapse.atualizacoes = !collapse.atualizacoes")
            span(v-if="collapse.atualizacoes").fa.fa-chevron-up
            span(v-else).fa.fa-chevron-down
      //- fim da tabela atualizações #########################################################################
    //- DEFINIÇÃO DO MODAL DE EDIÇÃO DE PROPRIEDADES #########################################################
    b-modal(
      size='lg'
      ref='updateModal'
      ok-title='Atualizar'
      cancel-title='Cancelar'
      @ok='handleModalOk'
      :hide-header-close='true'
      :no-close-on-backdrop='true')
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
            b-select(
              v-if="modal.select"
              :options="modal.select"
              :value-field="modal.value"
              :text-field="modal.text"
              v-model="modal.newValue"
            )
                template(slot="first")
                  option(:value="null" disabled) {{ modal.nullOption }}
            b-form-input(
              v-if="modal.type !== 'textarea' && !modal.select"
              :type="modal.type"
              placeholder='Não deixe este campo vazio'
              v-model='modal.newValue'
              required
            )
      b-row
        b-col
          b-form-input(
            type='text'
            placeholder='Descreva o motivo da atualização'
            v-model='modal.reason'
            required
          )

</template>
<script>
import gql from 'graphql-tag'
import GET_META from '@/constants/get-meta'
import DELETE_META from '@/constants/delete-meta'
import GET_USUARIOS from '@/constants/get-usuarios'
import Helpers from '@/components/Helpers'
import Formatters from '@/components/Formatters'
import moment from 'moment'
const { numero, data, dinheiro } = Helpers
const { escopo, cost, deadline } = Formatters
const tableFields = [{key: 'em', formatter: v => moment(v).format('LLL')}, 'por', 'campo', 'de', 'para', 'motivo', 'apagar']
let money = v => Helpers.dinheiro()(v) || 'R$0,00'
const subFields = [
  {key: 'titulo', label: 'Título', formatter: (v, k, i) => v},
  {key: 'responsavel', label: 'Responsável', formatter: v => v === null ? '' : v.nome},
  {key: 'escopo', formatter: (v, k, i) => numero()(i.escopo_realizado || 0) + '/' + numero()(i.escopo_previsto || 0)},
  {key: 'prazo', formatter: Formatters.prazo()},
  {
    key: 'custo',
    label: 'Gasto',
    formatter: (v, k, i) => `
      ${money(i.custo_realizado)}&nbsp;
      <small>/${money(i.custo_previsto)}</small>`
  }
]
export default {
  name: 'Meta',
  data () {
    return {
      loading: 0,
      fields: {
        atualizacoes: tableFields,
        submetas: subFields
      },
      collapse: {
        atualizacoes: false,
        submetas: false
      },
      usuarios: [],
      meta: {},
      modal: {
        title: '',
        field: null,
        reason: null,
        oldValue: null,
        newValue: null,
        type: null,
        formatter: v => v
      }
    }
  },
  computed: {
    atualizacoes: function () {
      // validação dos dados para garantir um fallback em caso de problemas (falta de dados)
      if (!(this.meta && this.meta.atualizacoes && this.meta.atualizacoes.length > 0)) {
        return []
      }
      // Array: cópia local dos dados recuperados do banco de dados como relacionamento da meta
      let atualizacoes = this.meta.atualizacoes
      let controlHeaders = ['__typename', 'id', 'meta', 'motivo', 'createdAt', 'updatedAt', 'autor']
      let datas = ['inicio_previsto', 'fim_previsto', 'inicio_realizado', 'fim_realizado']
      let numeros = ['escopo_previsto', 'escopo_realizado']
      let monetarios = ['custo_previsto', 'custo_realizado']
      let headers = Object.keys(atualizacoes[0]).filter(h => controlHeaders.indexOf(h) < 0)
      return atualizacoes.map((atualizacao, idx, atualizacoes) => {
        let campo = headers
          .filter(h => atualizacao[h] !== null)
          .reduce((p, a) => a, null)
        let para = campo ? atualizacao[campo] : null
        if (numeros.indexOf(campo) >= 0) {
          para = numero()(para)
        } else if (datas.indexOf(campo) >= 0) {
          para = moment(para).format('LL')
        } else if (monetarios.indexOf(campo) >= 0) {
          para = dinheiro()(para)
        }
        return {
          id: atualizacao.id,
          em: atualizacao.createdAt,
          por: atualizacao.autor ? atualizacao.autor.nome : '',
          campo: campo.split('_').map((v, k) => k === 0 ? v.charAt(0).toUpperCase() + v.substring(1) : v).join(' '),
          de: null,
          para,
          motivo: atualizacao.motivo
        }
      })
    },
    canUpdate: function () {
      let app = this.$root.$children[0]
      if (!app) {
        return false
      }
      let usr = app.usuario
      if (!usr) {
        return false
      }
      let owner = this.meta.responsavel
      let meta_update = usr.permissoes['meta_update']
      let own_meta_update = usr.permissoes['own_meta_update']
      return meta_update || (owner.id === usr.id && own_meta_update)
    },
    permissoes: function () {
      let usr = this.$root.usuario
      return usr ? usr.permissoes : {}
    },
    paiUrl: function () {
      if (this.meta && this.meta.pai) {
        return `${this.meta.coordenadoria.setor.sigla}/${this.meta.coordenadoria.sigla}/${(new Date()).getFullYear()}/${this.meta.pai.id}`
      } else {
        return ``
      }
    },
    isParent: function () {
      return !!this.meta && !!this.meta.submetas && this.meta.submetas.length > 0
    },
    isChild: function () {
      return !!this.meta && !!this.meta.pai
    },
    coordId: function () {
      if (this.meta && this.meta.coordenadoria) {
        return this.meta.coordenadoria.id
      }
    },
    setorId: function () {
      if (this.meta && this.meta.coordenadoria && this.meta.coordenadoria.setor) {
        return this.meta.coordenadoria.setor.id
      }
      return 0
    },
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
    addSubmeta: function () {
      console.log('pai', this.meta.id)
      this.$router.push({
        name: 'AddSubMeta',
        params: {
          setor: this.meta.coordenadoria.setor.sigla,
          coordenadoria: this.meta.coordenadoria.sigla,
          pai: this.meta.id
        }
      })
    },
    navigateToSubmeta: function (item) {
      this.$router.push({
        name: 'Meta',
        params: {
          setor: this.meta.coordenadoria.setor.sigla,
          coordenadoria: this.meta.coordenadoria.sigla,
          year: (new Date()).getFullYear(),
          meta: item.id
        }
      })
    },
    toggle: function (v) { v = !v },
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
          vm.$apollo.queries.meta.refetch({ metaId: this.meta.id })
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
        titulo: {title: 'Nome/Título/Objeto da meta'},
        resumo: {title: 'Última ação'},
        estado: {title: 'Situação'},
        inicio_previsto: {title: 'Início previsto', type: 'date', formatter: data()},
        inicio_realizado: {title: 'Início realizado', type: 'date', formatter: data()},
        fim_previsto: {title: 'Fim previsto', type: 'date', formatter: data()},
        fim_realizado: {title: 'Fim realizado', type: 'date', formatter: data()},
        responsavel: {
          title: 'Responsável',
          type: 'number',
          select: this.usuarios,
          value: 'id',
          text: 'nome',
          nullOption: 'Escolha um usuário',
          formatter: v => v ? v.nome : ''
        }
      }
      if (!this.isParent) {
        fields = {
          ...fields,
          escopo_realizado: {title: 'Escopo realizado', type: 'number', formatter: numero()},
          escopo_previsto: {title: 'Escopo previsto', type: 'number', formatter: numero()},
          custo_previsto: {title: 'Custo previsto', type: 'number', formatter: dinheiro()},
          custo_realizado: {title: 'Custo realizado', type: 'number', formatter: dinheiro()}
        }
      }
      if (!fields[field]) {
        alert('Campo desconhecido')
      } else {
        let f = fields[field]
        console.log('field', field, f)
        this.modal = {
          field,
          type: f.type || 'text',
          title: f.title,
          formatter: f.formatter || (v => v),
          newValue: f.select ? f.select[f.value] : this.meta[field],
          oldValue: f.select ? f.select[f.value] : this.meta[field],
          select: f.select || false
        }
        console.log('modal', this.modal)
        this.$refs.updateModal.show()
      }
    },
    handleModalOk: function (e) { // error checking before processing
      e.preventDefault()
      let newValueIsEmpty = !this.modal.newValue
      let newValueIsEqual = this.modal.newValue === this.modal.oldValue
      let reasonIsEmpty = !this.modal.reason
      if (newValueIsEmpty) {
        alert('Novo "' + this.modal.title + '" não pode ser vazio e/ou nulo.')
      } else if (newValueIsEqual) {
        alert('Novo "' + this.modal.title + '" deve ser diferente do anterior.')
      } else if (reasonIsEmpty) {
        alert('Deve existir motivo para alteração de "' + this.modal.title + '"')
      } else {
        this.handleModalSubmit()
      }
    },
    handleModalSubmit: function () {
      let { field, newValue, type, reason } = this.modal
      let metaId = this.meta.id
      let value
      if (type === 'date') {
        value = (new Date(newValue + ' 00:00')).getTime()
      } else if (type === 'number') {
        value = Number(newValue)
      } else {
        value = JSON.stringify(newValue)
      }
      let app = this.$root.$children[0]
      let usuario = app.usuario
      let vm = this
      this.$apollo.mutate({
        mutation: gql`
          mutation INSERT_ATUALIZACAO {
            addAtualizacao(
              meta: ${metaId},
              motivo: "${reason}",
              autor: ${usuario.id}
              ${field}: ${value}) {
              id
            }
          }
        `
      })
        .then(response => {
          if (response.error) {
            throw response
          }
          // vm.$apollo.queries.meta.refetch({ metaId: this.meta.id })
          vm.modal = {
            title: '',
            field: null,
            oldValue: null,
            newValue: null,
            type: null,
            formatter: v => v
          }
          vm.$refs.updateModal.hide()
          vm.$router.go({
            name: 'Meta',
            params: {
              setor: this.meta.coordenadoria.setor.sigla,
              coordenadoria: this.meta.coordenadoria.sigla,
              year: (new Date()).getFullYear(),
              meta: this.meta.id
            }
          })
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
    usuarios: {
      query: GET_USUARIOS
    },
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
