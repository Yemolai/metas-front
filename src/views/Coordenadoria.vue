<template lang="pug">
  #coordenadoria-view.container.text-left
    b-btn(
      @click='backToSetor'
      variant='outline-secondary'
    ).mb-2 Voltar para diretoria&nbsp;
      span(v-if='coordenadoria.setor') {{ coordenadoria.setor.sigla }}
    h3 Coordenadoria
    h4(v-if='loading') Carregando...
    div(v-else)#coordenadoria-details
      h4(v-if='coordenadoria')
        span(v-if='coordenadoria.setor') {{ coordenadoria.setor.sigla }}\
        span {{ coordenadoria.sigla || '' }} -&nbsp;
        span {{ coordenadoria.nome || '' }}
        br
        small(v-if='coordenadoria.responsavel')
          span Responsável: {{ coordenadoria.responsavel.nome }}
      p(v-if='coordenadoria.endereco')
        span Endereço: {{ coordenadoria.endereco }}
      p(v-if='coordenadoria.telefone')
        span Telefone: {{ coordenadoria.telefone }}
      span(v-if='coordenadoria.ramal')
        span (ramal: {{ coordenadoria.ramal }})
      b-row
        b-col
          h5 Metas
        b-col.text-right
          b-btn.floating(
            variant='primary'
            @click='goToAddMeta'
          ) Criar nova meta
      b-table(
        striped
        stacked
        :items='coordenadoria.metas'
        :fields='fields'
        @row-clicked='goToMetaDetails'
      )
</template>
<script>
import router from '@/router'
import GET_COORD from '@/constants/get-coord'
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
          setorId: this.coordenadoria.setor.sigla,
          coordId: this.coordenadoria.sigla
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
        { key: 'responsavel', formatter: v => v.nome || '' },
        'escopo_previsto',
        'escopo_realizado'
      ],
      user: { permissoes: { coord_create: true } }
    }
  },
  apollo: {
    coordenadoria: {
      query: GET_COORD,
      variables () {
        return {
          coordId: this.$route.params.setorId
        }
      }
    }
  }
}
</script>
