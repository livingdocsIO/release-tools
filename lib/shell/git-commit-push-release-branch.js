module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    logBgYellow(`Commit and push changes at ${argv.releaseBranchName} to github`)
    exec('git add package.json', argv.dryRun)
    exec(`git commit -m "chore: Setup up maintenance branch ${argv.releaseBranchName}"`, argv.dryRun)
    exec(`git push origin ${argv.releaseBranchName}`, argv.dryRun)
  }
}
