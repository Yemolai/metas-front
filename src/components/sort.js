import toNumber from '../fn/toNumber'
import xcc from '../fn/xcc'
import compare from '../fn/compare'

const p100 = (obj, prop1, prop2) => toNumber(obj[prop1]) / toNumber(obj[prop2], 1)
/**
 * Compare same property of two objects to sort
 * @param {object} a first object to compare
 * @param {object} b second object to compare
 * @param {string} key property name
 * @returns {number} sort order integer in [-1, 1]
 */
export default (a, b, key) => {
  if (key === 'escopo' || key === 'custo') {
    let keyPrev = key + '_previsto'
    let keyReal = key + '_realizado'
    return xcc(a, b, keyPrev,
      () => xcc(a, b, keyReal,
        () => {
          let p = compare(
            {p: p100(a, keyReal, keyPrev)}, {p: p100(b, keyReal, keyPrev)}, 'p')
          if (p === 0) {
            let r = compare(a, b, keyReal)
            return (r === 0) ? compare(a, b, keyPrev) : r
          }
          return p
        },
        () => compare(a, b, keyPrev)
      ),
      () => 0
    )
  } else if (key === 'prazo') {
    return xcc(a, b, 'inicio_previsto',
      () => xcc(a, b, 'fim_previsto',
        () => xcc(a, b, 'inicio_realizado',
          () => xcc(a, b, 'fim_realizado',
            () => compare(a, b, 'fim_realizado'),
            () => compare(a, b, 'inicio_realizado')
          ),
          () => compare(a, b, 'fim_previsto')
        ),
        () => compare(a, b, 'inicio_realizado')
      ),
      () => 0
    )
  } else {
    return null
  }
}
