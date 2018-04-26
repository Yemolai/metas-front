<template lang="pug">
  b-container.changePasswordView
    h2 Alterar senha
    b-form(action="#" @submit="change")
      b-form-group(
        description="confirme sua senha atual"
        label="Senha"
        label-for="senha-atual"
        invalid-feedback="Senha incorreta"
        valid-feedback="Senha correta, prossiga"
        :feedback='authState'
      ).grupo-senha-atual
        b-form-input(
          type="password"
          :state='authState'
          v-model='password'
        )#senha-atual
      b-form-group(
        description="insira a nova senha"
        label="Nova senha"
        label-for="senha-nova"
        :invalid-feedback='invalidNewPasswordReason'
        valid-feedback="Nova senha aceita como válida"
        :feedback='newPasswordCheck'
      ).grupo-nova-senha
        b-form-input(
          :state='newPasswordCheck'
        )
</template>
<script>
export default {
  name: 'change-password',
  computed: {
    isNewPasswordRepeated: function () {
      return this.newPassword === this.newPasswordRepeat
    },
    authState: function () {
      return password !== null
    },
    invalidNewPasswordReason: function () {
      switch (this.newPasswordProblem) {
        case 'TOO_SHORT':
          return 'Senha muito curta'
        case 'TOO_SIMPLE':
          return 'Senha muito simples (use numeros e letras maiúsculas e minúsculas)'
        case 'EMPTY':
          return 'Senha "vazia" não é permitida'
        case 'NUMERIC':
          return 'Senha não deve ser composta apenas por números'
        default:
          return 'Senha fraca'
      }
    },
    newPasswordCheck: function () {
      if (this.authState) {

      }
      return null
    }
  },
  data () {
    return {
      password: null,
      newPassword: null,
      newPasswordRepeat: null,
      newPasswordProblem: null,
      problems: ['TOO_SHORT', 'TOO_SIMPLE', 'EMPTY', 'NUMERIC']
    }
  }
}
</script>
<style scoped>
  /* */
</style>
