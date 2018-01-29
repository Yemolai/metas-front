<template lang='pug'>
  b-container#desempenho
    b-tabs
      b-tab(title='Visão geral' disabled)
        br
        | Aqui entra o resumo gráfico
      b-tab(title='Painel de resultados')
        br
        Resultados
      b-tab(title='Painel de desempenho' active)
        br
        Desempenho
      b-tab(title='Configurações' disabled)
        br
        | Disabled tab!
</template>
<script>
import Resultados from '@/views/Resultados'
import Desempenho from '@/views/Desempenho'

export default {
  name: 'desempenho',
  components: {
    Resultados,
    Desempenho
  }
}
</script>
<style scoped>

</style>
