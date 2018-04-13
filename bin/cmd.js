#!/usr/bin/env node
const yargs = require('yargs')
const commands = require('./cmd_init')

// Init CLI commands and options
commands.forEach(cmd => yargs.command(cmd.command, cmd.desc, cmd.builder, cmd.handler))
yargs
  .help()
  .demand(1)
  .argv
