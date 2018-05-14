<template lang="pug">
  b-container.changePasswordView
    h2 Alterar senha
    b-form(action="#")
      b-form-input(
        :hidden='true'
        v-model='username'
        autocomplete='username'
        :disabled='true'
      )#username
      b-form-group(
        description="confirme sua senha atual"
        label="Senha"
        label-for="current-password"
        invalid-feedback="Senha incorreta"
        valid-feedback="✔"
        :feedback="'' + authState"
      ).grupo-senha-atual
        b-form-input(
          type="password"
          @change='validatePassword'
          :state='authState'
          v-model='password'
          autocomplete='current-password'
        )#current-password
      b-form-group(
        description="insira a nova senha"
        label="Nova senha"
        label-for="new-password"
        :disabled="'' + !this.authState"
        invalid-feedback='✕'
        valid-feedback="✔"
        :feedback="'' + newPasswordCheck"
      ).grupo-nova-senha
        b-form-input(
          :state='newPasswordCheck'
          type="password"
          v-model='newPassword'
          autocomplete='new-password'
        )#new-password
      b-form-group(
        description="insira a nova senha"
        label="Repita a nova senha"
        label-for="repeat-password"
        invalid-feedback='✕'
        valid-feedback="✔"
        :feedback="'' + isNewPasswordRepeated"
      ).grupo-nova-senha
        b-form-input(
          :state='isNewPasswordRepeated'
          type="password"
          v-model='newPasswordRepeat'
          autocomplete='new-password'
        )#repeat-password
      b-button(
        @click='change'
        :disabled='buttonDisabled'
        :variant='buttonVariant'
        size='lg'
      ) {{ buttonText }}
</template>
<script>
import axios from 'axios'
import gql from 'graphql-tag'
import cfg from '@/cfg.json'

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ($id: ID!, $oldPassword: String!, $newPassword: String!) {
    changePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword)
  }
`

export default {
  name: 'change-password',
  methods: {
    validatePassword: function (senha) {
      if (senha === null) {
        this.authState = null
        return false
      }
      if (!this.verifyingPassword) {
        let reqOptions = { // requisition options
          'Content-Type': 'application/json', // needed to explicitly define payload as json
          responseType: 'json' // needed to explicitly define response as json
        }
        let vm = this
        this.verifyingPassword = true
        let credentials = { usuario: this.username, senha }
        axios.post(cfg.server + '/auth/login', credentials, reqOptions)
          .then(response => {
            vm.verifyingPassword = false
            vm.authState = 'token' in response.data
          })
      }
    },
    change: function () {
      if (this.authState === true && !this.buttonDisabled) {
        let { id } = this.$root.$children[0].usuario
        let { password, newPassword } = this
        let mutation = CHANGE_PASSWORD_MUTATION
        let variables = { id, oldPassword: password, newPassword }
        let vm = this
        this.$apollo.mutate({ mutation, variables })
          .then(() => {
            console.log('arguments: ', ...arguments)
            vm.newPasswordRepeat = null
            vm.newPassword = null
            vm.password = null
            alert('Sua senha foi alterada')
            vm.$router.push({name: 'Home'})
          })
      } else {
        alert('Preencha os campos corretamente')
      }
    }
  },
  computed: {
    isNewPasswordRepeated: function () {
      return this.newPasswordCheck && this.newPassword === this.newPasswordRepeat
    },
    newPasswordCheck: function () {
      if (this.authState) {
        let emptyCheck = 'newPassword' in this && this.newPassword !== null
        let check = false
        try {
          let lengthCheck = this.newPassword.length > 5
          let differentCheck = this.password !== this.newPassword
          check = emptyCheck && lengthCheck && differentCheck
        } catch (err) {
          return false
        }
        return emptyCheck ? check : null
      }
      return null
    },
    buttonDisabled: function () {
      return this.authState !== true || !this.isNewPasswordRepeated || !this.newPasswordCheck
    },
    buttonText: function () {
      return this.buttonDisabled ? 'Preencha os campos' : 'Trocar senha'
    },
    buttonVariant: function () {
      return this.buttonDisabled ? 'outline-secondary' : 'outline-success'
    }
  },
  data () {
    let app = this.$root.$children[0]
    return {
      verifyingPassword: false,
      authState: null,
      username: app.usuario.usuario,
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
