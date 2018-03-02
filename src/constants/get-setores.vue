<script>
import gql from 'graphql-tag'
export default gql`
  query GET_SETORES {
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
        endereco
        telefone
        ramal
        responsavel {
          id
          nome
        }
        metas {
          id
          titulo
          resumo
          escopo_previsto
          escopo_realizado
          inicio_previsto
          inicio_realizado
          fim_previsto
          fim_realizado
          custo_previsto
          custo_realizado
          coordenadoria {
            sigla
          }
          responsavel {
            nome
          }
        }
      }
    }
  }
`
</script>
