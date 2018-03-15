<template lang="pug">
  #diretoria-view.container.text-left
    b-btn(@click="go({name: 'Diretorias'})" variant='outline-secondary').mb-2
      span Lista de diretorias
    h2.text-center D
      small IRETORIA
    h4(v-if="loading") Carregando...
    div(v-else)#diretoria-details
      h4.text-center {{ setor.sigla || '' }} - {{ setor.nome || '' }}
      p(v-if='setor.responsavel') Diretor responsável: {{ setor.responsavel.nome }}
      p(v-if='setor.endereco') Endereço: {{ setor.endereço }}
      p(v-if='setor.telefone') Telefone: {{ setor.telefone }}
      span(v-if='setor.ramal') (ramal {{ setor.ramal }})
      b-row.mt-3
        b-col(sm='12' md='8')
          h4.mt-2 Coordenadorias:
        b-col(sm='12' md='4').text-right
          b-btn(
            variant='primary'
            v-if="can('coord_create')"
            @click="goToAddCoordenadoria"
          ).floating
            span Criar nova coordenadoria
      b-table(striped stacked='sm' :items='setor.coordenadorias' :fields='fields' @row-clicked='goToCoordDetails')
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
    }
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
        { key: 'metas', formatter: v => v ? v.length : '' }
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
