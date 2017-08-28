#!/bin/bash
currentDir=$(node -e "console.log(require('path').dirname(require('fs').realpathSync('$BASH_SOURCE')))")
source $currentDir/../../bin/helper

isLastCommandSuccessful () { [[ $1 == 0 ]]; }
assertTest () {
  if isLastCommandSuccessful $1; then
    greenLog "  Success"
  else
    redLog "  Fail"
  fi
}

yellowLog "Testing for --help argument"
./bin/tag-publish-docker-image \
  --help 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/help
assertTest $?

yellowLog "Test tagging for a feature branch"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH=myfeat \
BRANCH_NAME=master \
COMMIT_SHA=fea0a2f \
COMMIT_TAG= \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/feature-branch
assertTest $?

yellowLog "Test tagging for a master branch"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH= \
BRANCH_NAME=master \
COMMIT_SHA=ma0a2fd \
COMMIT_TAG= \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/master-branch
assertTest $?

yellowLog "Test tagging for a release branch"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH= \
BRANCH_NAME=release-7 \
COMMIT_SHA=rea0a2f \
COMMIT_TAG= \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/release-branch
assertTest $?

yellowLog "Test tagging for a tag"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH= \
BRANCH_NAME= \
COMMIT_SHA=rea0a2f \
COMMIT_TAG=v4.2.0 \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/tag
assertTest $?

yellowLog "Test tagging for a release branch with an open pull request"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH=myfeat \
BRANCH_NAME=release-7 \
COMMIT_SHA=rea0a2f \
COMMIT_TAG= \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?

yellowLog "Test tagging for a random branch"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH= \
BRANCH_NAME=random-7 \
COMMIT_SHA=rea0a2f \
COMMIT_TAG= \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?

yellowLog "Test tagging for a random branch with an open pull request"
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
PULL_REQUEST_BRANCH=myfeat \
BRANCH_NAME=random-7 \
COMMIT_SHA=rea0a2f \
COMMIT_TAG= \
./bin/tag-publish-docker-image --dry-run 2>&1 \
  | $currentDir/stripcolorcodes | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?
