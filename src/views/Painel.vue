<template lang='pug'>
  b-container#lista-de-paineis
    h3.mb-3 Painéis
    b-card-group(deck).mb-3
      b-card(
        v-for='(painel, k) in paineis'
        :key="k"
        :title="painel.title || 'Painel'"
        :img-src="painel.img || 'http://via.placeholder.com/390x130'"
        @click="painel.route ? go(painel.route) : null"
        img-top
      ).clickable
</template>
<script>
import router from '@/router'
export default {
  name: 'desempenho',
  methods: {
    go: function (name) {
      router.push({name})
    }
  },
  data () {
    return {
      paineis: [
        { title: 'Resultados', route: 'PainelResultados' },
        { title: 'Desempenho', route: 'PainelDesempenho' },
        { title: 'Gantt', route: 'PainelGantt' }
      ]
    }
  }
}
</script>
<style scoped>
  .clickable {
    cursor: pointer;
  }
</style>
