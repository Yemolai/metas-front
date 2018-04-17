<template>
  <div>
    <RadialProgress
      class="hidden-xs"
      :data="[[progressoEscopo, 100]]"
    />
    <div class="visible-xs">
        <b-row>
          <b-col cols='2' class="text-left text-secondary">
            <small>0%</small>
          </b-col>
          <b-col>
            Progresso {{num(progressoEscopo)}} %
          </b-col>
          <b-col cols='2' class="text-right text-secondary">
            <small>100%</small>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col>
            <b-progress :value="progressoEscopo" :max="100"/>
          </b-col>
        </b-row>
    </div>
  </div>
</template>
<script>
import RadialProgress from '@/components/RadialProgress'
import num from '@/fn/num'
export default {
  components: {RadialProgress},
  props: ['listaDeMetas'],
  data () {
    return { metas: this.listaDeMetas || false }
  },
  methods: { num },
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
      return Number((media * 100).toFixed(4)) // para porcentagem multiplicar por cem
    }
  }
}
</script>
<style scoped>
  .hidden-xs {
    display: block;
  }
  .visible-xs {
    display: none;
  }
  @media screen and (max-width: 575px) {
    .hidden-xs {
      display: none;
    }
    .visible-xs {
      display: block;
    }
  }
</style>
