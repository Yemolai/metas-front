<template>
  <div>
    <RadialProgress
      class="hidden-xs"
      :data="[[escopo, 100]]"
      :progress="progress"
    />
    <div class="visible-xs">
        <b-row>
          <b-col cols='2' class="text-left text-secondary">
            <small>0%</small>
          </b-col>
          <b-col>
            Progresso {{progress}} %
          </b-col>
          <b-col cols='2' class="text-right text-secondary">
            <small>100%</small>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col>
            <b-progress :value="escopo" :max="100"/>
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
  methods: {
    update: function (metas) {
      // caso não haja metas, retorne zero
      if (!metas || metas.length <= 0) {
        return 0
      }
      // array de progressos de metas
      let valores = metas
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
  },
  computed: {
    progress: function () {
      return num(this.escopo || 0)
    }
  },
  watch: {
    'listaDeMetas': function (newValue) {
      this.escopo = this.update(newValue)
    }
  },
  data () {
    return {
      escopo: 0
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
