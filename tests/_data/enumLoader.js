const fs = require('fs')
const path = require('path')

const resPath = path.resolve(__dirname, '../../res/')

module.exports = (resourceFile, definitionName) => JSON.parse(
  fs.readFileSync(
    path.resolve(resPath, resourceFile)
  )
).definitions[definitionName].enum
