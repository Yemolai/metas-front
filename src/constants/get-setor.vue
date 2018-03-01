<script>
import gql from 'graphql-tag'
export default gql`
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
`
</script>
