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
      createdAt
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
        escopo_realizado
        escopo_previsto
        custo_realizado
        custo_previsto
        inicio_previsto
        inicio_realizado
        fim_previsto
        fim_realizado
      }
      atualizacoes {
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
  }
`
</script>
