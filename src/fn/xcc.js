/**
 * Xor Conditional Compare
 * with function fallback
 * @argument {object} obj1 first object to compare
 * @argument {object} obj2 second object to compare
 * @argument {string} property key to compare first and second object props
 * @argument {function} bothTrue function to execute if both props are true
 * @argument {function} bothFalse function to execute if both props are false
 * @returns {mixed} number (1 or -1) or function return value
 */
export default (obj1, obj2, property, bothTrue, bothFalse) =>
  !(property in obj1) && property in obj2
    ? -1
    : (
      property in obj1 && !(property in obj2)
        ? 1
        : (
          property in obj1 && property in obj2
            ? typeof bothTrue === 'function' ? bothTrue.call() : bothTrue
            : typeof bothFalse === 'function' ? bothFalse.call() : bothFalse
        )
    )
