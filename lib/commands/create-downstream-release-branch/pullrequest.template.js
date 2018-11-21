module.exports = (repo) => {
  return `
Relations:
* ${repo}: TODO

Upstream Versions:
- Server: \`vX.Y.Z\`
- Editor: \`vX.Y.Z\`

# Integrated Upstream Breaking Changes

[0.0.0](https://github.com/livingdocsIO/${repo}/releases/tag/v0.0.0) - some description
`
}
