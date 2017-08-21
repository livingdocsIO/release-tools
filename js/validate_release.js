const semver = require("semver")
const exec = require('child_process').exec

// console.log(process.argv)

module.exports = {
  listGitTags,
  patch
}

function patch (currentVersion, versions) {
  const expectedPatchVersion = semver.maxSatisfying(versions, `${semver.major(currentVersion)}.${semver.minor(currentVersion)}.*`)
  const nextMinorVersion = semver.inc(currentVersion, 'minor')
  const nextMajorVersion = semver.inc(currentVersion, 'major')

  if (currentVersion !== expectedPatchVersion) {
    console.error(`version ${currentVersion} is not the latest available patch version on git.`)
    return false
  }

  if (!versions.includes(nextMinorVersion) && !versions.includes(nextMajorVersion)) {
    console.error(`version ${currentVersion} must have a minor or major successor version on git.`)
    return false
  }
  return true
}

function listGitTags (callback) {
  exec('git tag -l', function (err, stdout, stderr) {
    if (err) {
      return callback(err)
    }
    const versions = stdout
      .split('\n')
      .filter(function (value) {
        if (semver.valid(value) === null) {
          return false
        }
        return true
      })
      .map(semver.clean)

    return callback(null, versions)
  })
}
