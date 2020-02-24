module.exports = function (dep) {
  const { exec, logBgYellow, logYellow } = dep
  return function (argv) {
    logBgYellow(`Check if the branch ${argv.releaseBranchName} already exists`)
    try {
      // match
      //   "* release-2020-02"
      //   "  release-2020-02"
      //   "  remotes/origin/release-2020-02"
      // not match
      //   "upstream-release-2020-02"
      //   "remotes/origin/upstream-release-2020-02"
      exec(`git branch -a | egrep -i "(\*\s|\s\s|/)+${argv.releaseBranchName}$"`) // eslint-disable-line
    } catch (e) {
      logYellow(`The branch '${argv.releaseBranchName}' does not exist`)
      return
    }
    throw new Error(`A branch named '${argv.releaseBranchName}' already exists locally or remotely.`)
  }
}
