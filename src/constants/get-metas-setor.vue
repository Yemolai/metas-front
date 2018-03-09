<script>
import gql from 'graphql-tag'
export default gql`
  query GET_METAS_SETOR ($setorId: ID!) {
    setor(id: $setorId) {
      id
      sigla
      nome
      coordenadorias {
        id
        sigla
        nome
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
            id
            sigla
            nome
            setor {
              id
              sigla
            }
          }
        }
      }
    }
  }
`
</script>
