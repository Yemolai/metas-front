<script>
import gql from 'graphql-tag'
export default gql`
  query GET_METAS_SETOR ($setorId: ID!){
    setor(id: $setorId) {
      id
      sigla
      coordenadorias {
        metas {
          id
          titulo
          resumo
          estado
          atualizado
          escopo_previsto
          escopo_realizado
          inicio_previsto
          inicio_realizado
          fim_previsto
          fim_realizado
          custo_previsto
          custo_realizado
          coordenadoria {
            sigla
          }
        }
      }
    }
  }
`
</script>
