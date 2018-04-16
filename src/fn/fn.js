import isFn from './isFn'
/**
 * fn executes the argument if it is a function or returns it if its a value
 * @param {mixed} f function to execute or value to return
 * @returns {any} returns a value or a function execution result value
 */
export default f => isFn(f) ? f.call(...(Object.keys(arguments).filter(k => k !== 0).map(k => arguments[k]))) : f
