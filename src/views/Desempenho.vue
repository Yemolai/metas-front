<template lang="pug">
  b-container#painel-de-desempenho
    b-row
      b-col(cols='10')
        b-row
          b-col(cols='12' style='margin-bottom: 1rem')
            year-progress
          b-col(cols='4')
            b-form-select.mb-3(v-model='form.diretoria' :options='diretorias')
              template(slot='first' selected)
                option(:value='null' disabled) -- Diretoria --
          b-col(cols='8' style='padding-top: 0.5rem')
            p.text-left {{ form.diretoria || '' }}
          b-col(cols='4')
            b-form-select.mb-3(v-model='form.coordenadoria' :options='coordenadorias')
              template(slot='first' selected)
                option(:value='null' disabled) -- Coordenadoria --
          b-col(cols='8' style='padding-top: 0.5rem')
            p.text-left {{ form.coordenadoria || '' }}
      b-col(cols='2')
        radial-progress(:chart-data='progress')
    b-container.table
      milestone-table(:diretoria='form.diretoria' :coordenadoria='form.coordenadoria')
</template>
<script>
import YearProgress from '@/components/YearProgress'
import RadialProgress from '@/components/RadialProgress'
import MilestoneTable from '@/components/MilestoneTable'
import Diretorias from '@/diretorias.json'
import Coordenadorias from '@/coordenadorias.json'
import Helpers from '@/components/Helpers'

export default {
  name: 'painel-de-desempenho',
  components: {
    YearProgress,
    RadialProgress,
    MilestoneTable
  },
  computed: {
    coordenadorias: function () {
      let diretoriaAtual = this.diretorias
        .filter(dir => this.form.diretoria === dir.value)
      return (diretoriaAtual.length > 0) ? diretoriaAtual[0].coordenadorias : []
    }
  },
  data () {
    return {
      form: {
        diretoria: null,
        coordenadoria: null
      },
      progress: [[80, 100]],
      diretorias: Helpers.relacionarDados(Coordenadorias, Diretorias)
    }
  }
}
</script>
