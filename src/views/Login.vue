<template lang="pug">
  #login-view
    b-container(fluid).h-100
      b-row.h-100.justify-content-md-center
        b-col
          b-img(
            src="http://blogrh.com.br/wp-content/uploads/2016/07/metas-smart.png"
            width="160rem"
            height="160rem"
            rounded="circle"
          )
      b-container.my-4.text-left
        b-card(style="max-width: 32rem").mx-auto
          b-form(@submit="submitForm")
            h4 Login
            b-form-group(
              label="Nome de usuário"
              label-for="username-field-input"
            )#username-field-group
              b-form-input(
                type="text"
                v-model="username"
                placeholder="nome.sobrenome"
                autocomplete="username"
                required
              )#username-field-input
            b-form-group(
              label="Senha"
              label-for="password-field-input"
            )#password-field-group
              b-form-input(
                type="password"
                v-model="password"
                placeholder="***************"
                autocomplete="current-password"
                required
              )#password-field-input
            b-row
              b-col
                b-check(plain v-model="rememberMe").mb-2
                  small Lembrar de mim
              //- b-col.ml-0.text-right
              //-   router-link(:to="{ name: 'ForgotPassword' }")
              //-     small Esqueceu a senha?
            b-btn(
              block
              variant="outline-primary"
              type="submit"
              :disabled="logged === true"
            )#submit-form Entrar
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import cfg from '@/cfg.json'
export default {
  data () {
    return {
      username: null,
      password: null,
      rememberMe: true
    }
  },
  computed: {
    logged: function () {
      let app = this.$root.$children[0]
      if (!app) { return false }
      return !!app.usuario
    }
  },
  methods: {
    submitForm: function () {
      let app = this.$root.$children[0]
      let address = cfg.server + '/auth/login'
      let usuario = this.username
      let senha = this.password
      let vm = this
      let reqOptions = { // requisition options
        'Content-Type': 'application/json', // needed to explicitly define payload as json
        responseType: 'json' // needed to explicitly define response as json
      }
      if (usuario && senha) {
        axios.post(address, { usuario, senha }, reqOptions)
          .then(function (response) {
            if (response.data.token) {
              // usar sessionStorage quando "rememberMe" for false
              window.localStorage.setItem('token', response.data.token)
              app.token = response.data.token
              if (!(vm.$router.query && vm.$router.query.redirect)) {
                vm.$router.replace({ name: 'Home' })
              }
            } else {
              alert(response.data.message || 'Não foi possível realizar login.')
            }
          })
          .catch(response => alert(response.message || 'Não foi possível realizar login. Contate o suporte.'))
      } else {
        alert('Campos não preenchidos')
      }
    }
  }
}
</script>
