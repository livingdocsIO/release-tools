module.exports = function (dep) {
  const { shell, console, colors } = dep
  return function (command, dryRun = false) {
    const cmd = command.replace(/(?:\\[rn]|[\r\n]+)+/g, '')
    console.log(colors.yellow(`  ${cmd}`))
    if (!dryRun) {
      const result = shell.exec(cmd)
      result.stdout = result.stdout.replace(/(?:\\[rn]|[\r\n]+)+/g, '')
      return result
    }
  }
}
