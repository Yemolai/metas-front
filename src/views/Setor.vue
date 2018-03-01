<template lang="pug">
  #diretoria-view.container.text-left
    b-btn(
      @click='backToMain'
      variant='outline-secondary'
    ).mb-2 Voltar para lista de diretorias
    h3 Diretoria
    h4(v-if="loading") Carregando...
    div(v-else)#diretoria-details
      h4 {{ setor.sigla || '' }} - {{ setor.nome || '' }}
        br
        small(v-if='setor.responsavel') Responsável: {{ setor.responsavel.nome }}
      p(v-if='setor.endereco') Endereço: {{ setor.endereço }}
      p(v-if='setor.telefone') Telefone: {{ setor.telefone }}
      span(v-if='setor.ramal') (ramal {{ setor.ramal }})
      b-row
        b-col
          h5 Coordenadorias
        b-col.text-right
          b-btn.floating(
            variant='primary'
            v-if="can('coord_create')"
            @click="goToAddCoordenadoria"
          ) Criar nova coordenadoria
      b-table(striped stacked :items='setor.coordenadorias' :fields='fields' @row-clicked='goToCoordDetails')
</template>
<script>
import GET_SETOR from '@/constants/get-setor'
import router from '@/router'
export default {
  name: 'Diretoria',
  methods: {
    can: function (p) { return !!this.user.permissions[p] },
    go: (...args) => router.push(...args),
    goToAddCoordenadoria: function () {
      return this.go({ name: 'AddCoordenadoria', params: { setorId: this.setor.id } })
    },
    goToCoordDetails: function (item) {
      return this.go({
        name: 'Coordenadoria',
        params: { setorId: this.setor.id, coordId: item.id }
      })
    },
    backToMain: () => router.go(-1)
  },
  data () {
    return {
      loading: 0,
      setor: {},
      fields: [
        'sigla',
        'nome',
        { key: 'responsavel', label: 'Responsável', formatter: v => (('nome' in v) ? v.nome : '') },
        'telefone',
        'ramal',
        { key: 'metas', formatter: v => v.length }
      ],
      user: { permissions: { coord_create: true } }
    }
  },
  apollo: {
    setor: {
      query: GET_SETOR,
      variables () {
        return {
          setorId: this.$route.params.setorId
        }
      }
    }
  }
}
</script>
