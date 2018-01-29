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
    b-container
      b-table(stacked='sm' striped hover small :items="metas" :fields="tableFields")
</template>

<script>
import YearProgress from '@/components/YearProgress'
import RadialProgress from '@/components/RadialProgress'
import Coordenadorias from '@/coordenadorias.json'
import Diretorias from '@/diretorias.json'
// import Helpers from '@/components/Helpers'

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
      })),
    // FORMATADORES  DE CAMPOS:
    deadlineFormatter: v => { // formatador do prazo
      if (this.literalDates) {
        let r = v.realized || null
        let p = v.predicted || null
        if (!p) {
          return '<span class="text-secondary">sem prazo</span>'
        } else if (p && !r && p.start) {
          return `<span class="text-secondary">${p.start} - ${p.end || '...'}</span>`
        } else if (p && r) {
          return `<small>${r.start} - ${r.end}<br>${p.start} - ${p.end}</small>`
        } else {
          return 'sem previsão'
        }
      }
    },
    lastUpdateFormatter: (v, k, i) => { // formatador de última atualização
      let lud = i.lastUpdateDate
      return (v && lud) ? `${v}<br><small>(${lud})</small>` : ''
    },
    scopeQualityFormatter: v => { // formatador de progresso
      let done = isNaN(Number(v.realized)) ? 0 : Number(v.realized)
      let target = isNaN(Number(v.predicted)) ? 0 : Number(v.predicted)
      let progress = done / target
      if (isNaN(progress)) {
        progress = 0
      }
      let level
      if (progress > 1) {
        level = 'text-primary'
      } else if (progress === 1) {
        level = 'text-success'
      } else if (progress < 0.4) {
        level = 'text-warning'
      } else if (progress <= 0) {
        level = 'text-secondary'
      }
      return `${done}<small>/${target}<br>
      (<span class="${level}">${(progress * 100).toFixed(2)}%</span>)</small>`
    },
    costFormatter: v => { // formatador de custo
      if (!v || (Number(v.realized) === 0 && Number(v.predicted === 0))) {
        return ''
      }
      return `R$ ${(Number(v.realized)).toFixed(2)}/R$ ${(Number(v.predicted)).toFixed(2)}`
    }
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
        { key: 'idx', label: '#' },
        { key: 'title', label: 'Meta' },
        {
          key: 'lastUpdate',
          label: 'Análise/Ação',
          formatter: this.lastUpdateFormatter
        },
        { key: 'assigned', label: 'Responsável' },
        {
          key: 'scopeQuality',
          label: 'Escopo/Qualidade',
          formatter: this.scopeQualityFormatter
        },
        {
          key: 'deadline',
          label: 'Prazo',
          formatter: this.deadlineFormatter
        },
        {
          key: 'cost',
          label: 'Custo',
          formatter: this.costFormatter
        }
      ]
    }
  }
}
</script>
