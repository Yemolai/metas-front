<script>
import gql from 'graphql-tag'
export default gql`
  query getCoordenadoria($coordId: ID!) {
    coordenadoria(id: $coordId) {
      id
      sigla
      nome
      endereco
      telefone
      ramal
      setor {
        id
        sigla
      }
      responsavel {
        id
        nome
      }
      metas(submetas: false) {
        id
        titulo
        responsavel {
          id
          nome
        }
        escopo_previsto
        escopo_realizado
        inicio_previsto
        fim_previsto
        inicio_realizado
        fim_realizado
      }
    }
  }
`
</script>
