module.exports = (value, fallbackValue = 0) => isNaN(value || fallbackValue) ? value : fallbackValue
