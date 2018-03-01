<template lang="pug">
  // Component structure goes here
  #diretorias-table.text-left
    h4(
      v-if='loading'
    ) Carregando...
    b-table(
      v-else
      stacked='sm'
      striped
      hover
      :items='setores'
      :fields='fields'
      v-on:row-clicked='rowClicked'
    )
</template>
<script>
import gql from 'graphql-tag'
import router from '@/router'

const uppercase = v => (typeof v === 'string') ? v.toUpperCase() : v
const capitalize = v => { // pra capitalizar as palavras de uma frase
  if (typeof v === 'string') { // se v é string
    // palavras de interconexão que não precisam de capitalização:
    let x = ['de', 'a', 'o', 'do', 'com', 'da']
    return v.toLowerCase() // minúsculas
      .split(' ') // string -> array de palavras
      .map( // em cada item do array
        w => x.indexOf(w) < 0 // se a palavra não fizer parte das exclusões
          ? w.charAt(0).toUpperCase() + w.slice(1) // caixa alta na primeira letra
          : w // senão, não modifique
      )
      .join(' ') // una os itens com espaços como cola
  } // se não retorn v mesmo, paciência...
  return v
}

export default {
  // Component logic goes here
  name: 'DiretoriasTable',
  methods: {
    rowClicked: item => router.push({
      name: 'Setor',
      params: { setor: item.sigla.toUpperCase() }
    })
  },
  data () {
    return {
      loading: 0,
      setores: [], // definição dos dados da tabela
      fields: [ // definição das colunas da tabela
        // { key: 'id', label: '#' },
        { key: 'sigla', formatter: uppercase },
        { key: 'nome', formatter: capitalize },
        {
          key: 'responsavel',
          label: 'Responsável',
          formatter: v => (v ? v.nome : '--')
        }
      ]
    }
  },
  apollo: {
    setores: {
      query: gql`
        query AllSetores {
          setores {
            id
            sigla
            nome
            endereco
            telefone
            ramal
            responsavel {
              id
              nome
            }
            coordenadorias {
              id
              sigla
              nome
              metas {
                id
                titulo
                submetas {
                  id
                  titulo
                }
              }
            }
          }
        }
      `
    }
  }
}
</script>
<style scoped>
  /* style goes here */
</style>
