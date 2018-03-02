<template lang="pug">
  #meta-view.container.text-left
    h3 M
      small ETA
    h4(v-if='loading') Carregando...
    div(v-else)#meta-details
      h4 {{ meta.titulo }}
        br
        small Responsável:&nbsp;
          span(v-if='meta.responsavel') {{ meta.responsavel.nome }}
      p Última atualização: {{ date(meta.atualizado) || '[createdAt]'}}
      p Resumo:&nbsp;
        span(v-if='meta.resumo') {{ meta.resumo }}
        span(v-else) [vazio]
      p Estado:&nbsp;
        span(v-if='meta.estado') {{ meta.estado }}
        span(v-else) [vazio]
      b-row
        b-col
          p Escopo: {{ meta.escopo_realizado || 0 }}/
            small {{ meta.escopo_previsto }}
        b-col
          p Custo: {{ money(meta.custo_realizado || 0) }}/
            small {{ money(meta.custo_previsto || 0) }}
      p Prazo:&nbsp;
        span {{ date(meta.inicio_realizado) || '?' }} -&nbsp;
        span {{ date(meta.fim_realizado) || '?' }}&nbsp;
        small (previsto: {{ date(meta.inicio_previsto) || '?' }} - &nbsp;
          span {{ date(meta.fim_previsto) || '?' }})
      h4 Atualizações
      b-table(
        striped
        small
        :sort-desc='true'
        :items='atualizacoes'
        :fields='fields'
        sort-by='id'
      )
</template>
<script>
import GET_META from '@/constants/get-meta'
import GET_ATUALIZACOES from '@/constants/get-atualizacoes'
// import Helpers from '@/components/Helpers'
// const { numero, data, dinheiro } = Helpers
const numero = v => v ? Number(v).toFixed(2).replace('.', ',') : ''
const data = (locale = 'pt-BR') => (v) => v ? new Date(v).toLocaleDateString(locale) : ''
const dinheiro = (currency = 'R$', position = 'pre', decimal = ',', thousands = '.') => (value) => {
  if (value === null) return ''
  let numero = value.toFixed(2).split('.')
  numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.')
  if (position !== 'pre') {
    return numero.join(',') + '' + currency
  }
  return currency + '' + numero.join(',')
}
const tableFields = [
  {key: 'id', label: '#'},
  {key: 'titulo', label: 'Título'},
  'resumo',
  'estado',
  {key: 'escopo_previsto', label: 'E*', formatter: numero},
  {key: 'escopo_realizado', label: 'E', formatter: numero},
  {key: 'inicio_previsto', label: 'T0*', formatter: data()},
  {key: 'fim_previsto', label: 'Tf*', formatter: data()},
  {key: 'inicio_realizado', label: 'T0', formatter: data()},
  {key: 'fim_realizado', label: 'Tf', formatter: data()},
  {key: 'custo_previsto', label: 'C*', formatter: dinheiro()},
  {key: 'custo_realizado', label: 'C', formatter: dinheiro()},
  {key: 'createdAt', label: 'Data', formatter: data()}
]
export default {
  name: 'Meta',
  data () {
    return {
      loading: 0,
      atualizacoes: [],
      fields: tableFields,
      meta: {}
    }
  },
  methods: {
    date: data(),
    money: dinheiro()
  },
  apollo: {
    meta: {
      query: GET_META,
      variables () {
        return { metaId: this.$route.params.meta }
      }
    },
    atualizacoes: {
      query: GET_ATUALIZACOES,
      variables () {
        let meta = this.$route.params.meta
        return JSON.stringify({ filter: { where: { meta } } })
      }
    }
  }
}
</script>
