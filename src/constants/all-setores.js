import gql from 'graphql-tag'

export const ALL_SETORES = gql`
  query AllSetores {
    setores {
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
        metas {
          id
          titulo
          submetas {
            id
            titulo
          }
        }
      }
    }
  }
`
