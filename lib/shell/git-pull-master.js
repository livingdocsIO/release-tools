module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    logBgYellow('Initialize the most recent master branch')
    exec('git fetch --all', argv.dryRun)
    exec('git checkout master', argv.dryRun)
    exec('git reset --hard HEAD', argv.dryRun)
    exec('git pull --rebase origin master', argv.dryRun)
    exec('git reset --hard origin/master', argv.dryRun)
  }
}
