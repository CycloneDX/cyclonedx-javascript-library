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
 * @param {string} definitionName
 * @return {Array<number|string>}
 */
function getSpecEnum (resourceFile, ...definitionName) {
  let r = loadSpec(resourceFile).definitions
  for (const d of definitionName) {
    r = r[d]
  }
  return r.enum
}

module.exports = {
  loadSpec: loadSpec,
  getSpecEnum: getSpecEnum
}
