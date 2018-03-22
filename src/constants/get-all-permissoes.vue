<script>
import gql from 'graphql-tag'
export default gql`
  query GET_ALL_PERMISSOES {
    permissoes {
      id
      nome
      setor_create
      setor_read
      setor_update
      setor_delete
      coord_create
      coord_read
      coord_update
      coord_delete
      meta_create
      meta_read
      meta_update
      meta_delete
      atual_create
      atual_read
      atual_update
      atual_delete
      own_setor_update
      own_setor_delete
      own_coord_update
      own_coord_delete
      own_meta_update
      own_meta_delete
      own_atual_update
      own_atual_delete
    }
  }
`
</script>
