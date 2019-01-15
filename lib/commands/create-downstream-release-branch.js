const Octokit = require('./create-downstream-release-branch/octokit')
const slackMessenger = require('slack-messenger')
const pullrequestTemplate = require('./create-downstream-release-branch/pullrequest.template')

module.exports = function (dep) {
  const { logBgMagenta } = dep
  const cmd = {}
  cmd.command = 'create-downstream-release-branch'
  cmd.desc = 'Create a downstream release branch'
  cmd.builder = {
    'owner': {
      alias: 'o',
      describe: "github repository owner e.g. 'livingdocsIO'",
      demandOption: true
    },
    'repo': {
      alias: 'r',
      describe: "github repository name e.g. 'livingdocs-editor'",
      demandOption: true
    },
    'gh-token': {
      alias: 't',
      describe: 'github token with write access',
      demandOption: true
    },
    'base-branch': {
      describe: "base branch name where the release branch will be branched from e.g. 'upstream-release-2018-09'",
      demandOption: true
    },
    'target-branch': {
      describe: "this branch will be created e.g. 'upstream-release-2018-11'",
      demandOption: true
    },
    'target-release-name': {
      describe: "release name e.g. 'November 2018'",
      demandOption: true
    },
    'upstream-repo-name': {
      describe: "upstream repository name e.g. 'livingdocs-editor' or 'livingdocs-server'",
      demandOption: true
    },
    'slack-webhook-url': {
      describe: "a webhook url e.g. 'https://hooks.slack.com/services/777/888/999' to inform a channel of the successful downstream branch creation",
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

  cmd.handler = async function (argv) {
    const o = new Octokit(argv.ghToken)
    logBgMagenta(`Setup downstream release branch ${argv.targetBranch}`)

    // get readme of base branch
    const readmeBase64 = await o.getReadme({
      owner: argv.owner,
      repo: argv.repo,
      ref: argv.baseBranch
    })

    // add an empty line to the readme to have a code diff for the upcoming pull request
    const readme = Buffer.from(readmeBase64.data.content, 'base64').toString('ascii')
    const newLineReadme = `\n ${readme}`
    const newLineReadmeEncoded = Buffer.from(newLineReadme).toString('base64')

    // get latest commit of base branch
    const latestBaseBranchCommit = await o.getCommitByRef({
      owner: argv.owner,
      repo: argv.repo,
      ref: `refs/heads/${argv.baseBranch}`
    })

    // create new release-branch
    await o.createBranch({
      owner: argv.owner,
      repo: argv.repo,
      ref: `refs/heads/${argv.targetBranch}`,
      sha: latestBaseBranchCommit.data.sha
    })

    // add a new commit to the release-branch
    await o.updateReadme({
      owner: argv.owner,
      repo: argv.repo,
      path: readmeBase64.data.path,
      message: `chore(release-management): add change to initialise ${argv.targetBranch} branch`,
      content: newLineReadmeEncoded,
      sha: readmeBase64.data.sha,
      branch: argv.targetBranch
    })

    // create the integration branch pull request
    const pullRequest = await o.createPullRequest({
      owner: argv.owner,
      repo: argv.repo,
      title: `Livingdocs Release ${argv.targetReleaseName}`,
      head: argv.targetBranch,
      base: argv.baseBranch,
      body: pullrequestTemplate(argv.upstreamRepoName)
    })

    console.log(`created new downstream integration pull request at ${pullRequest.data.html_url}`)

    if (argv.slackWebhookUrl) {
      await slackMessenger({
        webhookUrl: argv.slackWebhookUrl,
        message: `'${argv.targetBranch}' (https://github.com/${argv.owner}/${argv.repo}/tree/${argv.targetBranch}) has been created sucessfully. A PR has been created at ${pullRequest.data.html_url}.`
      })
    }

    return pullRequest
  }

  return cmd
}
