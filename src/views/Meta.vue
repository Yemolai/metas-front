<template lang="pug">
  #meta-view
    h3 Meta
    h4(v-if='loading') Carregando...
    .container-fluid(v-else)#meta-details
      h4 {{ meta.titulo }}
        br
        small Responsável:&nbsp;
          span(v-if='meta.responsavel') {{ meta.responsavel.nome }}
      p Última atualização: {{ date(meta.atualizado) || '[createdAt]'}}
      p Resumo:&nbsp;
        span(v-if='meta.resumo') {{ meta.resumo }}
        span(v-else) [vazio]
      p Estado:&nbsp;
        span(v-if='meta.estado') {{ meta.estado }}
        span(v-else) [vazio]
      b-row
        b-col
          p Escopo: {{ meta.escopo_realizado || 0 }}/
            small {{ meta.escopo_previsto }}
        b-col
          p Custo: {{ money(meta.custo_realizado || 0) }}/
            small {{ money(meta.custo_previsto || 0) }}
      p Prazo:&nbsp;
        span {{ date(meta.inicio_realizado) || '?' }} -&nbsp;
        span {{ date(meta.fim_realizado) || '?' }}&nbsp;
        small (previsto: {{ date(meta.inicio_previsto) || '?' }} - &nbsp;
          span {{ date(meta.fim_previsto) || '?' }})
      //- TODO: Colocar aqui as informacões que faltam da Meta
</template>
<script>
import gql from 'graphql-tag'
export default {
  name: 'Meta',
  data () {
    return {
      loading: 0,
      meta: {}
    }
  },
  methods: {
    date: number => (new Date(number))
      .toLocaleDateString('pt-BR'),
    money: (value, currency = 'R$', position = 'pre') => {
      let numero = value.toFixed(2).split('.')
      numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.')
      if (position !== 'pre') {
        return numero.join(',') + '' + currency
      }
      return currency + ' ' + numero.join(',')
    }
  },
  apollo: {
    meta: {
      variables () {
        return {
          metaId: this.$route.params.meta
        }
      },
      query: gql`
        query getMeta($metaId: ID!) {
          meta(id: $metaId) {
            id
            titulo
            resumo
            estado
            atualizado
            escopo_previsto
            escopo_realizado
            inicio_previsto
            inicio_realizado
            fim_previsto
            fim_realizado
            custo_previsto
            custo_realizado
            pai {
              id
              titulo
            }
            responsavel {
              id
              nome
            }
            coordenadoria {
              id
              nome
              sigla
              responsavel {
                id
                nome
              }
              setor {
                id
                nome
                sigla
                responsavel {
                  id
                  nome
                }
              }
            }
            autor {
              id
              nome
            }
            submetas {
              id
              titulo
              responsavel {
                id
                nome
              }
            }
          }
        }
      `
    }
  }
}
</script>
