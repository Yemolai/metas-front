<template>
  <div class="overlay-container" :style="styles.container">
    <donut-chart
      :chart-data="datacollection"
      :options="options"
    />
    <div class="centered-overlay-text">
      {{ progress }}
    </div>
  </div>
</template>

<script>
import DonutChart from '@/components/donut-chart.js'
import num from '@/fn/num'
export default {
  components: {
    DonutChart
  },
  props: ['data', 'height', 'width'],
  data () {
    let v = this.data ? ((this.data[0][0] / this.data[0][1]) * 100) : 0
    let progress = num(v) + ' %'
    return {
      progress,
      datacollection: null,
      options: {
        cutoutPercentage: 60,
        rotation: Math.PI,
        circumference: Math.PI,
        tooltips: { enabled: false },
        hover: { mode: null }
      },
      styles: {
        container: {
          position: 'relative',
          height: this.height ? this.height : '100%',
          width: this.width ? this.width : '100%'
        }
      }
    }
  },
  mounted () {
    this.fillData()
  },
  computed: {
    value: function () {
      return this.data ? (this.data[0][0] / this.data[0][1]) : 0
    }
  },
  watch: {
    data: function () {
      this.fillData()
      let p = this.value
      let v = p * 100
      let value = v.toFixed(2).split('.')
      value[0] = value[0].split(/(?=(?:...)*$)/).join('.')
    }
  },
  methods: {
    fillData () {
      let datasets = []
      let labels = []
      let data = this.data ? this.data : [[80, 100]]
      for (let idx in data) {
        let percentage = Number(data[idx][0]) / Number(data[idx][1])
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
      this.datacollection = { datasets, labels }
    }
  }
}
</script>
<style scoped>
  .overlay-container {
    position: relative;
    text-align: center;
    color: black;
  }
  .centered-overlay-text {
    transform: translate(-50%, -50%);
    position: absolute;
    padding-top: 4rem;
    font-weight: 800;
    font-size: 1rem;
    left: 50%;
    top: 50%;
  }
</style>
