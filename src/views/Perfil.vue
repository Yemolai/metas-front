<template lang="pug">
  #perfil-view
    b-container(v-if="!loading && usuario").h-100
      b-row
        b-col
          h2 {{ usuario.nome }}
          h5
            small ({{ usuario.usuario }})
      b-row
        b-col(v-if='usuario.coordenadoria')
          b-card(:title='usuario.coordenadoria.sigla')
            p.card-text {{ usuadio.coordenadoria.nome }}

</template>
<script>
import GET_USUARIO from '@/constants/get-usuario'
export default {
  data () {
    return { loading: false, usuario: {} }
  },
  apollo: {
    usuario: {
      query: GET_USUARIO,
      variables () {
        return { userId: this.$route.params.userId || 0 }
      }
    }
  }
}
</script>
