<template lang='pug'>
  b-container(fluid)#painel-de-resultados
    h3.text-center.mt-4 Painel de resultados
    hr
    h4(v-if="loading") Carregando...
    b-row(v-else)
      b-col(md='10' sm='12')
        b-row
          //- Barra de progresso de ano
          b-col(cols='12').year-progress-container
            year-progress
          b-col(cols='4')
            //- Seletor de diretoria ===
            b-form-select.mb-3(
              v-model='diretoria'
              :options='setores'
              value-field='id'
              text-field='sigla'
            )
              //- Aqui entra a primeira opção nula
              template(slot='first' selected)
                option(:value='null' disabled) -- Escolha uma diretoria --
          b-col(cols='8').diretoria-nome
            p.text-left(v-if='diretoria !== null')
              span {{ setor.nome || '' }}
      b-col(v-if='window.innerWidth > 992' md='2' sm='12')
        //- Esse componente ainda não é dinâmico
        ScopeMeter(:lista-de-metas='metas')
    //- tabela:
    b-container.table.text-left
      b-table(
        :sort-compare='sort'
        @row-clicked='goToMeta'
        :items='metas'
        :fields='campos'
        stacked='md'
        striped
      )
</template>
<script>
import router from '@/router'
import YearProgress from '@/components/YearProgress'
import ScopeMeter from '@/components/ScopeMeter'
import Formatters from '@/components/Formatters'
import GET_SETORES from '@/constants/get-setores'
import GET_METAS_SETOR from '@/constants/get-metas-setor'
import gql from 'graphql-tag'
import sortMetas from '@/components/sort'

const campos = [
  {
    key: 'setor',
    formatter: (v, k, i) => i ? `${i.coordenadoria.setor.sigla} / ${i.coordenadoria.sigla}` : '',
    sortable: true
  },
  {
    key: 'titulo',
    label: 'Meta',
    sortable: true
  },
  {
    key: 'resumo',
    label: 'Ação/Análise',
    sortable: true
  },
  {
    key: 'responsavel',
    label: 'Responsável',
    formatter: v => v && v !== null ? v.nome : '',
    sortable: true
  },
  {
    key: 'escopo',
    formatter: Formatters.escopo,
    sortable: true
  },
  {
    key: 'prazo',
    formatter: Formatters.deadline,
    sortable: true
  },
  {
    key: 'custo',
    formatter: (v, k, i) => Formatters.cost(i),
    sortable: true
  }
]
export default {
  name: 'painel-de-resultados',
  components: {
    YearProgress,
    ScopeMeter
  },
  methods: {
    sort: sortMetas,
    // metodo executado para navegar para uma meta
    goToMeta: function (item) {
      return router
        .push({
          name: 'Meta',
          params: {
            setor: item.coordenadoria.setor.sigla,
            coordenadoria: item.coordenadoria.sigla,
            year: (new Date()).getFullYear(),
            meta: item.id
          }
        })
    }
  },
  watch: {
    // observacao do model do dropdown para efetuar navegacao
    diretoria: function (newValue, oldValue) {
      // apenas agir se o valor antigo for diferente do novo e não for nulo
      if (newValue !== oldValue && newValue !== null) {
        let setor = this.setores.filter(s => s.id === newValue)
          .reduce((p, a) => a.sigla, null)
        let route = { name: 'PainelResultados', params: {setor, page: 1} }
        console.log('route', route)
        this.$router.push(route)
      }
    }
  },
  computed: {
    // lista de metas da diretoria selecionada
    metas: function () {
      if (this.diretoria === null || this.loading === 1) {
        return []
      }
      let Cs = this.setor.coordenadorias
      return Cs.map(c => (c.metas || [])).reduce((p, a) => p.concat(a), [])
    }
  },
  data () {
    let params = this.$router.params
    let sigla = params && params.setor ? params.setor : null
    let page = params && params.page ? params.page : 1
    return {
      loading: 0, // isApolloStillLoading flag
      diretoria: null, // selected setor reference id
      setores: [], // list with all instances of setor
      setor: {}, // selected setor instance
      campos,
      sigla,
      page,
      window // window reference
    }
  },
  apollo: {
    setores: { query: GET_SETORES },
    setor: {
      query: function () {
        let GET_NULLABLE_META = gql`{ setor(id: 0) {id} }`
        return (this.diretoria === null) ? GET_NULLABLE_META : GET_METAS_SETOR
      },
      variables: function () {
        return { submetas: false, setorId: this.diretoria || 0 }
      }
    }
  }
}
</script>
<style scoped>
  /* Here lies the component Style */
  .year-progress-container {
    margin-bottom: 1rem;
  }
  .diretoria-nome {
    padding-top: 0.5rem;
  }
</style>
