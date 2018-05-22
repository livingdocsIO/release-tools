module.exports = function (dep) {
  const { exec, logBgYellow, logYellow } = dep
  return function (argv) {
    logBgYellow(`Check if the branch ${argv.releaseBranchName} already exists`)
    try {
      exec(`git branch -a | grep -w "${argv.releaseBranchName}"`)
    } catch (e) {
      logYellow(`The branch '${argv.releaseBranchName}' does not exist`)
      return
    }
    throw new Error(`A branch named '${argv.releaseBranchName}' already exists locally or remotely.`)
  }
}
