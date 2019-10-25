const slackMessenger = require('slack-messenger')

module.exports = function (dep) {
  const { logBgMagenta, logRed, logYellow } = dep
  const cmd = {}
  cmd.command = 'create-release-branch'
  cmd.desc = 'Create a release branch'
  cmd.builder = {
    'repo': {
      alias: 'r',
      describe: "github repository name e.g. 'livingdocs-editor'",
      demandOption: true
    },
    'base-tag': {
      alias: 't',
      describe: "Base tag where the release branch will be branched from e.g. '--base-tag v55.0.0'",
      demandOption: true
    },
    'release-branch-name': {
      alias: 'b',
      describe: "Name of the release branch e.g. 'release-2017-10'",
      demandOption: true
    },
    'npm-token': {
      alias: 'n',
      describe: "NPM token with write access e.g. '11111111-2222-3333-4444-555555555555'. If you don't want to publish to npm, you have to set \"release.npmPublish: false\" in package.json",
      demandOption: getNpmTokenSetting(dep)
    },
    'slack-webhook-url': {
      describe: "a webhook url e.g. 'https://hooks.slack.com/services/777/888/999' to inform a channel of the successful branch creation",
      demandOption: false
    },
    'dry-run': {
      alias: 'd',
      describe: "No execution of the script (just logs) '--dry-run true' (default: false)",
      demandOption: false,
      default: false,
      boolean: true
    }
  }

  cmd.handler = function (argv) {
    // test command npx release-tools create-release-branch -t 1.2.0 -b blubb -n 1111 -d true
    // git add . && git fix-last-commit && git pushf

    logBgMagenta(`Setup the maintenance branch ${argv.baseTag}`)
    return new Promise((resolve, reject) => {
      return resolve()
    })
      .then(() => { return dep.shIsReleaseBranchCreationAllowed(argv) })
      .then(() => { return dep.gitHasMaintenanceBranch(argv) })
      .then(() => { return dep.gitHasUncommitedChanges(argv) })
      .then(() => { return dep.gitPullMaster(argv) })
      .then(() => { return dep.gitCreateMaintenanceBranch(argv) })
      .then(() => { return dep.shUpdatePackage(argv) })
      .then(() => { return dep.shNpmPublish(argv) })
      .then(() => { return dep.gitCommitPushReleaseBranch(argv) })
      .then((value) => {
        if (argv.slackWebhookUrl) {
          slackMessenger({
            webhookUrl: argv.slackWebhookUrl,
            message: `\`${argv.repo}\`: The upstream release branch \`${argv.releaseBranchName}\` has been created sucessfully`
          })
        }

        console.log('Job done!')
      })
      .catch((err) => {
        logRed(err.message)
        logYellow('Hint: Have you used the correct npm token?')
      })
  }
  return cmd
}

const getNpmTokenSetting = function (dep) {
  if (dep.releaseConfig && dep.releaseConfig.npmPublish === false) {
    return false
  }
  return true
}
