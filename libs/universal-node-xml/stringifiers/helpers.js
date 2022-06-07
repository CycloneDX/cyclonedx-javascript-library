
module.exports.getNS = function (element) {
  const ns = (element.namespace ?? element.attributes?.xmlns)?.toString() ?? ''
  return ns.length > 0
    ? ns
    : null
}

module.exports.makeIndent = function (space) {
  if (typeof space === 'number') {
    return ' '.repeat(Math.max(0, space))
  }
  if (typeof space === 'string') {
    return space
  }
  return ''
}
