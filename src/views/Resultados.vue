<template lang='pug'>
  b-container#painel-de-resultados
    b-row
      b-col(cols='10')
        b-row
          b-col(cols='12' style='margin-bottom: 1rem')
            year-progress
          b-col(cols='4')
            b-form-select.mb-3(v-model='form.diretoria' :options='diretorias')
              template(slot='first' selected)
                option(:value='null' disabled) -- Escolha uma diretoria --
          b-col(cols='8' style='padding-top: 0.5rem')
            p.text-left {{ form.diretoria || '' }}
      b-col(cols='2')
    b-container.table
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
import Diretorias from '@/diretorias.json'

export default {
  name: 'painel-de-resultados',
  components: {
    YearProgress,
    RadialProgress
  },
  computed: {
    tableItems: function () {
      if (!this.form.diretoria) return []
      let dir = Diretorias.data
        .filter(diretoria => diretoria.value === this.form.diretoria)
      return dir[0].data
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
      progress: [[160, 280]],
      diretorias: Diretorias.data.map(this.parseData),
      tableFields: Diretorias.fields.map(f => ({ isRowHeader: true, ...f }))
    }
  }
}
</script>
<style scoped>
  /* Here lies the component Style */
</style>
