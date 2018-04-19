<template lang='pug'>
  b-container#painel-de-resultados
    h3.text-center.mt-4 Painel de resultados
    hr
    h4(v-if="loading") Carregando...
    b-row(v-else)
      b-col(md='10' sm='8')
        b-row
          //- Barra de progresso de ano
          b-col.year-progress-container
            year-progress
        b-row
          b-col(md='6' sm='12')
            //- Seletor de diretoria ===
            b-form-select.mb-3(
              v-model='setorId'
              :options='setores'
              value-field='id'
              text-field='sigla'
            )
              //- Aqui entra a primeira opção nula
              template(slot='first' selected)
                option(:value='null' disabled) -- Escolha uma diretoria --
          b-col(v-if='!loading && diretoria !== null' sm='12' md='6').diretoria-nome.hidden-sm
            p.text-left
              span {{ setor.nome || '' }}
      b-col(md='2' sm='4').hidden-md-down
        center
          //- Esse componente ainda não é dinâmico
          ScopeMeter(:lista-de-metas='metas')
      b-col(v-if="!loading && setor && 'nome' in setor" sm='12').visible-sm
        h4 {{ setor.sigla || '' }} - {{ setor.nome || '' }}
    //- tabela:
    b-container.table.text-left.mx-0.px-0
      MetasTable(:items='metas' :set-page='setPage' :get-page='page')
</template>
<script>
import YearProgress from '@/components/YearProgress'
import MetasTable from '@/components/MetasTable'
import ScopeMeter from '@/components/ScopeMeter'
import GET_SETORES from '@/constants/get-setores'
import GET_METAS_SETOR from '@/constants/get-metas-setor'
import gql from 'graphql-tag'

export default {
  name: 'painel-de-resultados',
  components: {
    YearProgress,
    ScopeMeter,
    MetasTable
  },
  watch: {
    '$route.params.setor': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateSelectedSetor()
      }
    }
  },
  mounted: function () {
    this.updateSelectedSetor()
  },
  methods: {
    updateParams: function (params) {
      let newParams = Object.assign(this.$route.params, params)
      this.$router.push({ name: 'PainelResultados', newParams })
    },
    setPage: function (page) {
      if (!isNaN(Number(page)) && page > 1) {
        this.page = page
        this.updateParams({ page })
      }
    },
    updateSelectedSetor: function () {
      let params = this.$route.params
      let sigla = params && params.setor ? params.setor : null

      let id = this.setores && this.setores instanceof Array && sigla
        ? this.setores
          .filter(s => s.sigla === sigla)
          .reduce((p, a) => a.id, null)
        : null
      this.setorId = id
    }
  },
  computed: {
    page: function () {
      return this.$route.params ? this.$route.params.page : 1
    },
    // lista de metas da diretoria selecionada
    metas: function () {
      if (this.diretoria === null || this.loading === 1) {
        return []
      }
      let Cs = this.setor.coordenadorias
      return Cs.map(c => (c.metas || [])).reduce((p, a) => p.concat(a), [])
    },
    setorId: {
      get: function () {
        return this.diretoria
      },
      set: function (newValue) {
        let setor = this.setores.filter(s => s.id === newValue).reduce((p, a) => a.sigla, this.sigla)
        this.$router.push({ name: 'PainelResultados', params: { setor, page: this.page } })
        this.diretoria = newValue
      }
    }
  },
  data () {
    let params = this.$route.params
    let sigla = params && params.setor ? params.setor : null
    return {
      loading: 0, // isApolloStillLoading flag
      setores: [], // list with all instances of setor
      setor: {}, // selected setor instance
      diretoria: (this.setorId || null),
      sigla,
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
        return { submetas: false, setorId: isNaN(Number(this.diretoria)) ? 0 : this.diretoria }
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
  .hidden-sm {
      display: block;
    }
    .visible-sm {
      display: none;
    }
  @media screen and (max-width: 575px) {
    .hidden-sm {
      display: none;
    }
    .visible-sm {
      display: block;
    }
  }
</style>
