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
          const nextMinor = validateRelease.nextMinor(argv.baseTag, versions)
          const msg = `It's not allowed to create a patch version based on ${argv.baseTag}`
          logBgYellow(msg)
          logBgYellow(`Instead, create a PR with this new version: ${nextMinor}`)
          logBgYellow(`After you have merged the PR, you can try it again.`)
          return reject(new Error(msg))
        }
        exec(`git checkout ${argv.baseTag}`, argv.dryRun)
        exec(`git checkout -b ${argv.releaseBranchName}`, argv.dryRun)
        resolve()
      })
    })
  }
}
