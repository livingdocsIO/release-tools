#!/bin/bash

set -e

releaseVersion=$1
masterTag=$2
hasTag=$(git tag -l "$masterTag" | wc -l | tr -d '[:space:]')

# Helper function to display text in yellow.
function log () {
  echo -e "\033[33m"
  echo "$1"
  echo -e "\033[0m"
}


# Help messages
if [ "x$1" = "x" ] || [ "x$2" = "x" ]; then
  log "This script will create a branch based on master or a specific tag."
  log "Argument 1 (MUST)     : <release-version> to create f.e. 10.0.0"
  log "Argument 2 (MUST)     : <create branch based on> [master|tag] -> tag is f.e. v2.4.0"
  exit 1
fi


# Does the package.json exist?
if ! [ -f "./package.json" ]; then
    log 'ERR: You must run the script from the project root.'
    exit 1
fi


# Does the tag exist?
if [[ "$masterTag" != "master" ]] && [[ "$hasTag" != "1" ]]; then
    log "ERR: The tag $tag does not exist."
    exit 1
fi


# Does the branch to create already exist?
if [ $(git branch -a | grep "release-$releaseVersion") ]; then
   log "ERR: Branch release-$releaseVersion already exists."
   exit 1
fi


# Are there uncommited changes?
hasUncommitedChanges=$(git diff)
if [[ $hasUncommitedChanges ]]; then
    log "ERR: You have uncommited changes"
    exit 1
fi


log "Initialize the most recent master branch"
git fetch --all
git checkout master
git reset --hard HEAD
git pull --rebase origin master
git reset --hard origin/master


log "Create new release version $releaseVersion based on $masterTag"
if [[ "$masterTag" != "master" ]]; then
    git checkout "$masterTag"
fi
git checkout -b "release-$releaseVersion" "$masterTag"
scriptsDirectory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
node $scriptsDirectory/add-release-to-package-json.js $releaseVersion


log "Update and push package.json to the release branch release-$releaseVersion"
if [ -f "./package.json" ]; then git add package.json; fi
git diff --quiet --exit-code --cached || git commit -am "Updated version to $releaseVersion"
git push origin "release-$releaseVersion"


log "Delete the local release branch release-$releaseVersion"
git checkout master
git branch -D "release-$releaseVersion"

log "create-release-branch.sh has been executed successfully"