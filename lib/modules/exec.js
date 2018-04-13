module.exports = function (dep) {
  const { shell, console, colors } = dep
  return function (command, dryRun = false) {
    console.log(colors.yellow(`  ${command}`))
    if (!dryRun) {
      const result = shell.exec(command)
      result.stdout = result.stdout.replace(/\n$/, '')
      result.stdout = result.stdout.replace(/\n$/, '')
      return result
    }
  }
}
