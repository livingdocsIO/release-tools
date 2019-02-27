module.exports = function (dep) {
  const { logBgMagenta, logRed, logYellow } = dep
  const cmd = {}
  cmd.command = 'create-release-branch'
  cmd.desc = 'Create a release branch'
  cmd.builder = {
    'base-tag': {
      alias: 't',
      describe: "Base tag where the release branch will be branched from e.g. '--base-tag v55.0.0'",
      demandOption: true
    },
    'release-branch-name': {
      alias: 'b',
      describe: "Name of the release branch e.g. 'release-2017-10'",
      demandOption: true
    },
    'npm-token': {
      alias: 'n',
      describe: "NPM token with write access e.g. '11111111-2222-3333-4444-555555555555'",
      demandOption: getNpmTokenSetting(dep)
    },
    'dry-run': {
      alias: 'd',
      describe: "No execution of the script (just logs) '--dry-run true' (default: false)",
      demandOption: false,
      default: false,
      boolean: true
    }
  }

  cmd.handler = function (argv) {
    // test command npx release-tools create-release-branch -t 1.2.0 -b blubb -n 1111 -d true
    // git add . && git fix-last-commit && git pushf

    logBgMagenta(`Setup the maintenance branch ${argv.baseTag}`)
    return new Promise((resolve, reject) => {
      return resolve()
    })
      .then(() => { return dep.shIsReleaseBranchCreationAllowed(argv) })
      .then(() => { return dep.gitHasMaintenanceBranch(argv) })
      .then(() => { return dep.gitHasUncommitedChanges(argv) })
      .then(() => { return dep.gitPullMaster(argv) })
      .then(() => { return dep.gitCreateMaintenanceBranch(argv) })
      .then(() => { return dep.shUpdatePackage(argv) })
      .then(() => { return dep.shNpmPublish(argv) })
      .then(() => { return dep.gitCommitPushReleaseBranch(argv) })
      .then((value) => {
        console.log('this is the end!')
      })
      .catch((err) => {
        logRed(err.message)
        logYellow('Hint: Have you used the correct npm token?')
      })
  }
  return cmd
}

const getNpmTokenSetting = function (dep) {
  if (dep.releaseConfig && dep.releaseConfig.npmPublish === false) {
    return false
  }
  return true
}
