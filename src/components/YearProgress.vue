<template lang="pug">
b-container.year-progress
    b-row
        b-col(v-for='(month, idx) in shownMonths' :key='idx')
            h5.month {{ month }}
    b-progress(
        :value='counter'
        :max='max'
        :precision='precision'
        show-progress
        animated
    )
</template>
<script>
export default {
  props: [
    'months'
  ],
  data () {
    let w = window.innerWidth
    let defaultMonths = []
    if (w >= 1200) {
      defaultMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    } else if (w >= 992) {
      defaultMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    } else if (w >= 768) {
      defaultMonths = ['Jan', 'Abr', '...', 'Set', 'Dez']
    } else if (w >= 576) {
      defaultMonths = ['Jan', 'Mar', 'Jun', 'Jul', 'Out', 'Dez']
    } else if (w < 576) {
      defaultMonths = ['Jan', 'Jun', 'Jul', 'Dez']
    }
    let now = new Date()
    let start = new Date(now.getFullYear(), 0, 0)
    let diff = now - start
    let oneDay = 1000 * 60 * 60 * 24
    let day = Math.floor(diff / oneDay)
    let days = (new Date().getFullYear() % 4 === 0 ? 366 : 365)
    return {
      shownMonths: this.months ? this.months : defaultMonths,
      counter: day,
      max: days,
      precision: 2
    }
  }
}
</script>
<style scoped>
    /* Garantir que os meses fiquem igualmente espaçados */
</style>
