const camelCase = require('camelcase')
const requireDir = require('require-dir')
const colors = require('chalk')
const shell = require('shelljs')
shell.set('-e')
const { join, resolve } = require('path')
const pkg = require(join(__dirname, '../package.json'))

// External dependencies to pass to the commands
let dep = {
  join,
  resolve,
  console,
  colors,
  shell,
  process,
  releaseConfig: pkg.release
}

// Internal dependencies (modules)
const inDepFns = requireDir(join(__dirname, '..', 'lib', 'modules'))
Object.keys(inDepFns).forEach(name => {
  dep[camelCase(name)] = inDepFns[name](dep)
})

// Internal dependencies (shell)
const shellFns = requireDir(join(__dirname, '..', 'lib', 'shell'))
Object.keys(shellFns).forEach(name => {
  dep[camelCase(name)] = shellFns[name](dep)
})

// Load commands from folder and pass dependencies
const commandsFn = requireDir(join(__dirname, '..', 'lib', 'commands'))
const commands = Object.keys(commandsFn).map((i) => commandsFn[i](dep))

module.exports = commands
