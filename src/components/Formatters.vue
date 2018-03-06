<script>
import Helpers from '@/components/Helpers'
const toDate = v => typeof v === 'number' ? new Date(v) : typeof v === 'string' ? new Date(Number(v)) : null
export default {
  // FORMATADORES  DE CAMPOS:
  escopo (v, k, i) {
    let n = v => (Number(v) || 0)
    let s = v => Helpers.numero()(n(v))
    let r = n(i.escopo_realizado)
    let p = n(i.escopo_previsto)
    let percent = r / (p || 1)
    let status = isNaN(percent) ? 'info' : (percent < 1 ? (percent < 0.5 ? 'danger' : 'warning') : 'success')
    return `<span class="text-${status}">${s(r)}/<small>${s(p)}</small><br/>${s(percent * 100)} %</span>`
  },
  deadline (f, k, v) { // formatador do prazo
    let literal = v.literalDates || false
    let predictedStartDate = toDate(v.inicio_previsto)
    let predictedEndDate = toDate(v.fim_previsto)
    let realizedStartDate = toDate(v.inicio_realizado)
    let realizedEndDate = toDate(v.fim_realizado)
    if (realizedEndDate !== null) { // se temos data de fim de meta
      if (literal) {
        return `finalizado<br>${(realizedEndDate).toLocaleDateString()}`
      }
      let daysOfDatesDiff
      if (predictedEndDate === null) {
        daysOfDatesDiff = Helpers.getDaysFromDate((new Date()) - realizedEndDate)
      }
      daysOfDatesDiff = Helpers.getDaysFromDate(realizedEndDate - predictedEndDate)
      let descritiveDays = ` ${Math.abs(daysOfDatesDiff)} dia${Helpers.plural(daysOfDatesDiff)}`
      if (predictedEndDate !== null) {
        if (daysOfDatesDiff > 0) {
          return '<span class="text-danger">atrasou</span><br>' + descritiveDays
        } else if (daysOfDatesDiff < 0) {
          return '<span class="text-primary">adiantou</span><br>' + descritiveDays
        } else {
          return '<span class="text-success">no prazo</span><br>' + (realizedEndDate).toLocaleDateString()
        }
      } else {
        if (daysOfDatesDiff === 0) {
          return '<span class="text-success">finalizado</span><br>hoje'
        } else {
          return '<span class="text-primary">terminado há</span><br>' + descritiveDays + ' atrás'
        }
      }
    } else if (predictedEndDate !== null && realizedStartDate !== null) { // se temos data prevista para o fim da meta
      if (literal) {
        return `termina<br>${(predictedEndDate).toLocaleDateString()}`
      }
      let daysUntilDeadline = Helpers.getDaysFromDate(predictedEndDate - (new Date()))
      let descritiveDeadline = `${Math.abs(daysUntilDeadline)} dia${Helpers.plural(daysUntilDeadline)}`
      if (daysUntilDeadline > 0) {
        return '<span class="text-warning">vence em</span><br>' + descritiveDeadline
      } else if (daysUntilDeadline < 0) {
        return '<span class="text-danger">atrasado</span><br>' + descritiveDeadline
      } else {
        return '<span class="text-danger">vence hoje</span><br>' + (new Date()).toLocaleDateString()
      }
    } else if (realizedStartDate !== null) { // se temos apenas um começo sem final definido
      if (literal) {
        return `começou<br>${(realizedStartDate).toLocaleDateString()}`
      }
      let daysFromMilestoneStarted = Helpers.getDaysFromDate((new Date()) - realizedStartDate)
      return `começou há<br>${daysFromMilestoneStarted} dia${Helpers.plural(daysFromMilestoneStarted)}`
    } else if (predictedStartDate !== null) { // se temos apenas uma previsão de início
      if (literal) {
        return 'início<br>' + (predictedStartDate).toLocaleDateString()
      }
      let descritiveText
      let daysToMilestone = Helpers.getDaysFromDate(predictedStartDate - (new Date()))
      let descritiveDaysToMilestone = `
        <br>
        ${Math.abs(daysToMilestone)}
        dia${Helpers.plural(daysToMilestone)}
        ${daysToMilestone < 0 ? ' atrás' : ''}`
      if (daysToMilestone > 0) {
        descritiveText = 'começará em'
      } else if (daysToMilestone < 0) {
        descritiveText = '<span class="text-danger">começaria</span> '
      } else {
        descritiveText = '<span class="text-warning">começa hoje</span>'
      }
      return descritiveText + descritiveDaysToMilestone
    } else {
      return '<small>data<br>indefinida</small>'
    }
  },
  lastUpdate (v, k, i) { // formatador de última atualização
    let lud = i.lastUpdateDate
    return (v && lud) ? `${v}<br><small>(${lud})</small>` : ''
  },
  scopeQuality (v) { // formatador de progresso
    let done = isNaN(Number(v.realized)) ? 0 : Number(v.realized)
    let target = isNaN(Number(v.predicted)) ? 0 : Number(v.predicted)
    let progress = done / target
    if (isNaN(progress)) {
      progress = 0
    }
    let level
    if (progress > 1) {
      level = 'text-primary'
    } else if (progress === 1) {
      level = 'text-success'
    } else if (progress < 0.4) {
      level = 'text-warning'
    } else if (progress <= 0) {
      level = 'text-secondary'
    }
    return `${done}<small>/${target}<br>
    (<span class="${level}">${(progress * 100).toFixed(2)}%</span>)</small>`
  },
  cost: v => { // formatador de custo
    if (!v || (Number(v.realized) === 0 && Number(v.predicted === 0))) {
      return ''
    }
    return `R$ ${(Number(v.realized)).toFixed(2)}/R$ ${(Number(v.predicted)).toFixed(2)}`
  }
}
</script>
