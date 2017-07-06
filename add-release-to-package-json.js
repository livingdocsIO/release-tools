const fs = require('fs')
const packageJson = require('./package.json')
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
