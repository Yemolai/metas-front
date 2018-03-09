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
        b-btn(variant='outline-secondary' size='sm')
          span.fa.fa-angle-down
    h4(v-if='loading') Carregando...
    div(v-else)#meta-details
      b-card(
        :title='meta.titulo'
      ).mb-2
        p.card-text
          b-row.mb-2
            b-col(md='4' sm='12') Responsável:&nbsp;
              span(v-if='meta.responsavel') {{ meta.responsavel.nome }}
              small(v-else).text-warning [indefinido]
            b-col(md='4' sm='12') Última ação:&nbsp;
              span(v-if='meta.resumo') {{ meta.resumo }}
              span(v-else)
            b-col(md='4' sm='12').text-right Última atualização:&nbsp;
              span(v-if='meta.atualizado') {{ date(meta.atualizado) }}
              span(v-else) {{ date(meta.createdAt) }} (criação)
          b-row.mb-2
            b-col(md='9' sm='12') Situação da meta:&nbsp;
              span(v-if='meta.estado') {{ meta.estado }}
              small(v-else) [indefinido]
          hr
          b-row.mb-2
            b-col(md='4' sm='12') Prazo:&nbsp;
              span(v-html='deadline(null, null, meta)')
              br
              span {{ date(meta.inicio_realizado) || '?' }} -&nbsp;
              span {{ date(meta.fim_realizado) || '?' }}
              br
              small (previsto: {{ date(meta.inicio_previsto) || '?' }} - &nbsp;
                span {{ date(meta.fim_previsto) || '?' }})
            b-col(md='4' sm='12') Escopo:&nbsp;
              br
              span(v-html='escopo(null, null, meta)')
            b-col(md='4' sm='12') Custo:&nbsp;
              br
              span(v-html='cost(meta)')
      b-row
        b-col
          h4 Atualizações
        b-col.text-right
          b-btn(variant='primary' size='sm' @click='updateMeta')
            span.fa.far.fa-edit &nbsp;
            span Alterar esta meta
      b-table(
        style='font-size="80%"'
        striped
        small
        :sort-desc='true'
        :items='meta.atualizacoes'
        :fields='fields'
        sort-by='id'
      )
</template>
<script>
import GET_META from '@/constants/get-meta'
import Helpers from '@/components/Helpers'
import Formatters from '@/components/Formatters'
import router from '@/router'
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
  {key: 'custo_realizado', label: 'Custo efetivo', formatter: dinheiro()}
]
export default {
  name: 'Meta',
  data () {
    return {
      loading: 0,
      fields: tableFields,
      meta: {}
    }
  },
  methods: {
    updateMeta: function () {
      router.push({ name: 'UpdateMeta', params: this.$route.params })
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
