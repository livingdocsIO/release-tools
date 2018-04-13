module.exports = function (dep) {
  const { exec, logBgYellow, logYellow } = dep
  return function (argv) {
    logBgYellow('Check if there are uncommited changes locally')
    const result = exec('git diff')
    if (!result.stdout) {
      logYellow('No uncommited Changes')
      return
    }
    throw new Error('You have uncommited changes. Abort job.')
  }
}
