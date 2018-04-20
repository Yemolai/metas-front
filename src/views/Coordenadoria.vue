<template lang="pug">
  #coordenadoria-view.container.text-left
    b-btn(
      v-if='coordenadoria.setor'
      @click="go({ name: 'Setor', params: { setorId: coordenadoria.setor.id } })"
      variant='outline-secondary'
    ).mb-2
      span Diretoria {{ coordenadoria.setor.sigla }}
    h2.text-center C
      small OORDENADORIA
    h4(v-if='loading') Carregando...
    div(v-else)#coordenadoria-details
      h4(v-if='coordenadoria').text-center
        span(v-if='coordenadoria.setor') {{ coordenadoria.setor.sigla }}\
        span {{ coordenadoria.sigla || '' }} -&nbsp;
        span {{ coordenadoria.nome || '' }}
      p(v-if='coordenadoria.responsavel')
        span Responsável: {{ coordenadoria.responsavel.nome }}
      p(v-if='coordenadoria.endereco')
        span Endereço: {{ coordenadoria.endereco }}
      p(v-if='coordenadoria.telefone')
        span Telefone: {{ coordenadoria.telefone }}
        span(v-if='coordenadoria.ramal') &nbsp;(ramal: {{ coordenadoria.ramal }})
      b-row.mt-3
        b-col
          h3 Metas:
        b-col.text-right
          b-btn.floating(
            variant='primary'
            v-if="can('meta_create')"
            @click='goToAddMeta'
          ) Criar nova meta
      MetasTable(:items='metas' :cols='fields')
</template>
<script>
import router from '@/router'
import Formatters from '@/components/Formatters'
import MetasTable from '@/components/MetasTable'
import Helpers from '@/components/Helpers'
import GET_COORDENADORIA from '@/constants/get-coordenadoria'
const money = v => Helpers.dinheiro()(v) || 'R$0,00'
const fields = [
  'titulo',
  { key: 'responsavel', formatter: v => v ? v.nome : '' },
  { key: 'escopo', formatter: (v, k, i) => `${i.escopo_realizado || 0}/${i.escopo_previsto || 0}` },
  {
    key: 'custo',
    formatter: (v, k, i) => `
      ${money(i.custo_realizado)}&nbsp;
      <small>/${money(i.custo_previsto)}</small>`
  },
  { key: 'prazo', formatter: Formatters.prazo() }
]
export default {
  components: { MetasTable },
  methods: {
    can: function (p) {
      let app = this.$root.$children[0]
      if (!app) { return false }
      let usr = app.usuario
      return usr ? usr.permissoes[p] : false
    },
    go: (...args) => (router.push(...args)),
    goToMetaDetails: function (item) {
      return this.go({
        name: 'Meta',
        params: {
          setor: this.coordenadoria.setor.sigla,
          coordenadoria: this.coordenadoria.sigla,
          year: (new Date(item.inicio_previsto)).getFullYear(),
          meta: item.id
        }
      })
    },
    goToAddMeta: function () {
      return router.push({
        name: 'AddMeta',
        params: {
          setor: this.coordenadoria.setor.sigla,
          coordenadoria: this.coordenadoria.sigla
        }
      })
    },
    backToSetor: function () {
      let nav = router.go(-1)
      console.log(nav)
    }
  },
  computed: {
    metas: function () {
      return this.coordenadoria && this.coordenadoria.metas ? this.coordenadoria.metas : []
    }
  },
  data () {
    return {
      loading: 0,
      coordenadoria: {},
      fields,
      user: { permissoes: { coord_create: true } }
    }
  },
  apollo: {
    coordenadoria: {
      fetchPolicy: 'network-only',
      query: GET_COORDENADORIA,
      variables () {
        return {
          coordId: this.$route.params.coordId
        }
      }
    }
  }
}
</script>
