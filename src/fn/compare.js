/**
 * Object Properties Compare with number-only return
 * @argument {object} X first object to compare
 * @argument {object} Y second object to compare
 * @argument {string} k key to compare first and second object props
 * @returns {number} default comparison result (-1, 0, 1)
 */
module.exports = (x, y, k) => x[k] < y[k] ? -1 : (x[k] > y[k] ? 1 : 0)
