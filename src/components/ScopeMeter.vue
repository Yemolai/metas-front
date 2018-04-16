<template>
  <RadialProgress
    class="limit-height negative-borders"
    :data="[[progressoEscopo, 100]]"
  />
</template>
<script>
import RadialProgress from '@/components/RadialProgress'
export default {
  components: {RadialProgress},
  props: ['listaDeMetas'],
  computed: {
    progressoEscopo: function () {
      // caso não haja metas, retorne zero
      if (!this.metas || this.metas.length <= 0) {
        return 0
      }
      // array de progressos de metas
      let valores = this.listaDeMetas
        .map(function (m) { // calcula progresso de escopo de cada meta
          if (m.escopo_realizado && m.escopo_previsto) {
            let progresso = m.escopo_realizado / m.escopo_previsto
            return progresso
          } // else:
          return 0 // retornando zero para a soma caso não exista escopo
        })
        .map(m => m > 1 ? 1 : m)
      // soma dos progressos
      let soma = valores
        .reduce((p, a) => (p + a), 0)
      // media dos progressos
      let media = soma / valores.length
      return Number(media.toFixed(4)) * 100 // para porcentagem multiplicar por cem
    }
  }
}
</script>
<style scoped>
.negative-borders {
  margin-top: -3rem;
  margin-left: -2rem;
}
.limit-height>canvas {
  max-height: 5rem;
}
</style>
