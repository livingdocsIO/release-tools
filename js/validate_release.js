const semver = require("semver")
const exec = require('child_process').exec

module.exports = {
  listGitTags,
  patch
}

function patch (currentVersion, versions) {
  if (semver.valid(currentVersion) === null) {
    console.error(`The version '${currentVersion}' is not a valid semver string`)
    return false
  }

  const sanitizedCurrentVersion = semver.clean(currentVersion)
  const expectedPatchVersion = semver.maxSatisfying(versions, `${semver.major(sanitizedCurrentVersion)}.${semver.minor(sanitizedCurrentVersion)}.*`)
  const nextMinorVersion = semver.inc(sanitizedCurrentVersion, 'minor')
  const nextMajorVersion = semver.inc(sanitizedCurrentVersion, 'major')

  if (sanitizedCurrentVersion !== expectedPatchVersion) {
    console.error(`It's not allowed to create a maintenance branch based on ${sanitizedCurrentVersion}`)
    if (expectedPatchVersion != null) {
      console.error(`${expectedPatchVersion} would be allowed, because it's the latest patch`)
    }
    return false
  }

  if (!versions.includes(nextMinorVersion) && !versions.includes(nextMajorVersion)) {
    console.error(`It's not allowed to create a maintenance branch when there is no minor or major successor version`)
    console.error(`${sanitizedCurrentVersion} is allowed as soon as ${nextMinorVersion} or ${nextMajorVersion} exist`)
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
