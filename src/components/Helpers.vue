<script>
export default {
  numero (decimal = ',', thousands = '.') {
    return (v) => v ? Number(v).toFixed(2).replace('.', decimal) : ''
  },
  data (locale = 'pt-BR') {
    return (v) => v ? new Date(v).toLocaleDateString(locale) : ''
  },
  dinheiro (currency = 'R$', position = 'pre', decimal = ',', thousands = '.') {
    return (value) => {
      let numero = value.toFixed(2).split('.')
      numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.')
      if (position !== 'pre') {
        return numero.join(',') + '' + currency
      }
      return currency + ' ' + numero.join(',')
    }
  },
  plural (numericObj, singular, plural) {
    return isNaN(numericObj) ? null : (
      (numericObj > 1 || numericObj === 0 || numericObj < -1) ? (plural || 's') : (singular || '')
    )
  },
  getDaysFromDate (dateObj, whole = false) {
    let numericDate
    if (dateObj instanceof Date) {
      numericDate = dateObj.getTime()
    } else if (typeof dateObj === 'number') {
      numericDate = dateObj
    } else {
      console.error('getDaysFromDate\\dateObj not instanceof Date nor number:', typeof dateObj, dateObj)
      return null
    }
    let days = numericDate / (1000 * 60 * 60 * 24)
    return whole ? days : Math.floor(days)
  },
  /**
   * Recebe um objeto do tipo Date e retorna uma data em padrão brasileiro d/m/yyyy
   * @arg {object} dateObj Objeto Date
   * @returns {string} representação de data em padrão PT-BR (d/m/yyyy)
   */
  getBRDate (dateObj) {
    if (!(dateObj instanceof Date)) {
      console.error('getBRDate\\dateObj instanceof Date is', dateObj instanceof Date)
      return null
    }
    let day = dateObj.getDay()
    let month = dateObj.getMonth() + 1
    let year = dateObj.getFullYear()
    return `${day}/${month}/${year}`
  },
  createBRDate (dateStr) {
    if (dateStr === null) return null
    if (typeof dateStr !== 'string' && !(dateStr instanceof Date)) {
      console.error('createBRDate\\dateStr:', typeof dateStr, dateStr)
      return null
    }
    if (dateStr instanceof Date) {
      return `${dateStr.getDay()}/${dateStr.getMonth() + 1}/${dateStr.getFullYear()}`
    }
    let dateArr = (dateStr).split('/').reverse()
    if (dateArr.length !== 3) {
      return null
    }
    dateArr[1] -= 1
    return new Date(...dateArr)
  },
  scopeQualitySerialization () {
    return Number(this.realized) + '/' + Number(this.predicted)
  }
}
</script>
