#!/bin/bash

set -e

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - HELPERS
isAskingHelp () { [[ $SCRIPT_ARGS == --help ]]; }
hasNotEnoughArguments () { [[ "$SCRIPT_ARGS_LENGTH" -lt "5" ]]; }
isMissingDockerUsername () { [[ -z ${DOCKER_USERNAME+x} ]]; }
isMissingDockerPassword () { [[ -z ${DOCKER_PASSWORD+x} ]]; }
areDockerCredentialsMissing () {
  isMissingDockerUsername || isMissingDockerPassword
}
displayHelp () {
  echo "This script tags and pushes a local Docker image to the Docker Hub."
  echo "# Script's arguments"
  echo "Argument 1 (MUST)     : <DOCKER_SLUG> f.e. livingdocs/service-server"
  echo "Argument 2 (MUST)     : <DOCKER_LOCAL_IMAGE>"
  echo "Argument 3 (MUST)     : <GIT_BRANCH>"
  echo "Argument 4 (MUST)     : <PULL_REQUEST_NUMBER> is a number or false"
  echo "Argument 5 (MUST)     : <COMMIT_HASH>"
  echo "Argument 6 (OPTION)   : <TEST_MODE>"
  echo "# Script's environment variables"
  echo "Env var (MUST)        : <DOCKER_USERNAME>"
  echo "Env var (MUST)        : <DOCKER_PASSWORD>"
}

isReleaseBranch () { [[ $GIT_BRANCH =~ ^release- ]]; }
isMasterBranch () { [[ $GIT_BRANCH == master ]]; }
isPullRequest () { [[ $PULL_REQUEST_NUMBER != false ]]; }
isNotPullRequest () { ! isPullRequest; }

isFeatureBranch () { isMasterBranch && isPullRequest; }
isMergingOnMaster () { isMasterBranch && isNotPullRequest; }
isMergingOnRelease () { isReleaseBranch && isNotPullRequest; }

prepareTags () {
  HASH_TAG="hash-$COMMIT_HASH"
  FEATURE_TAG="tag-feature-$COMMIT_HASH"
  RELEASE_BRANCH_TAG="hash-$GIT_BRANCH"
}

hasDockerTags () { [ "x$DOCKER_TAGS" != "x" ]; }

dockerLogin () {
  echo "  Executing: docker login -u=**** -p=****"
  execute \
    "docker login -u=\"$DOCKER_USERNAME\" -p=\"$DOCKER_PASSWORD\""
}

dockerTag () {
  DOCKER_REMOTE_IMAGE=$1
  DOCKER_TAG_COMMAND="docker tag $DOCKER_LOCAL_IMAGE $DOCKER_REMOTE_IMAGE"
  echo "  Executing: $DOCKER_TAG_COMMAND"
  execute $DOCKER_TAG_COMMAND
}

dockerPush () {
  DOCKER_REMOTE_IMAGE=$1
  DOCKER_PUSH_COMMAND="docker push $DOCKER_REMOTE_IMAGE"
  echo "  Executing: $DOCKER_PUSH_COMMAND"
  execute $DOCKER_PUSH_COMMAND
}

isInTestMode () { [[ $TEST_MODE == true ]]; }
isNotInTestMode () { ! isInTestMode; }

execute () {
  if isNotInTestMode; then
    eval $*
  fi
}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ARGUMENTS
DOCKER_SLUG=$1
DOCKER_LOCAL_IMAGE=$2
GIT_BRANCH=$3
PULL_REQUEST_NUMBER=$4
COMMIT_HASH=$5
TEST_MODE=$6

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXECUTION
SCRIPT_ARGS=$@
SCRIPT_ARGS_LENGTH=$#
if isAskingHelp || hasNotEnoughArguments || areDockerCredentialsMissing; then
  displayHelp
  exit 1
fi

echo "release-tools: Tagging and pushing Docker images."

prepareTags

if isFeatureBranch; then
  echo "  Detecting a feature branch."
  echo "  Tagging two images: hash-tag and feature-tag."
  DOCKER_TAGS="$HASH_TAG $FEATURE_TAG"
fi

if isMergingOnMaster; then
  echo "  Detecting a merge to the master branch."
  echo "  Tagging one image: hash-tag."
  DOCKER_TAGS="$HASH_TAG"
fi

if isMergingOnRelease; then
  echo "  Detecting a merge to the release branch."
  echo "  Tagging two images: hash-tag and release-branch-tag."
  DOCKER_TAGS="$HASH_TAG $RELEASE_BRANCH_TAG"
fi

if hasDockerTags; then
  dockerLogin
  for DOCKER_TAG in $DOCKER_TAGS; do
    DOCKER_REMOTE_IMAGE=$DOCKER_SLUG:$DOCKER_TAG

    dockerTag $DOCKER_REMOTE_IMAGE
    dockerPush $DOCKER_REMOTE_IMAGE
  done
else
  echo "  No image to tag."
fi
