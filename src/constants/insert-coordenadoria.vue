<script>
import gql from 'graphql-tag'
export default gql`
  mutation INSERT_COORDENADORIA(
    $sigla: String!,
    $nome: String!,
    $endereco: String,
    $telefone: String,
    $ramal: String,
    $setorId: Int!,
    $responsavelId: Int,
  ) {
    addCoordenadoria(
      sigla: $sigla,
      nome: $nome,
      endereco: $endereco,
      telefone: $telefone,
      ramal: $ramal,
      setor: $setorId,
      responsavel: $responsavelId
    ) {
      id
    }
  }
`
</script>
