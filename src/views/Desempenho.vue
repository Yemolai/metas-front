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
      b-col(v-if="!loading && diretoria && 'nome' in diretoria" sm='12').visible-sm
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
const logging = false
const log = (...args) => logging ? console.log(...args) : null

export default {
  name: 'PainelDesempenho',
  components: {
    YearProgress,
    ScopeMeter,
    MetasTable
  },
  mounted () {
    log('@mounted!')
    log(this.loading ? 'still loading' : 'already loaded', '@mounted')
    let params = this.$route.params
    if (params) {
      log('params:', params)
      let diretoria = params.setor
      let coordenadoria = params.coordenadoria
      let page = params.page
      if (diretoria) {
        log('diretoria:', diretoria)
        this.diretoria = diretoria
        if (coordenadoria) {
          log('coordenadoria:', coordenadoria)
          this.coordenadoria = coordenadoria
          if (page) {
            this.setPage(page)
          }
        }
      }
    }
  },
  watch: {
    setorId: function (newValue, oldValue) {
      log('setorId changed:', oldValue, '→', newValue)
      this.diretoria = newValue
    },
    diretoria: function (newDiretoria, oldDiretoria) {
      log('diretoria changed:', oldDiretoria, '→', newDiretoria)
      if (newDiretoria && newDiretoria !== oldDiretoria) {
        this.updateParams({ setor: newDiretoria.sigla, coordenadoria: null })
        if (oldDiretoria !== null || this.coordenadoriaId !== null) {
          this.coordenadoriaId = null
        }
      }
    },
    coordenadoriaId: function (newValue, oldValue) {
      log('coordenadoriaId changed:', oldValue, '→', newValue)
      this.coordenadoria = newValue
    },
    coordenadoria: function (newCoordenadoria, oldCoordenadoria) {
      log('coordenadoria changed:', oldCoordenadoria, '→', newCoordenadoria)
      if (newCoordenadoria && newCoordenadoria !== oldCoordenadoria) {
        this.updateParams({ coordenadoria: newCoordenadoria.sigla })
      }
    },
    page: function (page, oldPage) {
      log('page changed:', oldPage, '→', page)
      if (page !== oldPage) {
        this.updateParams({ page })
      }
    }
  },
  methods: {
    updateMetas: function () {
      let metas = this.coordenadoria === null ? [] : this.coordenadoria.metas || []
      log('updating metas with', metas)
      Object.assign(this, { metas })
    },
    // método para atualizar os parâmetros atuais da rota como estado
    updateParams: function (newParams) {
      let params = Object.assign(this.$route.params, newParams)
      log('update params:', this.$route.params, '→', params)
      this.$router.push({ name: 'PainelDesempenho', params })
    },
    // método para definir a página no estado como parâmetro
    setPage: function (page) {
      console.log('setPage')
      if (!isNaN(Number(page)) && page > 1) {
        this.page = page
        this.updateParams({ page })
      }
    }
  },
  computed: {
    diretoria: {
      get: function () {
        return !this.loading && this.setores // se tivermos setores carregados
          ? this.setorSelecionado
          : null // se não, retorna objeto vazio
      },
      set: function (newValue) {
        if (!this.loading && this.setores) {
          let id = isNaN(Number(newValue)) ? 0 : Number(newValue)
          let sigla = typeof newValue === 'string' ? newValue : null
          log('set diretoria from', ...(id ? ['id:', id] : ['sigla:', sigla]))
          let setor = null
          if (id !== 0) {
            setor = this.setores
              .filter(s => Number(s.id) === id)
              .reduce((p, a) => a, null)
          } else if (sigla !== null) {
            setor = this.setores
              .filter(s => s.sigla === sigla)
              .reduce((p, a) => a, null)
            this.setorId = setor ? setor.id : null
          }
          log('new setor:', setor)
          this.setorSelecionado = setor
        }
        this.updateMetas()
      }
    },
    coordenadorias: function () {
      return this.diretoria ? this.diretoria.coordenadorias || [] : []
    },
    coordenadoria: {
      get: function () {
        return !this.loading && this.setorSelecionado && this.coordenadoriaSelecionada
          ? this.coordenadoriaSelecionada
          : null
      },
      set: function (newValue) {
        log('set coordenadoria =', newValue)
        if (!this.loading && this.setor) {
          let id = isNaN(Number(newValue)) ? 0 : Number(newValue)
          let sigla = typeof newValue === 'string' ? newValue : null
          let coordenadorias = this.setor ? this.setor.coordenadorias || [] : []
          log('coordenadorias:', coordenadorias)
          let coordenadoria = null
          if (id !== 0) {
            log('set diretoria from', 'id:', id)
            coordenadoria = coordenadorias
              .filter(c => Number(c.id) === id)
              .reduce((p, a) => a, null)
          } else if (sigla !== null) {
            log('set diretoria from', 'sigla:', sigla)
            coordenadoria = coordenadorias
              .filter(c => c.sigla === sigla)
              .reduce((p, a) => a, null)
            this.coordenadoriaId = coordenadoria ? coordenadoria.id : null
          }
          log('new coordenadoria:', coordenadoria)
          this.coordenadoriaSelecionada = coordenadoria
        }
        this.updateMetas()
      }
    },
    // retorna a página atual
    page: function () {
      return this.$route.params ? this.$route.params.page : 1
    }
  },
  data () {
    return {
      loading: 0,
      sortDesc: true,
      setores: [], // lista de setores do banco de dados
      setorSigla: null, // sigla do setor selecionada
      coordenadoriaSigla: null, // sigla da coordenadoria selecionada
      setorId: null,
      coordenadoriaId: null,
      setorSelecionado: null,
      coordenadoriaSelecionada: null,
      metas: [],
      setor: null
    }
  },
  apollo: {
    setores: { query: GET_SETORES },
    setor: {
      query: function () {
        let GET_NULLABLE_META = gql`{ setor(id: 0) {id} }`
        return !this.setorSelecionado ? GET_NULLABLE_META : GET_METAS_SETOR
      },
      variables: function () {
        return {
          submetas: false,
          setorId: this.setorSelecionado ? this.setorSelecionado.id : 0
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
