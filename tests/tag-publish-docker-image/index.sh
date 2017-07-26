#!/bin/bash

yellowLog () { echo -e "\033[0;93m$*\033[0;0m"; }
greenLog () { echo -e "\033[0;32m$*\033[0;0m"; }
redLog () { echo -e "\033[0;31m$*\033[0;0m"; }
isLastCommandSuccessful () { [[ $1 == 0 ]]; }
assertTest () {
  if isLastCommandSuccessful $1; then
    greenLog "  Success"
  else
    redLog "  Fail"
  fi
}

yellowLog "Testing for --help argument."
./bin/tag-publish-docker-image \
  --help 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/help
assertTest $?

yellowLog "Testing for a feature branch (named myfeat) from the master branch."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch=master \
pull_request_branch=myfeat \
commit_hash=fea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/feature-branch
assertTest $?

yellowLog "Testing for merging on the master branch."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch=master \
pull_request_branch='' \
commit_hash=ma0a2fd \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/merge-master-branch
assertTest $?

yellowLog "Testing for merging on the release branch."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch=release-7 \
pull_request_branch='' \
commit_hash=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/merge-release-branch
assertTest $?

yellowLog "Testing for merging on a tag."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch='' \
pull_request_branch='' \
commit_hash=rea0a2f \
commit_tag=v4.2.0 \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/merge-release-tag
assertTest $?

yellowLog "Testing for a PR named myfeat from the release branch."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch=release-7 \
pull_request_branch=myfeat \
commit_hash=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?

yellowLog "Testing for merging on a random branch."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch=random-7 \
pull_request_branch='' \
commit_hash=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?

yellowLog "Testing for a PR named myfeat from a random branch."
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
git_branch=random-7 \
pull_request_branch=myfeat \
commit_hash=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?
