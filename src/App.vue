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
    return {
      loading: 0,
      permissoes: [],
      usuario: {},
      token: null
    }
  },
  apollo: {
    permissoes: {
      query: GET_ALL_PERMISSOES
    },
    usuario () {
      let token = window.localStorage.getItem('token')
      if (token === null) {
        return {
          query: GET_USUARIO,
          variables: { userId: 0 }
        }
      }
      return axios
        .get('http://localhost:7700/user/', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then(response => console.log('response:', response))
        .catch(error => console.error('error:', error))
        .then()
    }
  }
}
</script>

<style>
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
