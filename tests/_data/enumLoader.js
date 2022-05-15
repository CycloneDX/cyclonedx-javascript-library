const fs = require('fs')
const path = require('path')

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
