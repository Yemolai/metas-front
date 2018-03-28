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
import GET_ALL_PERMISSOES from '@/constants/get-all-permissoes'
import GET_USUARIO from '@/constants/get-usuario'
export default {
  name: 'App',
  components: {
    topBarComponent,
    footerComponent
  },
  data () {
    let token = window.localStorage.getItem('token')
    // console.log('token:', token)
    return {
      loading: 0,
      permissoes: [],
      usuarioId: 0,
      usuario: {},
      token
    }
  },
  watch: {
    token: function () {
      if (this.token === null) {
        return false
      }
      let vm = this
      axios.get('http://localhost:7700/user/', { headers: { Authorization: 'Bearer ' + this.token } })
        .then(response => {
          if (response.data) {
            console.log('data', response.data)
            vm.usuarioId = response.data
          } else {
            vm.usuarioId = 0
            console.log('response:', response)
          }
        })
    }
  },
  apollo: {
    permissoes: {
      query: GET_ALL_PERMISSOES
    },
    usuario: {
      query: GET_USUARIO,
      variables: { // TODO: mudar aqui para um watch e apenas fazer refetch
        userId: this.usuarioId || 0
      }
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
