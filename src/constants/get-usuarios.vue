<script>
import gql from 'graphql-tag'
export default gql`
  query {
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
