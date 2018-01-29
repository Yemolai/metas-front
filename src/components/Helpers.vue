<script>
export default {
    createBRDate (dateStr) {
    return new Date(...(dateStr)
        .split('/')
        .map((s, i) => (i === 1 ? s-- : s))
        .reverse())
    },
    scopeQualitySerialization () {
    return Number(this.realized) + '/' + Number(this.predicted)
    },
    deadlineSerialization () {
    console.log(this.predicted)
    let pS = createBRDate(this.predicted.start)
    let pE = createBRDate(this.predicted.end)
    let rS = this.realized.start ? createBRDate(this.realized.start) : false
    let rE = this.realized.end ? createBRDate(this.realized.end) : false
    if (!!rS && !!rE) {
        if (pS === rS && pE === rE) {
        let dias = (rE.getMilliseconds() - rS.getMilliseconds()) / 1000 / 24
        return 'Concluído em ' + dias + ' dia' + (dias > 1 ? 's' : '')
        }
    }
    }
}
</script>
