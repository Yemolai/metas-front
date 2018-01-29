<template lang="pug">
  .radial-progress
    vue-chart.radial.chart(
      type='doughnut'
      :options='options'
      :data='data'
    )
</template>
<script>
import VueChart from 'vue-chart-js'

export default {
  name: 'radial-progress',
  props: [
    'values'
  ],
  components: {
    VueChart
  },
  data () {
    let datasets = []
    let labels = []
    for (let idx in this.values) {
      if (this.values[idx][0] && this.values[idx][1]) {
        let percentage = Number(this.values[idx][0]) / Number(this.values[idx][1])
        if (percentage > 1) {
          percentage = 1
        }
        let color
        switch (true) {
          case percentage < 0.4:
            color = 'rgba(245, 45, 45, 0.8)'
            break
          case percentage < 0.6:
            color = 'rgba(245, 245, 0, 0.8)'
            break
          default:
            color = 'rgba(45, 225, 45, 0.8)'
        }
        datasets.push({
          data: [percentage * 100, (1 - percentage) * 100],
          backgroundColor: [color, 'rgba(0, 0, 0, 0.1)']
        })
      }
    }
    return {
      options: {
        cutoutPercentage: 60,
        rotation: Math.PI,
        circumference: Math.PI,
        tooltips: {
          enabled: false
        }
      },
      data: {
        datasets,
        labels
      }
    }
  }
}
</script>
<style scoped>
  .overlay {
    position: absolute;
    background: rgba(0,0,0,0);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .overlay-text {
    color: #111;
    font-size: 2rem;
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    vertical-align: middle;
  }
</style>
