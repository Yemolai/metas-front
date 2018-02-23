<template lang="pug">
  // Component structure goes here
  #diretorias-table
    h4(
      v-if='loading'
    ) Carregando...
    b-table(
      v-else
      stacked='sm'
      striped
      hover
      small
      :items='setores'
      :fields='fields'
      v-on:row-clicked='rowClicked'
    )
</template>
<script>
// GQL query pra recuperar todos os setores do servidor
import { ALL_SETORES } from '@/constants/all-setores'
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
    rowClicked: (item) => router.push({ name: 'Diretoria', params: { setorId: item.id } })
  },
  data () {
    return {
      loading: 0,
      setores: [], // definição dos dados da tabela
      fields: [ // definição das colunas da tabela
        { key: 'id', label: '#' },
        { key: 'sigla', formatter: uppercase },
        { key: 'nome', formatter: capitalize },
        { key: 'responsavel', label: 'Responsável', formatter: v => (v.nome || '') }
      ]
    }
  },
  apollo: {
    setores: {
      query: ALL_SETORES
    }
  }
}
</script>
<style scoped>
  /* style goes here */
</style>
