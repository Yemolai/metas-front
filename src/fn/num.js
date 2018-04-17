export default v => {
  let numero = v.toFixed(2).split('.')
  numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.')
  return numero.join(',')
}
