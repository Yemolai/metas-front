<template lang='pug'>
  b-container#painel-de-resultados
    b-row
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
              span {{ setores[form.diretoria].nome || '' }}
      b-col(v-if='w > 992' md='2' sm='12')
        //- Esse componente ainda não é dinâmico
        RadialProgress(:chart-data='[[75, 100]]').limit-height.negative-borders
    b-container.table.text-left
      b-table(
        :items='tableItems'
        :fields='tableFields'
        stacked='md'
        striped
      )
</template>
<script>
import YearProgress from '@/components/YearProgress'
import RadialProgress from '@/components/RadialProgress'
import Formatters from '@/components/Formatters'
import GET_SETORES from '@/constants/get-setores'
import GET_METAS_SETOR from '@/constants/get-metas-setor'
import gql from 'graphql-tag'
const tableFields = [
  {key: 'titulo', label: 'Descrição'},
  {key: 'resumo', label: 'Ação/Análise'},
  {key: 'responsavel', label: 'Responsável', formatter: v => v === null ? '' : v.nome},
  {key: 'escopo', formatter: Formatters.escopo},
  {key: 'prazo', formatter: Formatters.deadline}
]
export default {
  name: 'painel-de-resultados',
  components: {
    YearProgress,
    RadialProgress
  },
  computed: {
    w: () => window.innerWidth,
    listaDiretorias: function () { // lista para o dropdown
      return this.setores.map(_diretoria => {
        let { sigla, nome } = _diretoria
        return { sigla, nome } // sigla é o text, nome é o value
      })
    },
    tableItems: function () { // lista de itens pra preencher a tabela
      if (this.form.diretoria === null) { return [] }
      let diretoria = this.setores
        .filter(diretoria => diretoria.nome === this.form.diretoria)
        .reduce((p, a) => a, {})
      return diretoria.coordenadorias.map(c => c.metas).reduce((p, a) => a, [])
    }
  },
  data () {
    return {
      form: {
        diretoria: null
      },
      setores: [],
      metas: [],
      progress: [[160, 280]],
      tableFields
    }
  },
  apollo: {
    setores: {
      query: GET_SETORES
    },
    metas: {
      query: function () {
        console.log('this.form.diretoria', this.form.diretoria)
        console.log('this.setores', this.setores)
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
        if (this.form.diretoria === null) {
          return { setorId: 0 }
        }
        return { setorId: this.form.diretoria }
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
