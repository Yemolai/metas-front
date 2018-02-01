<template lang="pug">
  b-table(
    small
    striped
    hover
    stacked='sm'
    :items='metas'
    :fields='fields'
  )
</template>
<script>
import Formatter from '@/components/Formatters'
import Coordenadorias from '@/coordenadorias.json'
import Diretorias from '@/diretorias.json'
import Helpers from '@/components/Helpers.vue'

export default {
  name: 'milestone-table',
  props: ['diretoria', 'coordenadoria'],
  computed: {
    coordenadorias: () => {
      let diretoriaAtual = this.diretorias
        .filter(dir => this.form.diretoria === dir.value)
      if (diretoriaAtual.length > 0) {
        return diretoriaAtual[0].coordenadorias
      }
      return []
    },
    metas: () => {
      return this.coordenadorias
        .filter(
          coo => (this.coordenadoria || null) === coo.value
          )
        .reduce(
          (p, a) => (a.milestones || [])
          , [])
      }
  },
  watch: {
    'selectors.diretoria': () => {
      this.selectors.coordenadoria = null
    }
  },
  data () {
    return {
      diretorias: Helpers.relacionarDados(Coordenadorias, Diretorias),
      fields: [
        { key: 'key', label: '#' },
        { key: 'title', label: 'Meta' },
        {
          key: 'lastUpdate',
          label: 'Análise/Ação',
          formatter: Formatter.lastUpdateFormatter
        },
        {
          key: 'scopeQuality',
          label: 'Escopo/Qualidade',
          formatter: Formatter.scopeQualityFormatter
        },
        {
          key: 'deadline',
          label: 'Prazo',
          formatter: Formatter.deadlineFormatter
        },
        { key: 'show_details', label: 'Opções' }
      ]
    }
  }
}
</script>
