<script>
import gql from 'graphql-tag'
export default gql`
  mutation DELETE_ATUALIZACAO($itemId: ID!) {
    deleteAtualizacao(id: $itemId)
  }
`
</script>
