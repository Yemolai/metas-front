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
                v-model="form.username"
                placeholder="nome.sobrenome"
                required
              )#username-field-input
            b-form-group(
              label="Senha"
              label-for="password-field-input"
            )#password-field-group
              b-form-input(
                type="text"
                v-model="form.password"
                placeholder="***************"
                required
              )#password-field-input
            b-row
              b-col
                b-check(plain v-model="form.rememberMe").mb-2
                  small Lembrar de mim
              //- b-col.ml-0.text-right
              //-   router-link(:to="{ name: 'ForgotPassword' }")
              //-     small Esqueceu a senha?
            b-btn(
              block
              disabled
              variant="outline-primary"
              type="submit"
            )#submit-form Entrar
</template>
<script>
export default {
  data () {
    return {
      form: {
        username: null,
        password: null,
        rememberMe: false
      }
    }
  },
  methods: {
    submitForm: function () {
      alert('Dados incorretos')
    },
    resetForm: function () {
      //
    }
  }
}
</script>
