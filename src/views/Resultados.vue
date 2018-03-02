<template lang='pug'>
  b-container#painel-de-resultados
    b-row
      b-col(cols='10')
        b-row
          b-col(cols='12' style='margin-bottom: 1rem')
            year-progress
          b-col(cols='4')
            b-form-select.mb-3(v-model='form.diretoria' :options='listaDiretorias' value-field='nome' text-field='sigla')
              template(slot='first' selected)
                option(:value='null' disabled) -- Escolha uma diretoria --
          b-col(cols='8' style='padding-top: 0.5rem')
            p.text-left {{ form.diretoria || '' }}
      b-col(cols='2')
        RadialProgress(:chart-data='[[75, 100]]')
    b-container.table.text-left
      b-table(
        small
        striped
        hover
        :items='tableItems'
        :fields='tableFields'
      )
</template>
<script>
import YearProgress from '@/components/YearProgress'
import RadialProgress from '@/components/RadialProgress'
import Helpers from '@/components/Helpers'
import GET_SETORES from '@/constants/get-setores'
const tableFields = [
  {key: 'titulo', label: 'Descrição'},
  {key: 'resumo', label: 'Ação/Análise'},
  {key: 'responsavel', label: 'Responsável', formatter: v => v === null ? '' : v.nome},
  {key: 'escopo_previsto', label: 'E(p)', formatter: Helpers.numero()},
  {key: 'escopo_realizado', label: 'E(r)', formatter: Helpers.numero()},
  {key: 'inicio_previsto', label: 'Ti(r)', formatter: Helpers.data()}
]
export default {
  name: 'painel-de-resultados',
  components: {
    YearProgress,
    RadialProgress
  },
  computed: {
    listaDiretorias: function () {
      return this.setores.map(_diretoria => {
        let { sigla, nome } = _diretoria
        return { sigla, nome }
      })
    },
    tableItems: function () {
      if (this.form.diretoria === null) {
        return []
      }
      let diretoriaSelecionada = this.form.diretoria
      let diretoria = this.setores
        .filter(diretoria => diretoria.nome === diretoriaSelecionada)
        .reduce((p, a) => a, {})
      let coordenadorias = diretoria.coordenadorias
      return coordenadorias.map(c => c.metas).reduce((p, a) => a, [])
    }
  },
  methods: {
    parseData: dir => {
      if (!dir.processed) {
        let arrows = ['⇩', '⇨', '⇧', '⇪']
        let arrowIndicator = v => arrows[v + 1]
        let percentage = (v) => ((v * 100) + '%')
        let deadline = v => (v < -1) ? 'Vencido' : (v < 0) ? 'Finalizado' : v + ' dia' + (v > 1 ? 's' : '')
        dir.data = dir.data.map((item) => {
          if ('scopeDelta' in item) item.scopeDelta = arrowIndicator(item.scopeDelta)
          if ('scopeQuality' in item) item.scopeQuality = percentage(item.scopeQuality)
          if ('eta' in item) item.eta = deadline(item.eta)
          if ('timeDelta' in item) item.timeDelta = arrowIndicator(item.timeDelta)
          if ('timeDiff' in item) item.timeDiff = percentage(item.timeDiff)
          if ('costDelta' in item) item.costDelta = arrowIndicator(item.costDelta)
          if ('costDiff' in item) item.costDiff = percentage(item.costDiff)
          return item
        })
        dir.processed = true
      }
      return dir
    }
  },
  data () {
    return {
      form: {
        diretoria: null
      },
      setores: [],
      progress: [[160, 280]],
      tableFields
    }
  },
  apollo: {
    setores: {
      query: GET_SETORES
    }
  }
}
</script>
<style scoped>
  /* Here lies the component Style */
</style>
