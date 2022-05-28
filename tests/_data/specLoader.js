const fs = require('node:fs')
const path = require('node:path')

const resPath = path.resolve(__dirname, '..', '..', 'res')

/**
 * @param {string} resourceFile
 * @return {*}
 */
function loadSpec (resourceFile) {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(resPath, resourceFile)
    )
  )
}

/**
 * @param {string} resourceFile
 * @param {string} path
 * @return {*}
 */
function getSpecElement (resourceFile, ...path) {
  let element = loadSpec(resourceFile)
  for (const segment of path) {
    element = element[segment]
  }
  return element
}

/**
 * @param {string} resourceFile
 * @param {string} path
 * @return {Array<number|string>}
 */
function getSpecEnum (resourceFile, ...path) {
  return getSpecElement(resourceFile, 'definitions', ...path, 'enum')
}

module.exports = {
  loadSpec: loadSpec,
  getSpecElement: getSpecElement,
  getSpecEnum: getSpecEnum
}
