#!/bin/bash

set -e

releaseVersion=$1


# Helper function to display text in yellow.
function log () {
  echo -e "\033[33m"
  echo "$1"
  echo -e "\033[0m"
}


# Help messages
if [ "x$1" = "x" ]; then
  log "This script will create a new tag to finalize a release branch."
  log "Argument 1 (MUST)     : <release-version> to create f.e. 10.0.0"
  exit 1
fi


# Does the package.json exist?
if ! [ -f "./package.json" ]; then
  log 'ERR: You must run the script from the project root.'
  exit 1
fi


# Are there uncommited changes?
hasUncommitedChanges=$(git diff)
if [[ $hasUncommitedChanges ]]; then
  log "ERR: You have uncommited changes."
  exit 1
fi

# Is there a local release branch with the same name?
localBranchExists=$(git branch -l | { grep "release-$releaseVersion\$" || true; })
if [ "x$localBranchExists" != "x" ]; then
  log "ERR: There is a local branch with the name release-$releaseVersion,
    please delete this branch before executing the script"
  exit 1
fi

# Stop if there is no remote release branch
remoteBranchExists=$(git branch -r | { grep "release-$releaseVersion\$" || true; })
if [ "x$remoteBranchExists" = "x" ]; then
  log "ERR: There is no remote branch release-$releaseVersion.
    Please execute the create-release-branch.sh first"
  exit 1
fi


log "checkout release branch release-$releaseVersion"
git fetch --all
git checkout "release-$releaseVersion"


log "Update release version in package.json"
scriptsDirectory=$(dirname $(readlink -f $0))
node $scriptsDirectory/add-release-to-package-json.js $releaseVersion
git add package.json
git diff --quiet --exit-code --cached || git commit -am "Updated version to $releaseVersion"


log "Create tag $releaseVersion"
git tag -am "Release $releaseVersion" "$releaseVersion"


log "Push release and tag to release-$releaseVersion"
git push --tags origin "release-$releaseVersion"


log "finish-release.sh has been executed successfully"
