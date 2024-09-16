module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    const branchCheck = exec('git show-ref --verify --quiet refs/heads/main; if [ $? -eq 0 ]; then echo main; else echo master; fi', argv.dryRun)
    const branch = branchCheck.stdout.trim()
    logBgYellow('Initialize the most recent master branch')
    exec('git fetch --all', argv.dryRun)
    exec('git fetch --tags', argv.dryRun)
    exec(`git checkout ${branch}`, argv.dryRun)
    exec('git reset --hard HEAD', argv.dryRun)
    exec(`git pull --rebase origin ${branch}`, argv.dryRun)
    exec(`git reset --hard origin/${branch}`, argv.dryRun)
  }
}
