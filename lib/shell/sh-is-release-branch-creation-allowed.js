module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    return new Promise(function (resolve, reject) {
      logBgYellow(`Check if ${argv.releaseBranchName} is valid based on ${argv.baseTag}`)

      const validateRelease = require('../../js/validate_release')
      validateRelease.listGitTags(function (err, versions) {
        if (err) return reject(err)
        const isPatchAllowed = validateRelease.patch(argv.baseTag, versions)
        if (!isPatchAllowed) {
          const msg = `
            It's not allowed to create a patch version based on ${argv.baseTag}
            Please first execute 'npx @daraff/create-bump-pr' to bump the version on master
          `
          return reject(new Error(msg))
        }
        resolve()
      })
    })
  }
}
