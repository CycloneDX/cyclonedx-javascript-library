'use strict';

const possibileStringifiers = {
  // prioritized list of possible implementations
  xmlbuilder2: 'xmlbuilder2'
}

const stringifiers = {}
let stringifier
for ( const [name, file] of Object.entries(possibileStringifiers) ) {
  try {
    stringifier = require(`./lib/stringifiers/${file}`)
    if ( typeof stringifier === 'function' )
    {
      stringifiers[name] = stringifier
    }
  } catch {
    /* pass */
  }
}

module.exports.stringifiers = Object.freeze(stringifiers)
module.exports.stringify = Object.values(module.exports.stringifiers)[0]



