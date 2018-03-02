<script>
import gql from 'graphql-tag'
export default gql`
  query GET_ATUALIZACOES($filter: Obj) {
    atualizacoes(filter: $filter) {
      id
      titulo
      resumo
      estado
      escopo_previsto
      escopo_realizado
      inicio_previsto
      inicio_realizado
      fim_previsto
      fim_realizado
      custo_previsto
      custo_realizado
      createdAt
      autor {
        id
        nome
      }
      meta {
        id
        titulo
      }
      responsavel {
        id
        nome
      }
      pai {
        id
        titulo
      }
      coordenadoria {
        id
        sigla
      }
    }
  }
`
</script>
