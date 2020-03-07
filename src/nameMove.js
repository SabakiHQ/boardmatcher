const findPatternInMove = require('./findPatternInMove')

module.exports = function(...args) {
  let result = findPatternInMove(...args)

  return result == null ? null : result.pattern.name
}
