<template lang="pug">
  #add-meta.container
    b-form(@submit='submit' @reset='reset' v-if='!loading')
      b-form-group(
        label='Título'
        label-for='form-input-titulo'
        description='Breve descrição do objetivo'
      )#form-group-titulo
        b-form-input(
          type='text'
          v-model='novaMeta.titulo'
          required
          placeholder='Realizar um passo de uma caminhada'
        )#form-input-titulo
      b-form-group(
        label='Escopo previsto'
        label-for='form-input-escopo-previsto'
        description='Uma previsão de contador de progresso de execução'
      )#form-group-escopo-previsto
        b-form-input(
          type='number'
          v-model='novaMeta.escopo_previsto'
          required
          placeholder='99,9'
        )#form-input-escopo-previsto
</template>
<script>
export default {
  name: 'AddMeta',
  data () {
    return {
      loading: 0,
      novaMeta: {
        titulo: '',
        escopo_previsto: null,
        inicio_previsto: null,
        fim_previsto: null,
        custo_previsto: null,
        responsavel: null,
        autor: null
      }
    }
  },
  methods: {
    reset: e => null,
    submit: e => null
  }
}
</script>
