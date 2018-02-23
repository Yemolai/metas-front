<template lang="pug">
  #coordenadoria-view
    h3 Coordenadoria
    h4(v-if='loading') Carregando...
    .container-fluid(v-else)#coordenadoria-details
      h4 {{ coordenadoria.sigla || '' }} -&nbsp;
        span {{ coordenadoria.nome || '' }}
        br
        small(v-if='coordenadoria.responsavel')
          span {{ coordenadoria.responsavel.nome }}
      p(v-if='coordenadoria.endereco')
        span Endereço: {{ coordenadoria.endereco }}
      p(v-if='coordenadoria.telefone')
        span Telefone: {{ coordenadoria.telefone }}
      span(v-if='coordenadoria.ramal')
        span (ramal: {{ coordenadoria.ramal }})
      h5 Metas
      b-table(
        striped
        stacked
        :items='coordenadoria.metas'
        :fields='fields'
        @row-clicked='goToMetaDetails'
      )
</template>
<script>
import gql from 'graphql-tag'
import router from '@/router'
export default {
  name: 'Coordenadoria',
  methods: {
    goToMetaDetails: function (item) {
      return router.push({
        name: 'Meta',
        params: {
          setor: this.coordenadoria.setor.sigla,
          coordenadoria: this.coordenadoria.sigla,
          year: (new Date(item.inicio_previsto)).getFullYear(),
          meta: item.id
        }
      })
    }
  },
  data () {
    return {
      loading: 0,
      coordenadoria: {},
      fields: [
        'titulo',
        { key: 'responsavel', formatter: v => v.nome || '' },
        'escopo_previsto',
        'escopo_realizado'
      ]
    }
  },
  apollo: {
    coordenadoria: {
      query: gql`
        query getCoordenadoria($coordId: ID!) {
          coordenadoria(id: $coordId) {
            id
            sigla
            nome
            endereco
            telefone
            ramal
            setor {
              id
              sigla
            }
            responsavel {
              id
              nome
            }
            metas {
              id
              titulo
              responsavel {
                id
                nome
              }
              escopo_previsto
              escopo_realizado
              inicio_previsto
            }
          }
        }
      `,
      variables () {
        return {
          coordId: this.$route.params.setorId
        }
      }
    }
  }
}
</script>
