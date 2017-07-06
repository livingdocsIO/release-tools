const fs = require('fs')
const path = require('path')
const packageJson = require(path.resolve('./package.json'))
const releaseName = process.argv[2]

if (releaseName) {
  packageJson.release = releaseName
  fs.writeFileSync(
    './package.json',
    JSON.stringify(packageJson, null, 2),
    'utf8'
  )
} else {
  throw new Error('A release version is required.')
}
