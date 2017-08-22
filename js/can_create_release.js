const validateRelease = require('./validate_release')
const versions = validateRelease.listGitTags(function(err, versions) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const isPatchAllowed = validateRelease.patch(process.argv[2], versions)
  if (!isPatchAllowed) {
    process.exit(1)
  }
})
