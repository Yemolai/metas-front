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
      }
    }
  }
`
</script>
