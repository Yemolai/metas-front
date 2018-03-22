<script>
import gql from 'graphql-tag'
export default gql`
  query GET_USUARIO($userId: ID!) {
    usuario(id: $userId) {
      id
      guid
      matricula
      nome
      usuario
      setor {
        id
        sigla
      }
      coordenadoria {
        id
        sigla
      }
      permissoes {
        id
      }
    }
  }
`
</script>
