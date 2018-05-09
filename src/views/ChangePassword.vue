<template lang="pug">
  b-container.changePasswordView
    h2 Alterar senha
    b-form(action="#" @submit="change")
      b-form-group(
        description="confirme sua senha atual"
        label="Senha"
        label-for="current-password"
        invalid-feedback="Senha incorreta"
        valid-feedback="✔"
        :feedback='authState'
      ).grupo-senha-atual
        b-form-input(
          type="password"
          :state='authState'
          v-model='password'
          autocomplete='current-password'
        )#current-password
      b-form-group(
        description="insira a nova senha"
        label="Nova senha"
        label-for="new-password"
        :invalid-feedback='invalidNewPasswordReason'
        valid-feedback="✔"
        :feedback='newPasswordCheck'
      ).grupo-nova-senha
        b-form-input(
          :state='newPasswordCheck'
          type="password"
          :v-model='newPassword'
        )#new-password
      b-form-group(
        description="insira a nova senha"
        label="Repita a nova senha"
        label-for="repeat-password"
        invalid-feedback='Não está igual ao campo acima'
        valid-feedback="✔"
        :feedback='isNewPasswordRepeated'
      ).grupo-nova-senha
        b-form-input(
          :state='repeatPasswordCheck'
          type="password"
          :v-model='newPasswordRepeat'
        )#repeat-password
      b-button(
        :disabled='buttonDisabled'
        :variant='buttonVariant'
        :size='lg'
      ) {{ buttonText }}
</template>
<script>
import axios from 'axios'
export default {
  name: 'change-password',
  computed: {
    isNewPasswordRepeated: function () {
      return this.newPassword === this.newPasswordRepeat
    },
    authState: function () {
      return this.password !== null
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
        return true
      }
      return null
    },
    buttonDisabled: function () {
      return true
    }
  },
  data () {
    return {
      buttonVariant: 'outline-secondary',
      buttonText: 'Preencha os campos',
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
  .changePasswordView {
    max-width: 25em
  }
</style>
