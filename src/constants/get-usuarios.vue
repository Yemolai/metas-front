<script>
import gql from 'graphql-tag'
export default gql`
  query GET_USUARIOS {
    usuarios {
      id
      nome
      setor {
        sigla
      }
    }
  }
`
</script>
