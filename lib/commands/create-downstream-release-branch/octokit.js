const octokit = require('@octokit/rest')()

module.exports = class Octokit {
  constructor (token) {
    if (token) {
      octokit.authenticate({
        type: 'oauth',
        token: token
      })
    }
  }

  // ref: name of the new branch
  //   e.g. 'refs/heads/my-new-branch'
  // sha: sha of the base commit
  async createBranch ({owner, repo, ref, sha}) {
    return octokit.gitdata.createRef({
      owner,
      repo,
      ref,
      sha
    })
  }

  async createPullRequest ({owner, repo, title, head, base, body}) {
    return octokit.pullRequests.create({
      owner: owner,
      repo: repo,
      title: title,
      head: head,
      base: base,
      body: body,
      maintainer_can_modify: true
    })
  }

  // @param {String} ref The name of the commit/branch/tag
  // https://octokit.github.io/rest.js/#api-Repos-getReadme
  async getReadme ({owner, repo, ref}) {
    return octokit.repos.getReadme({
      owner,
      repo,
      ref
    })
  }

  async updateReadme ({owner, repo, path, message, content, sha, branch}) {
    return octokit.repos.updateFile({
      owner,
      repo,
      path,
      message,
      content,
      sha,
      branch
    })
  }

  // @param {String} ref The name of the commit/branch/tag
  async getCommitByRef ({owner, repo, ref}) {
    return octokit.repos.getCommitRefSha({
      owner,
      repo,
      ref
    })
  }
}
