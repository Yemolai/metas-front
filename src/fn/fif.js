const fn = require('./fn')
/**
 * Functional if statement
 * @param {boolean} condition **boolean** operation condition
 * @param {any} then value to return or function to call when condition is **true**
 * @param {any} elseThen value to return or function to call when condition is **false**
 * @returns {any} (NULLABLE) returns execution or value of then or elseThen or null
 */
module.exports = (condition, then, elseThen) => condition ? fn(then) : 'elseThen' in arguments ? fn(elseThen) : null
