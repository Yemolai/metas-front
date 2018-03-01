<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.floating {
  padding: 0.2rem 0.7rem;
  margin: 0.3rem 0.2rem;
  box-shadow: 0.2rem 0.2rem 0.3rem -0.05rem rgba(15,15,15,0.2);
}
</style>
