// You need to pass an NPM token with write access, or you'll get a 404.
// e.g. npm dist-tag add @livingdocs/editor@v7.3.4 maintenance-v7.3.4
module.exports = function (dep) {
  const { exec, logBgYellow, logYellow } = dep
  return function (argv) {
    logBgYellow('Publish dist-tag to npm')
    // const releaseTag = exec(`echo release-$(echo ${argv.baseTag} | cut -d '.' -f1 -f2).x`)
    const npmPackageName = exec(`echo $(node -e 'console.log(require("./package.json").name)')`).stdout
    const isNpmPublishSet = exec(`echo $(cat package.json | jq '.release.npmPublish')`).stdout
    if (isNpmPublishSet !== 'false') {
      logYellow(`Add tag ${argv.releaseBranchName} to npm package version ${npmPackageName}@${argv.baseTag}`)
      exec(`npm dist-tag add ${npmPackageName}@${argv.baseTag} ${argv.releaseBranchName} --//registry.npmjs.org/:_authToken=${argv.npmToken}`, argv.dryRun)
      logYellow('dist-tag to npm published')
      return
    }

    logYellow('npmPublish is disabled in package.json. Skip this step.')
  }
}
