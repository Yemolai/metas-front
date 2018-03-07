<template lang='pug'>
  b-container#painel-de-resultados
    h4(v-if="loading") Carregando...
    b-row(v-else)
      b-col(md='10' sm='12')
        b-row
          //- Barra de progresso de ano
          b-col(cols='12').year-progress-container
            year-progress
          b-col(cols='4')
            //- Seletor de diretoria
            b-form-select.mb-3(
              v-model='form.diretoria'
              :options='listaDiretorias'
              value-field='id'
              text-field='sigla'
            )
              //- Aqui entra a primeira opção nula
              template(slot='first' selected)
                option(:value='null' disabled) -- Escolha uma diretoria --
          b-col(cols='8').diretoria-nome
            p.text-left(v-if='form.diretoria !== null')
              span {{ setor.nome || '' }}
      b-col(v-if='w > 992' md='2' sm='12')
        //- Esse componente ainda não é dinâmico
        RadialProgress(:chart-data='[[75, 100]]').limit-height.negative-borders
    //- tabela:
    b-container.table.text-left
      b-table(
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
import RadialProgress from '@/components/RadialProgress'
import Formatters from '@/components/Formatters'
import GET_SETORES from '@/constants/get-setores'
import GET_METAS_SETOR from '@/constants/get-metas-setor'
import gql from 'graphql-tag'
const campos = [
  {key: 'setor', formatter: (v, k, i) => i ? `${i.coordenadoria.setor.sigla}/${i.coordenadoria.sigla}` : ''},
  {key: 'titulo', label: 'Meta'},
  {key: 'resumo', label: 'Ação/Análise'},
  {key: 'responsavel', label: 'Responsável', formatter: v => v ? v.nome : ''},
  {key: 'escopo', formatter: Formatters.escopo},
  {key: 'prazo', formatter: Formatters.deadline},
  {key: 'custo', formatter: Formatters.cost}
]
export default {
  name: 'painel-de-resultados',
  components: {
    YearProgress,
    RadialProgress
  },
  methods: {
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
  computed: {
    metas: function () {
      if (this.form.diretoria === null || this.loading === 1) {
        return []
      }
      return this.setor.coordenadorias
        .map(coordenadoria => (coordenadoria.metas || []))
        .reduce((p, a) => p.concat(a), [])
    },
    w: () => window.innerWidth,
    listaDiretorias: function () { // lista para o dropdown
      return this.setores.map(_diretoria => {
        let { id, sigla, nome } = _diretoria
        return { id, sigla, nome } // sigla é o text, nome é o value
      })
    }
  },
  data () {
    return {
      loading: 0,
      form: {
        diretoria: null
      },
      setores: [],
      setor: {},
      progress: [[160, 280]],
      campos
    }
  },
  apollo: {
    setores: {
      query: GET_SETORES
    },
    setor: {
      query: function () {
        if (this.form.diretoria === null) {
          return gql`
              {
                setor(id: 0) {
                  id
                }
              }
            `
        }
        return GET_METAS_SETOR
      },
      variables: function () {
        return { setorId: (this.form.diretoria === null) ? 0 : this.form.diretoria }
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
  .negative-borders {
    margin-top: -3rem;
    margin-left: -2rem;
  }
  .limit-height>canvas {
    max-height: 5rem;
  }
</style>
