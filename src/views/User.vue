<template lang="pug">
  #perfil-view
    b-container(v-if='loading') Carregando...
    b-container(v-if='loading && !usuario')
      h5.text-danger Não foi possível carregar o usuário
    b-container(v-if="!loading && usuario").h-100
      b-row
        b-col
          b-img(rounded='circle' align='center' :src="usuario.avatar || '/static/unknown.png'" height='128')
          h2 {{ usuario.nome }}
          p
            span criado em {{ moment(usuario.createdAt).format('LLL') }}
            br
            span {{ usuario.usuario }}
      b-row.mb-3
        b-col
          b-card(title='Setor' border-variant="light")
            p.card-text(v-if='usuario.setor || usuario.coordenadoria')
              span(v-if='usuario.setor') {{ usuario.setor.sigla }}
              span(v-else) [sem diretoria]
              span /
              span(v-if='usuario.coordenadoria') {{ usuario.coordenadoria.sigla }}
              span(v-else) [sem coordenadoria]
            p.card-text(v-else) Não está em um setor
        b-col
          b-card(title='Metas' border-variant="light")
            p.card-text(v-if='metas')
              span.numero {{ metas.length }}
              span.caption &nbsp;meta{{ metas.length === 1 ? '' : 's' }}
            p.card-text(v-else) Não tem metas
        b-col
          b-card(title='Conclusão' border-variant="light")
            p.card-text(v-if='metas')
              span.numero {{ progresso }}%
              span.caption &nbsp;de {{ ano }}
              br
              small {{ emAndamento }} em andamento
              br
              small {{ concluidas }} concluída{{ concluidas === 1 ? '' : 's' }}
            p.card-text(v-else) Não tem metas
      b-row.mb-3
        b-col
          b-card(title='Prazos' border-variant="light")
            p.card-text x9
        b-col
          b-card(title='Últimas atualizações' border-variant="light")
            p.card-text lista
      b-row.mb-3
        b-col
          b-card(title='Permissões' border-variant="light")
            b-collapse(
              v-model='collapsePermissoes'
            )#collapse-permissoes
              b-list-group
                b-list-group-item(
                  v-for='permissao in permissoes' :key='permissao.name'
                ).d-flex.justify-content-between.align-items-center
                  span {{ permissao.name }}
                  b-badge(:variant="permissao.value ? 'success' : 'muted'" pill)
                    i(v-if='permissao.value').fa.fa-check
                    i(v-if='!permissao.value').fa.fa-close
            b-btn(
              block
              size="sm"
              variant="outline-secondary"
              aria-controls="collapse-permissoes"
              :title="collapsePermissoes ? 'Ocultar' : 'Ver todos'"
              :class="collapsePermissoes ? 'collapsed' : null"
              :aria-expanded="collapsePermissoes ? 'true' : 'false'"
              @click="collapsePermissoes = !collapsePermissoes")
                span(v-if="collapsePermissoes").fa.fa-chevron-up
                span(v-else).fa.fa-chevron-down
  </template>
<script>
import gql from 'graphql-tag'
import GET_USUARIO from '@/constants/get-usuario'
import permissionDescription from '@/constants/permissoes.json'
import Helpers from '@/components/Helpers.vue'
import moment from 'moment'
const num = Helpers.numero()
const GET_NULLABLE_USUARIO = gql`
  query NULLABLE_USUARIO {
    usuario(id: 0) {
      id
    }
  }
`
const GET_METAS_USUARIO = gql`
  query GET_METAS_USUARIO($userId: ID!) {
    usuario(id: $userId) {
      id
      guid
      nome
      usuario
      responsabilidade {
        id
        titulo
        escopo_previsto
        escopo_realizado
        inicio_previsto
        fim_previsto
        inicio_realizado
        fim_realizado
        custo_previsto
        custo_realizado
        atualizado
        createdAt
        updatedAt
        coordenadoria {
          id
          sigla
          setor {
            id
            sigla
          }
        }
      }
    }
  }
`


export default {
  data () {
    return {
      loading: false,
      usuario: null,
      metas: null,
      collapsePermissoes: false
    }
  },
  methods: {
    moment,
    privilegeDescription: v => v
  },
  computed: {
    permissoes: function () {
      let arr = []
      let hide = ['id', 'nome', 'createdAt', 'updatedAt', '__typename']
      let nullFields = {}
      for (let field of hide) {
        nullFields[field] = null
      }
      let rwObjCopy = Object.assign({}, this.usuario.permissoes)
      let permissoes = Object.assign(rwObjCopy, nullFields)
      for (let key of Object.keys(permissoes)) {
        if (permissoes[key] !== null) {
          arr.push({
            key,
            name: permissionDescription[key],
            value: permissoes[key]
          })
        }
      }
      return arr
    },
    emAndamento: function () {
      return 0
    },
    progresso: function () {
      if (this.metas.length > 0) {
        let sum = this.metas
          .map(m => {
            let v = Number(m.escopo_realizado || 0) / Number(m.escopo_previsto || 0)
            return isNaN(v) ? 0 : v
          })
          .reduce((p, a) => (p + a), 0)
        let mid = sum / this.metas.length
        let midText = mid ? num(mid) : '0,00'
        return midText
      } else {
        return '0,00'
      }
    },
    concluidas: function () {
      return 0
    },
    ano: function () {
      return (new Date()).getFullYear()
    }
  },
  apollo: {
    usuario: {
      query: GET_USUARIO,
      variables () {
        let zero = {userId: 0}
        try {
          let app = this.$root.$children[0]
          let usuario = app.usuario || null
          if (this.$route.params && this.$route.params.userId) {
            return this.$route.params.userId
          } else if (app && usuario) {
            return { userId: usuario.id }
          } else {
            return zero
          }
        } catch (err) {
          console.error(err)
          return zero
        }
      }
    },
    metasUsuario () {
      let nullableQuery = GET_NULLABLE_USUARIO
      let metasQuery = GET_METAS_USUARIO
      try {
        let app = this.$root.$children[0]
        let usuario = app.usuario || null
        let params = this.$route.params || {}
        let userId = params.userId ? params.userId : (usuario ? usuario.id || 0 : 0)
        return {
          query: userId ? metasQuery : nullableQuery,
          variables: { userId },
          update: userId ? v => { this.metas = v ? v.usuario.responsabilidade : [] } : v => null
        }
      } catch (err) {
        console.err(err)
        return { query: nullableQuery }
      }
    }
  }
}
</script>
