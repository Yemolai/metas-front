<template lang="pug">
  #app
    top-bar-component
    router-view#view
    //- footer-component
</template>

<script>
import topBarComponent from '@/components/top-bar'
import footerComponent from '@/components/footer'
export default {
  name: 'App',
  components: {
    topBarComponent,
    footerComponent
  }
}
</script>

<style>
@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css);
@import url(https://bootswatch.com/4/cosmo/bootstrap.min.css);
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
