module.exports = function (dep) {
  const { exec, logBgYellow } = dep
  return function (argv) {
    return new Promise(function (resolve, reject) {
      logBgYellow(`Check if ${argv.releaseBranchName} is valid based on ${argv.baseTag}`)

      const validateRelease = require('../../js/validate_release')
      validateRelease.listGitTags(function (err, versions) {
        if (err) return reject(err)
        const isPatchAllowed = validateRelease.patch(argv.baseTag, versions)
        if (!isPatchAllowed) {
          const msg = `
            It's not allowed to create a patch version based on ${argv.baseTag}
            Please first execute 'npx @livingdocsIO/create-bump-pr@latest' to bump the tag version on master

            ----------------------------------------------
            Workflow for a Bump PR / Create Release Branch
            ----------------------------------------------
            1) Execute npx @livingdocsIO/create-bump-pr (see example and option description)
              - the script automatically updates the README.md with an empty line to indicate a change
              - the script create a PR to incite a new minor version
            2) Go to github and merge the PR
            3) Wait until the merged PR on master created a new minor github tag
            4) Go to your repo again
            5) Execute git pull --tags
            6) Execute npx @livingdocs/release-tools@latest create-release-branch again

            -------
            Example
            -------
            npx @livingdocsIO/create-bump-pr \
              --token=<your-gh-token> \
              --owner=<gh-owner> \
              --repo=<gh-repo>

            -------
            Options
            -------
            ****token****
            You need a personal github access token to create a bump PR.
            Go to https://github.com/settings/tokens/new to create a token with 'repo' scope

            ****owner****
            The owner of the repository (e.g. livingdocsIO)

            ****repo****
            The repository name (e.g. livingdocs-server)
          `
          return reject(new Error(msg))
        }
        resolve()
      })
    })
  }
}
