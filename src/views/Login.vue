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
          b-form(@submit="submitForm" @reset="resetForm")
            h4 Login
            b-form-group(
              label="Nome de usuário"
              label-for="username-field-input"
            )#username-field-group
              b-form-input(
                type="text"
                v-model="username"
                placeholder="nome.sobrenome"
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
            )#submit-form Entrar
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      username: null,
      password: null,
      rememberMe: false
    }
  },
  methods: {
    submitForm: function () {
      let { username, password } = this
      if (username && password) {
        axios.post('http://localhost:7700/auth/login',
          { // data
            usuario: username,
            senha: password
          }, { // options
            'Content-Type': 'application/json', // needed to explicitly define payload as json
            responseType: 'json' // needed to explicitly define response as json
          })
          .then(function (response) {
            console.log('response:', typeof response, response)
            if (response.data.token) {
              window.localStorage.setItem('token', response.data.token)
            } else {
              alert(response.data.message || 'Não foi possível realizar login.')
            }
          })
          .catch(response => alert(response.message || 'Não foi possível realizar login. Contate o suporte.'))
      } else {
        alert('Campos não preenchidos')
        console.log('username:', username)
        console.log('password:', password)
      }
    },
    resetForm: function () {
      //
    }
  }
}
</script>
