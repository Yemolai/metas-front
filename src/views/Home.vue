<template lang="pug">
  .hello
    h1 {{ msg }}
    h2 Rotas
    ul
      li
        a(href="#/painel") Painel
    .container
      b-row
        b-col.text-right
          b-btn.floating(
            variant='primary'
            v-if="can('setor_create')"
            @click="goTo({name:'AddSetor'})"
          ) Criar nova diretoria
      diretorias-table
</template>

<script>
import DiretoriasTable from '@/components/DiretoriasTable'
import router from '@/router'
export default {
  name: 'Home',
  methods: {
    can: function (permissao) {
      return !!this.user.permissoes[permissao]
    },
    goTo: (...args) => (router.push(...args))
  },
  data () {
    return {
      msg: 'Sistema em desenvolvimento',
      loading: 0,
      user: { permissoes: { setor_create: true } }
    }
  },
  components: {
    DiretoriasTable
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
