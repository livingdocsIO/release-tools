module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    logBgYellow('Initialize the most recent master branch')
    exec('git fetch --all', argv.dryRun)
    // TODO switch back to master branch
    exec('git checkout refactoring-to-node-release-tools', argv.dryRun)
    exec('git reset --hard HEAD', argv.dryRun)
    exec('git pull --rebase origin refactoring-to-node-release-tools', argv.dryRun)
    exec('git reset --hard origin/refactoring-to-node-release-tools', argv.dryRun)
  }
}
