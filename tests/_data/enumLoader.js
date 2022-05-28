const fs = require('node:fs')
const path = require('node:path')

const resPath = path.resolve(__dirname, '..', '..', 'res')

/**
 * @param {string} resourceFile
 * @param {string} definitionName
 * @return {*}
 */
module.exports = (resourceFile, definitionName) => JSON.parse(
  fs.readFileSync(
    path.resolve(resPath, resourceFile)
  )
).definitions[definitionName].enum
