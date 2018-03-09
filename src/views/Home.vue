<template lang="pug">
  .hello.container.text-left
    h2 Metas
    b-table(
      v-if='!loading && usuario.responsabilidade'
      :fields='fields'
      :items='usuario.responsabilidade || []'
      @row-clicked='goToMeta'
      stacked='md'
      hover
    )
</template>

<script>
import gql from 'graphql-tag'
import Formatters from '@/components/Formatters'
import Helpers from '@/components/Helpers'
import router from '@/router'
const fields = [
  {key: 'titulo', label: 'Título'},
  {key: 'atualizado', label: 'Atualizado em', formatter: Helpers.timestamp()},
  {key: 'escopo', formatter: Formatters.escopo},
  {key: 'prazo', formatter: Formatters.deadline},
  {key: 'custo', formatter: (v, k, i) => Formatters.cost(i)}
]
export default {
  name: 'Home',
  data () {
    return {
      loading: 0,
      usuario: {},
      fields
    }
  },
  methods: {
    goToMeta: item => router.push({
      name: 'Meta',
      params: {
        setor: item.coordenadoria.setor.sigla,
        coordenadoria: item.coordenadoria.sigla,
        year: new Date(item.createdAt).getFullYear(),
        meta: item.id
      }
    })
  },
  apollo: {
    usuario: {
      fetchPolicy: 'network-only',
      query: gql`
        query getUser($usrId: ID!) {
          usuario(id: $usrId) {
            nome
            usuario
            permissoes {
              meta_create
              meta_update
              meta_delete
              own_meta_update
              own_meta_delete
            }
            responsabilidade {
              id
              titulo
              escopo_previsto
              escopo_realizado
              inicio_previsto
              fim_previsto
              inicio_realizado
              fim_realizado
              custo_previsto
              custo_realizado
              atualizado
              createdAt
              updatedAt
              coordenadoria {
                id
                sigla
                setor {
                  id
                  sigla
                }
              }
            }
          }
        }
      `,
      variables: function () {
        return {
          usrId: 1
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
