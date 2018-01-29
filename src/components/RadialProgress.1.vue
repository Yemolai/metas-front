<template lang="pug">
  .radial-progress
    radial-progress-bar(
      :diameter='diameter'
      :completed-steps='value'
      :total-steps='total'
      startColor='startColorCode'
      endColor='endColorCode'
      timingFunc='ease-in-out'
    )
    .overlay
      .overlay-text(:style="'top:'+(diameter/4)+'px;'") {{ progress }}%
</template>
<script>
import RadialProgressBar from 'vue-radial-progress/dist/vue-radial-progress.min.js'

export default {
  name: 'radial-progress',
  props: [
    'diameter',
    'value',
    'total',
    'color',
    'startColor',
    'endColor'
  ],
  components: {
    RadialProgressBar
  },
  data() {
    let v = Number(this.value)
    let t = Number(this.total)
    return {
      progress: Math.floor(v/t*100),
      startColorCode: this.color ? this.color : (this.startColor ? this.startColor : '#bbff42'),
      endColorCode: this.color ? this.color : (this.endColor ? this.endColor : '#429321'),

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
