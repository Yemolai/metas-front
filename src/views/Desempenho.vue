<template lang="pug">
  b-container(fluid)#painel-de-desempenho
    h3.text-center.mt-4 Painel de desempenho
    hr
    h4(v-if='loading') Carregando...
    b-row(v-else)
      b-col(md="10" sm='12')
        b-row
          //- Barra de progresso de ano
          b-col(cols='12').year-progress-container
            year-progress
        b-row
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
        b-row
          b-col(cols="4")
            b-form-select.mb-3(
              v-model="form.coordenadoria"
              :options="listaCoordenadorias"
              value-field='id'
              text-field='sigla'
            )
              template(slot='first' selected)
                option(:value='null' disabled) {{form.diretoria ? '-- Selecione a coordenadoria --' : ''}}
          b-col(cols='8').coordenadoria-nome
            p.text-left(v-if='form.coordenadoria !== null')
              span {{ coordenadoria.nome || '' }}
      b-col(v-if='w > 992' md='2' sm='12')
        //- Esse componente ainda não é dinâmico
        RadialProgress(:data='[[progressoEscopo, 100]]').limit-height.negative-borders
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
  {key: 'responsavel', label: 'Responsável', formatter: v => v ? v.nome : ''},
  {key: 'titulo', label: 'Meta'},
  {key: 'resumo', label: 'Ação/Análise'},
  {key: 'escopo', formatter: Formatters.escopo},
  {key: 'prazo', formatter: Formatters.deadline},
  {key: 'custo', formatter: (v, k, i) => Formatters.cost(i)}
]
export default {
  name: 'painel-de-desempenho',
  components: {
    YearProgress,
    RadialProgress
  },
  methods: { // d para diretoria; dc para diretorias com coordenadorias e c para coordenadorias
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
    form: function (before, after) {
      if (before.diretoria !== after.diretoria) {
        this.form.coordenadoria = null
      }
    }
  },
  computed: {
    w: () => window.innerWidth,
    metas: function () {
      if (this.form.diretoria === null || this.loading === 1) {
        console.log('this.form.diretoria', this.form.diretoria)
        return []
      }
      if (this.form.coordenadoria === null || this.loading === 1) {
        console.log('this.form.coordenadoria', this.form.coordenadoria)
        return []
      }
      let setor = this.setor
      let coord = setor.coordenadorias.filter(c => c.id === this.form.coordenadoria)
        .reduce((p, a) => a, {})
      return coord.metas || []
    },
    coordenadoria: function () {
      if (this.form.coordenadoria === null || this.setor === null) {
        return {}
      }
      return this.setor.coordenadorias.filter(c => c.id === this.form.coordenadoria)
        .reduce((p, a) => a, {})
    },
    listaDiretorias: function () { // lista para o dropdown
      return this.setores.map(_diretoria => {
        let { id, sigla, nome } = _diretoria
        return { id, sigla, nome } // sigla é o text, nome é o value
      })
    },
    listaCoordenadorias: function () {
      if (this.form.diretoria === null) {
        return []
      }
      let selectedSetor = this.form.diretoria
      let setor = this.setores.filter(setor => setor.id === selectedSetor)
        .reduce((p, a) => a, {})
      return setor.coordenadorias || []
    },
    progressoEscopo: function () {
      if (this.form.diretoria === null || this.metas.length < 1) {
        return 0
      }
      let valores = this.metas
        .map(m => m.escopo_realizado && m.escopo_previsto ? m.escopo_realizado / m.escopo_previsto : 0)
        .map(m => m > 1 ? 1 : m)
      let soma = valores
        .reduce((p, a) => (p + a), 0)
      return (soma / this.metas.length) * 100
    }
  },
  data () {
    return {
      loading: 0,
      form: {
        diretoria: null,
        coordenadoria: null
      },
      progress: [[180, 200]],
      setores: [],
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
        return {
          submetas: false,
          setorId: (this.form.diretoria === null) ? 0 : this.form.diretoria
        }
      }
    }
  }
}
</script>
<style scoped>
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
