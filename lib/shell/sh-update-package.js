// semantic-release only runs on master by default.
// Set release.branch to <releaseBranchName> in package.json
// to enable semantic-release on your non-master branch.
// semantic-release publishes the new version as `latest` by default.
// As you're releasing an old version, set publishConfig.tag
// to prevent a release of the `latest` dist-tag.
module.exports = function (dep) {
  const { exec, logBgYellow, logYellow } = dep
  return function (argv) {
    logBgYellow('Update package.json with semantic-release information')
    // const releaseTag = exec(`echo release-$(echo ${argv.baseTag} | cut -d '.' -f1 -f2).x`)
    exec(`cat package.json \
      | jq ".release.branch=\\"${argv.releaseBranchName}\\" \
      | .publishConfig.tag=\\"${argv.releaseBranchName}\\"" \
      | cat > package.json.tmp && mv package.json.tmp package.json`
    )
    logYellow('package.json updated')
  }
}
