const {readFileSync, writeFileSync} = require('fs')
const gifken = require('gifken')

gifken
  .reverse(readFileSync('./200w.gif'))
  .then(result => {
    writeFileSync('reverse.gif', result)
  })

  