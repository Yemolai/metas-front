<template lang="pug">
  b-container#painel-de-desempenho
    h3.text-center.mt-4 Painel de desempenho
    hr
    h4(v-if='loading') Carregando...
    b-row(v-else)
      b-col(md="10" sm='8')
        b-row
          //- Barra de progresso de ano
          b-col.year-progress-container
            year-progress
        b-row
          b-col(md='6' sm='12')
            //- Seletor de diretoria
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
            p.text-left {{ setor ? setor.nome || '' : '' }}
        b-row
          b-col(md='6' sm='12')
            b-form-select.mb-3(
              v-model="coordenadoriaId"
              :options="coordenadorias"
              value-field='id'
              text-field='sigla'
            )
              template(slot='first' selected)
                option(:value='null' disabled) {{diretoria ? '-- Selecione a coordenadoria --' : ''}}
          b-col(v-if='!loading && coordenadoria !== null' sm='12' md='6').coordenadoria-nome.hidden-sm
            p.text-left {{ coordenadoria ? coordenadoria.nome || '' : '' }}
      b-col(md='2' sm='4').hidden-md-down
        center
          ScopeMeter(:lista-de-metas='metas')
      b-col(v-if="!loading && setor && 'nome' in setor" sm='12').visible-sm
        h4 {{ setor ? setor.sigla || '' : '' }} - {{ setor ? setor.nome || '' : '' }}
      b-col(v-if="!loading && coordenadoria && 'nome' in coordenadoria" sm='12').visible-sm
        h4 {{ coordenadoria ? coordenadoria.sigla || '' : '' }} - {{ coordenadoria ? coordenadoria.nome || '' : '' }}
    //- tabela:
    b-container.table.text-left.mx-0.px-0
      MetasTable(
        :items='metas'
        :set-page='setPage'
        :get-page='page'
      )
</template>

<script>
import YearProgress from '@/components/YearProgress'
import MetasTable from '@/components/MetasTable'
import ScopeMeter from '@/components/ScopeMeter'
import GET_SETORES from '@/constants/get-setores'
import GET_METAS_SETOR from '@/constants/get-metas-setor'
import gql from 'graphql-tag'

export default {
  name: 'painel-de-desempenho',
  components: {
    YearProgress,
    ScopeMeter,
    MetasTable
  },
  mounted () {
    console.log('mounted')
    this.updateSelected()
  },
  watch: {
    '$route.params.setor': function (newValue, oldValue) {
      console.log('changed param setor', newValue, oldValue)
      if (newValue !== oldValue) {
        console.log('newSetor !== oldSetor')
        this.updateSelected()
      }
    },
    '$route.params.coordenadoria': function (newValue, oldValue) {
      console.log('changed param coordenadoria')
      if (newValue !== oldValue) {
        this.updateSelected()
      }
    }
  },
  methods: { // d para diretoria; dc para diretorias com coordenadorias e c para coordenadorias
    updateParams: function (params) {
      console.log('updateParams')
      let newParams = Object.assign(this.$route.params, params)
      this.$router.push({ name: 'PainelDesempenho', newParams })
    },
    setPage: function (page) {
      console.log('setPage')
      if (!isNaN(Number(page)) && page > 1) {
        this.page = page
        this.updateParams({ page })
      }
    },
    updateSelected: function () {
      console.log('updateSelected')
      let sid = this.setores && (this.setores instanceof Array) && this.siglaSetor
        ? this.setores
          .filter(s => s.sigla === this.siglaSetor)
          .reduce((p, a) => a.id, null)
        : null
      let cid = this.setores && (this.setores instanceof Array) && this.siglaCoordenadoria && sid
        ? this.setores
          .filter(s => s.sigla === this.siglaSetor)
          .reduce((p, a) => a.coordenadorias, [])
          .filter(c => c.sigla === this.siglaCoordenadoria)
          .reduce((p, a) => a.id, null)
        : null
      this.setorId = sid
      console.log('this.setorId:', this.setorId)
      this.coordenadoriaId = cid
      console.log('this.coordenadoriaId:', this.coordenadoriaId)
    }
  },
  computed: {
    page: function () {
      console.log('page')
      return this.$route.params ? this.$route.params.page : 1
    },
    metas: function () {
      console.log('metas')
      if (this.diretoria === null || this.loading === 1) {
        return []
      }
      if (this.coordenadoria === null || this.loading === 1) {
        return []
      }
      return this.setores
        .filter(s => s.id === this.setor)
        .reduce((p, a) => a.coordenadorias, [])
        .filter(c => c.id === this.coordenadoriaId)
        .reduce((p, a) => a.metas, [])
    },
    // @param :setor?
    // identificador numérico do setor ligado ao parâmetro
    setorId: {
      get: function () {
        console.log('get setorId', this.diretoria)
        return this.diretoria
      },
      set: function (newValue) {
        console.log('set setorId:', newValue)
        this.diretoria = newValue
      }
    },
    // @param :coordenadoria?
    // identificador numérico da coordenadoria ligado ao parâmetro
    coordenadoriaId: {
      get: function () {
        console.log('get coordenadoriaId', this.coordenadoria)
        return this.coordenadoria
      },
      set: function (newValue) {
        let coordenadoria = this.setores
          .filter(s => s.id === this.setorId)
          .reduce((p, a) => a.coordenadorias, [])
          .filter(c => c.id === newValue)
          .reduce((p, a) => a.id, this.siglaCoordenadoria)
        this.$router
          .push({
            name: 'PainelDesempenho',
            params: { setor: this.setorId, coordenadoria, page: this.page }
          })
        this.coordenadoria = newValue
      }
    },
    // lista de coordenadorias para ser usado no dropdown
    coordenadorias: function () {
      return !this.loading && this.setores && this.diretoria
        ? this.setores
          .filter(s => s.id === this.diretoria)
          .reduce((p, a) => a.coordenadorias, {}) || []
        : []
    }
  },
  data () {
    let params = this.$route.params
    let siglaSetor = params && params.setor ? params.setor : null
    let siglaCoordenadoria = params && params.coordenadoria ? params.coordenadoria : null
    return {
      loading: 0,
      setores: [],
      setor: {},
      diretoria: (this.setorId || null),
      coordenadoria: (this.coordenadoriaId || null),
      siglaSetor,
      siglaCoordenadoria
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
        return {
          submetas: false,
          setorId: isNaN(Number(this.diretoria)) ? 0 : this.diretoria
        }
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
