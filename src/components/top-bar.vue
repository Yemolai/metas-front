<template lang="pug">
  nav#topbar
    b-navbar(toggleable="md" type="dark" variant="dark")
      b-navbar-brand M
        small ETAS
      b-navbar-toggle(target="nav_collapse")
      b-collapse(is-nav)#nav_collapse
        //- Aqui ficam os links de navegação à esquerda
        b-navbar-nav
          b-nav-item(href="#" @click="go('Home')")
            span I
            small NÍCIO
          b-nav-item-dropdown(href="#" @click="go('Painel')")
            template(slot="button-content")
              span P
              small AINÉIS
            b-dd-item(href="#" @click="go('PainelResultados')")
              span Resultados
            b-dd-item(href="#" @click="go('PainelDesempenho')")
              span Desempenho
          b-nav-item(href="#" @click="go('Diretorias')")
            span D
              small IRETORIAS
        //- Aqui começa a parte à direita da barra
        b-navbar-nav.ml-auto
          b-nav-item.mx-2(href="#" @click="go('AddMeta')" v-if="usuario !== null")
            span.fa.fa-lg.fa-plus &nbsp;
            span M
            small ETA
          b-nav-item.mx-2(href="#" @click="go('AddUser')")
            span.fa.fa-lg.fa-plus &nbsp;
            span U
              small SUARIO
          //- b-nav-form.form-inline.my-2.my-lg-0
            //- b-input-group(prepend="Username")
            //-   b-form-input(
            //-     type="text"
            //-     placeholder="[Ainda não funciona]"
            //-   ).topbar-search
            //-   b-btn.inverted-btn
            //-     span.fa.fa-search
          //- Language selector que ainda vai ser implementado
            b-nav-item-dropdown(right).mx-2
              template(slot="button-content")
                span I
                small DIOMA
              b-dropdown-item(href="#" active) PT Português
              //- b-dropdown-item(href="#") EN English
              //- b-dropdown-item(href="#") ES Español
          b-nav-item-dropdown.mx-2(v-if="usuario !== null")
            //- Nesse template entram os dados do usuário atual
            template(slot="button-content")
              b-img.user-avatar(src="/static/avatar.png")
              span &nbsp;
              span U
                small SERNAME
            b-dropdown-item(href="#" disabled)
              span Perfil
            b-dropdown-item(href="#" @click="go('Setor')")
              span Diretoria
            b-dropdown-item(href="#" @click="go('Coordenadoria')")
              span Coordenadoria
            b-dropdown-item(href="#") Sair
          b-nav-item(href="#" @click="go('Login')")
            span E
              small NTRAR
</template>
<script>
import router from '@/router'
export default {
  name: 'TopBar',
  props: ['usuario'],
  methods: {
    go: function (t) { if (this.places(t)) router.push(this.places(t)) },
    places: function (name) {
      let { setor, permissoes, coordenadoria } = this.usr
      switch (name) {
        default:
          return { name }
        case 'Setor': return { name, params: { setorId: this.usr.setor.id } }
        case 'Coordenadoria': return { name, params: { setorId: setor.id, coordId: coordenadoria.id } }
        case 'AddMeta': return (permissoes.create_meta === true) ? {
          name,
          params: { setor: setor.sigla, coordenadoria: coordenadoria.sigla }
        } : false
      }
    }
  },
  data () {
    console.log('usuario:', this.usuario)
    return {
      usr: {
        id: 1,
        nome: 'Romulo Gabriel Rodrigues',
        setor: {
          id: 1,
          sigla: 'STD'
        },
        coordenadoria: {
          id: 1,
          sigla: 'DTS'
        },
        permissoes: {
          create_meta: true
        }
      }
    }
  }
}
</script>
<style scoped>
  .user-avatar {
    margin: -0.5rem 0.25rem;
    height: 2rem;
    width: auto;
    border-radius: 1rem;
  }
  .form-control,input {
    border-radius: 0.2rem;
    border: rgba(0,0,0,0);
    outline: none !important;
  }
  .form-control:focus,input:focus {
    outline: none;
    outline: none !important;
  }
  .inverted-btn {
    background: #fff;
    color: #999;
    margin-left: -0.2rem;
    border: 0;
    border-radius: 0.2rem;
  }
  .inverted-btn:hover,.inverted-btn:focus {
    color: #444;
  }
</style>
