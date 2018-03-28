<script>
import gql from 'graphql-tag'
export default gql`
  query GET_METAS_SETOR ($setorId: ID!, $submetas: Boolean) {
    setor(id: $setorId) {
      id
      sigla
      nome
      coordenadorias {
        id
        sigla
        nome
        metas(submetas: $submetas) {
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
          responsavel {
            id
            nome
          }
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
