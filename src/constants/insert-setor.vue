<script>
import gql from 'graphql-tag'
export default gql`
  mutation ADD_SETOR_MUTATION(
    $sigla: String!,
    $nome: String!,
    $endereco: String,
    $telefone: String,
    $ramal: String,
    $responsavel: Int
  ) {
    addSetor (
      sigla: $sigla,
      nome: $nome,
      endereco: $endereco,
      telefone: $telefone,
      ramal: $ramal,
      responsavel: $responsavel
    ) {
      id
      sigla
    }
  }
`
</script>
