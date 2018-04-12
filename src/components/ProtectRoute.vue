<script>
export function protect (to, from, next) { // proteção de rota
  next(vm => vm.$root.$children[0].usuario === null ? next('/login') : true)
}
export default {
  //
}
</script>
