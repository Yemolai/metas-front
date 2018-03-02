<script>
import gql from 'graphql-tag'
export default gql`
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
</script>
