module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    return new Promise(function (resolve, reject) {
      logBgYellow(`Create branch ${argv.releaseBranchName} based on ${argv.baseTag}`)

      const validateRelease = require('../../js/validate_release')
      validateRelease.listGitTags(function (err, versions) {
        if (err) return reject(err)
        const isPatchAllowed = validateRelease.patch(argv.baseTag, versions)
        if (!isPatchAllowed) {
          const msg = `It's not allowed to create a patch version based on ${argv.baseTag}`
          return reject(new Error(msg))
        }
        exec(`git checkout ${argv.baseTag}`, argv.dryRun)
        exec(`git checkout -b ${argv.releaseBranchName}`, argv.dryRun)
        resolve()
      })
    })
  }
}
