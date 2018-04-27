<template lang="pug">
  .hello.container.text-left
    h2 Suas metas
    //- b-table(
    //-   v-if='!loading && usuario.responsabilidade'
    //-   :fields='fields'
    //-   :items='usuario.responsabilidade || []'
    //-   @row-clicked='goToMeta'
    //-   stacked='md'
    //-   hover
    //- )
    MetasTable(
      v-if='!loading && usuario.responsabilidade'
      :items='usuario.responsabilidade || []'
      :cols='fields'
    )
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'
import 'moment/locale/pt-br'
import router from '@/router'
import Formatters from '@/components/Formatters'
import MetasTable from '@/components/MetasTable'
const fields = [
  {
    key: 'titulo',
    label: 'Ação',
    sortable: true
  },
  {
    key: 'resumo',
    label: 'Análise',
    sortable: true
  },
  {
    key: 'escopo',
    formatter: Formatters.escopo,
    sortable: true
  },
  {
    key: 'prazo',
    formatter: Formatters.deadline,
    sortable: true
  },
  {
    key: 'custo',
    formatter: (v, k, i) => Formatters.cost(i),
    sortable: true
  },
  {
    key: 'updatedAt',
    label: 'Atualizado',
    formatter: v => moment(v).format('lll'),
    sortable: true
  }
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
  components: { MetasTable },
  // beforeRouteEnter: protect,
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
            id
            nome
            usuario
            permissoes {
              id
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
