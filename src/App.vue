<template lang="pug">
  #app
    top-bar-component(:usuario="usuario")
    router-view#view
    //- footer-component
</template>

<script>
import axios from 'axios'
import topBarComponent from '@/components/top-bar'
import footerComponent from '@/components/footer'
import GET_USUARIO from '@/constants/get-usuario'
import cfg from '@/cfg.json'
export default {
  name: 'App',
  components: {
    topBarComponent,
    footerComponent
  },
  data () {
    return {
      loading: 0,
      permissoes: [],
      usuarioId: 0,
      usuario: {},
      token: null
    }
  },
  mounted: function () {
    this.token = window.localStorage.getItem('token')
  },
  watch: {
    token: function (newToken, oldToken) {
      if (oldToken !== null && newToken === null) {
        this.usuarioId = 0
        return false
      } else if (newToken !== null && oldToken === null) {
        let vm = this
        let addr = cfg.server + '/user'
        let opts = { headers: { Authorization: 'Bearer ' + this.token } }
        axios.get(addr, opts)
          .then(res => {
            if (res.data) {
              vm.usuarioId = res.data.user || 0
            } else {
              vm.usuarioId = 0
            }
          })
      }
    },
    usuarioId: function () {
      this.$apollo.queries.usuario.refetch({ userId: this.usuarioId })
    },
    usuario: function (novoUsuario, antigoUsuario) {
      let { currentRoute } = this.$router
      if (novoUsuario === null && antigoUsuario !== null && currentRoute.name !== 'Login') {
        this.$router.push({ path: '/login', query: { redirect: currentRoute.fullPath } })
      } else if (novoUsuario !== null && antigoUsuario === null && currentRoute.name === 'Login') {
        // as the user wants to continue navigation after login, use the redirect to guide the next route
        this.$router.replace(this.$router.currentRoute.query.redirect || { name: 'Home' })
      }
    }
  },
  apollo: {
    usuario: {
      query: GET_USUARIO,
      variables: { userId: this.usuarioId || 0 }
    }
  }
}
</script>

<style>
@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css);
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
*:focus {
  outline: none !important;
}
.navbar {
  margin-bottom: 1rem;
}
.navbar-brand {
  align-self: center;
}
.floating {
  padding: 0.2rem 0.7rem;
  margin: 0.3rem 0.2rem;
  box-shadow: 0.2rem 0.2rem 0.3rem -0.05rem rgba(15,15,15,0.2);
}
</style>
