module.exports = function (dep) {
  const { console, colors } = dep
  return function (message) {
    console.log(colors.yellow(`✔ ${message}`))
  }
}
