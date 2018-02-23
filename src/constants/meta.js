import gql from 'graphql-tag'

export const META = gql`
  query singleMeta {
    meta(id: $id) {
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
      }
      responsavel {
        id
      }
      coordenadoria {
        id
      }
      autor {
        id
      }
      submetas {
        id
      }
    }
  }
`