<script>
import gql from 'graphql-tag'
export default gql`
  mutation INSERT_META(
    $titulo: String!,
    $escopo_previsto: Float,
    $inicio_previsto: Date,
    $fim_previsto: Date,
    $custo_previsto: Float,
    $coordenadoria: Int,
    $responsavel: Int,
    $autor: Int,
    $pai: Int
  ) {
    addMeta(
      titulo: $titulo,
      escopo_previsto: $escopo_previsto,
      inicio_previsto: $inicio_previsto,
      fim_previsto: $fim_previsto,
      custo_previsto: $custo_previsto,
      coordenadoria: $coordenadoria,
      responsavel: $responsavel,
      autor: $autor,
      pai: $pai
    ) {
      id
      coordenadoria {
        id
        sigla
        setor {
          id
          sigla
        }
      }
    }
  }`
</script>
