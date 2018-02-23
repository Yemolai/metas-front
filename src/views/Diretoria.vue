<template lang="pug">
  #diretoria-view
    h3 Diretoria
    h4(v-if="loading") Carregando...
    .container-fluid(v-else)#diretoria-details
      h4 {{ setor.sigla || '' }} - {{ setor.nome || '' }}
        br
        small(v-if='setor.responsavel') Responsável: {{ setor.responsavel.nome }}
      p(v-if='setor.endereco') Endereço: {{ setor.endereço }}
      p(v-if='setor.telefone') Telefone: {{ setor.telefone }}
      span(v-if='setor.ramal') (ramal {{ setor.ramal }})
      h5 Coordenadorias
      b-table(striped stacked :items='setor.coordenadorias' :fields='fields' @row-clicked='goToCoordDetails')
</template>
<script>
import gql from 'graphql-tag'
import router from '@/router'
export default {
  name: 'Diretoria',
  methods: {
    goToCoordDetails: function (item) {
      return router.push({
        name: 'Coordenadoria',
        params: { setorId: this.setor.id, coordId: item.id }
      })
    }
  },
  data () {
    return {
      loading: 0,
      setor: {},
      fields: [
        'sigla',
        'nome',
        { key: 'responsavel', label: 'Responsável', formatter: v => (('nome' in v) ? v.nome : '') },
        'telefone',
        'ramal',
        { key: 'metas', formatter: v => v.length }
      ]
    }
  },
  apollo: {
    setor: {
      query: gql`
        query getSetorDetails($setorId: ID!) {
          setor(id: $setorId) {
            id
            sigla
            nome
            endereco
            telefone
            ramal
            responsavel {
              id
              nome
            }
            coordenadorias {
              id
              sigla
              nome
              telefone
              ramal
              responsavel {
                id
                nome
              }
              metas {
                id
              }
            }
          }
        }
      `,
      variables () {
        return {
          setorId: this.$route.params.setorId
        }
      }
    }
  }
}
</script>
