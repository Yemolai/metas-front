<script>
export default {
  lastUpdate (a, b) {
    if (a === b) {
      return 0
    }
    let sortable = [a, b].sort()
    if (sortable.indexOf(a) === 0) {
      return -1
    } else {
      return 1
    }
  },
  scopeQuality (A, B) {
    if (A.predicted && A.realized && B.predicted && B.realized) {
      let a = Number(((A.realized / A.predicted) * 100).toFixed(2))
      let b = Number(((B.realized / B.predicted) * 100).toFixed(2))
      return (a === b) ? 0 : ((a < b) ? -1 : 1)
    }
  }
}
</script>
