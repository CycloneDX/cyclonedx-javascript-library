module.exports = {

  /**
   * Capitalise the first letter of a string
   * @param {string} s
   * @return {string}
   */
  capitaliseFirstLetter: s => s.charAt(0).toUpperCase() + s.slice(1),
  /**
   * UpperCamelCase a string
   * @param {string} s
   * @return {string}
   */
  upperCamelCase: s => s.replaceAll(
    /\b\w/g,
    f => f.slice(-1).toUpperCase()
  ).replaceAll(/\W/g, '')
}
