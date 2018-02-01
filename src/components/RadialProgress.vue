<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  name: 'radial-progress',
  mounted () {
    let datasets = []
    let labels = []
    if (!this.chartData) {
      // console.error('no data provided for radial-progress component')
      this.chartData = [[80, 100]]
    }
    for (let idx in this.chartData) {
      let percentage = Number(this.chartData[idx][0]) / Number(this.chartData[idx][1])
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
    let options = {
      cutoutPercentage: 60,
      rotation: Math.PI,
      circumference: Math.PI,
      tooltips: {
        enabled: false
      }
    }
    let data = {
      datasets,
      labels
    }
    this.renderChart(data, options)
  }
}
</script>
