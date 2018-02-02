<template lang="pug">
  b-container#painel-de-desempenho
    b-row
      b-col(cols="10")
        b-row
          b-col(cols="12" style="margin-bottom: 1rem")
            year-progress
          b-col(cols="4")
            b-form-select.mb-3(v-model="form.diretoria" :options="diretorias")
              template(slot='first' selected)
                option(:value='null' disabled) -- Escolha uma diretoria --
          b-col(cols="8" style="padding-top: 0.5rem")
            p.text-left {{ form.diretoria || '' }}
          b-col(cols="4")
            b-form-select.mb-3(v-model="form.coordenadoria" :options="coordenadorias")
              template(slot='first' selected)
                option(:value='null' disabled) -- {{ coordenadoriaNullOption }} --
          b-col(cols="8" style="padding-top: 0.5rem")
            p.text-left {{ form.coordenadoria || '' }}
      b-col(cols='2')
        RadialProgress(:chart-data='[[75, 100]]')
    b-container
      b-table(stacked='sm' striped hover small :items="metas" :fields="tableFields")
</template>

<script>
import YearProgress from '@/components/YearProgress'
import RadialProgress from '@/components/RadialProgress'
import Coordenadorias from '@/coordenadorias.json'
import Diretorias from '@/diretorias.json'
import Formatter from '@/components/Formatters'

export default {
  name: 'painel-de-desempenho',
  components: {
    YearProgress,
    RadialProgress
  },
  methods: { // d para diretoria; dc para diretorias com coordenadorias e c para coordenadorias
    relacionarDados: (coords, dirs) => dirs.data // relacionar e processar as lista de diretorias e coordenadorias
      .map(d => ({ // cada item de dirs.data
        text: d.text,
        value: d.value,
        coordenadorias: coords.data
          .filter(dc => (dc.text === d.text)) // agregar itens de coords.data que se relacionem com o d atual (um objeto de dirs.data)
          .map(d => d.coordenadorias)
          .reduce((p, a) => a, {})
      }))
  },
  computed: {
    coordenadorias: function () {
      let diretoriaAtual = this.diretorias.filter(dir => this.form.diretoria === dir.value)
      return (diretoriaAtual.length > 0) ? diretoriaAtual[0].coordenadorias : []
    },
    metas: function () {
      if (!this.form.coordenadoria || !this.coordenadorias.filter) {
        return []
      }
      let C = this.coordenadorias
        .filter(coo => {
          return this.form.coordenadoria === coo.value
        })
        .map(c => {
          if (c.milestones && !c.processed) {
            let metas = []
            for (let i in c.milestones) {
              c.milestones[i].idx = i
              metas.push(c.milestones[i])
            }
            c.processed = true
            c.milestones = metas
          }
          return c
        })
        .reduce((p, a) => {
          p = a
          return a
        }, { milestones: [] })
      return C.milestones
    }
  },
  data () {
    return {
      form: {
        diretoria: null,
        coordenadoria: null
      },
      progress: [[180, 200]],
      diretorias: this.relacionarDados(Coordenadorias, Diretorias),
      coordenadoriaNullOption: null,
      literalDates: true,
      tableFields: [
        { key: 'idx', label: '#', sortable: true },
        { key: 'title', label: 'Meta', sortable: true },
        {
          key: 'lastUpdate',
          label: 'Análise/Ação',
          formatter: Formatter.lastUpdate,
          sortable: true
        },
        { key: 'assigned', label: 'Responsável', sortable: true },
        {
          key: 'scopeQuality',
          label: 'Escopo/Qualidade',
          formatter: Formatter.scopeQuality,
          sortable: true
        },
        {
          key: 'deadline',
          label: 'Prazo',
          formatter: Formatter.deadline,
          sortable: true
        },
        {
          key: 'cost',
          label: 'Custo',
          formatter: Formatter.cost,
          sortable: true
        }
      ]
    }
  }
}
</script>
