// semantic-release only runs on master by default.
// Set release.branch to <releaseBranchName> in package.json
// to enable semantic-release on your non-master branch.
// semantic-release publishes the new version as `latest` by default.
// As you're releasing an old version, set publishConfig.tag
// to prevent a release of the `latest` dist-tag.
module.exports = function (dep) {
  const { exec, logBgYellow, logYellow } = dep
  return function (argv) {
    let propertyName
    logBgYellow('Update package.json with semantic-release information')
    // const releaseTag = exec(`echo release-$(echo ${argv.baseTag} | cut -d '.' -f1 -f2).x`)
    // eslint-disable-next-line no-extra-boolean-cast
    const result = exec(`jq '.release.branches != null' package.json`)
    if (result.stdout === 'true') {
      exec(`cat package.json \
        | jq ".release.branches.[0].name=\\"${argv.releaseBranchName}\\" \
        | .release.branches.[0].channel=\\"${argv.releaseBranchName}\\" \
        | .publishConfig.tag=\\"${argv.releaseBranchName}\\"" \
        | cat > package.json.tmp && mv package.json.tmp package.json`
      )
      propertyName = 'release.branches'
    } else {
      exec(`cat package.json \
        | jq ".release.branch=\\"${argv.releaseBranchName}\\" \
        | .publishConfig.tag=\\"${argv.releaseBranchName}\\"" \
        | cat > package.json.tmp && mv package.json.tmp package.json`
      )
      propertyName = 'release.branch'
    }

    logYellow(`Updated ${propertyName} in package.json`)
  }
}
