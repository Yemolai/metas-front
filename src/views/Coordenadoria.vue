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
            @click='goToAddMeta'
          ) Criar nova meta
      b-table(
        striped
        stacked='sm'
        :items='coordenadoria.metas'
        :fields='fields'
        @row-clicked='goToMetaDetails'
      )
</template>
<script>
import router from '@/router'
import Formatters from '@/components/Formatters'
import GET_COORDENADORIA from '@/constants/get-coordenadoria'
export default {
  name: 'Coordenadoria',
  methods: {
    can: function (p) { return !!this.user.permissoes[p] },
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
  data () {
    return {
      loading: 0,
      coordenadoria: {},
      fields: [
        'titulo',
        { key: 'responsavel', formatter: v => v ? v.nome : '' },
        { key: 'escopo', formatter: (v, k, i) => `${i.escopo_realizado || 0}/${i.escopo_previsto || 0}` },
        { key: 'custo', formatter: (v, k, i) => `R$ ${i.custo_realizado || 0}/${i.custo_previsto || 0}` },
        { key: 'prazo', formatter: Formatters.prazo() }
      ],
      user: { permissoes: { coord_create: true } }
    }
  },
  apollo: {
    coordenadoria: {
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
